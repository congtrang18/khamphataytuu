$(document).ready(function () {
    // Khi check hoặc bỏ chọn checkbox
    $('.checkbox-styled__input').on('change', function () {
        const $checkbox = $(this); // Checkbox hiện tại
        const relicName = $checkbox.closest('label').find('.js-relic-name').text().trim(); // Lấy tên từ span.js-relic-name
        const value = $checkbox.val(); // Lấy giá trị checkbox

        console.log(value)

        if ($checkbox.is(':checked')) {
            // Thêm tag vào vùng js-search_field__tags
            const tagHtml = `
                <span class="search-field__tag" data-value="${value}">
                    <span>${relicName}</span>
                    <span class="js-remove_filter">
                        <i class="far fa-fw fa-times-circle"></i>
                    </span>
                </span>
            `;
            $('.js-search_field__tags').append(tagHtml);
        } else {
            // Bỏ tag khi bỏ chọn checkbox
            $(`.search-field__tag[data-value="${value}"]`).remove();
        }

        // Submit form mỗi khi checkbox thay đổi
        $('#form_relic_filter').submit();
    });

    // Khi click vào .js-remove_filter
    $('.js-search_field__tags').on('click', '.js-remove_filter', function () {
        const $tag = $(this).closest('.search-field__tag'); // Tag hiện tại
        const value = $tag.data('value'); // Lấy giá trị tương ứng với tag

        // Remove tag
        $tag.remove();

        // Uncheck checkbox tương ứng
        $(`.checkbox-styled__input[value="${value}"]`).prop('checked', false);

        // Submit form sau khi xóa tag
        $('#form_relic_filter').submit();
    });
});

$(document).ready(function () {
    // Chọn tất cả các ảnh có class js-fallback-image
    $('.js-fallback-image').each(function () {
        const $img = $(this);
        let defaultImage = baseUrl + '/images/placeholder.png';

        // Kiểm tra nếu ảnh bị lỗi khi tải
        $img.on('error', function () {
            $img.attr('src', defaultImage);
            $img.css({
                'object-fit': 'cover',
                'object-position': 'center',
            });
        });

        // Kiểm tra nếu src của ảnh không tồn tại (null hoặc rỗng)
        if (!$img.attr('src')) {
            $img.attr('src', defaultImage);
            $img.css({
                'object-fit': 'cover',
                'object-position': 'center',
            });
        }
    });
});

$(document).ready(() => {
    const $searchBox = $('.js-search_box');
    const apiUrl = $searchBox.data('url'); // URL API được đính trong data attribute
    const $input = $searchBox.find('input[type="text"]');
    const $results = $searchBox.find('.autocomplete-results');

    let debounceTimer = null;

    $input.on('input', function () {
        const query = $(this).val().trim();
        clearTimeout(debounceTimer);

        if (query.length > 2) {
            debounceTimer = setTimeout(() => {
                $.ajax({
                    url: apiUrl,
                    method: 'GET',
                    data: {keyword: query},
                    dataType: 'json',
                    success: (data) => {
                        let html = '';
                        if (data.html) {
                            html = data.html;
                        } else {
                            html = '<a class="tour__dropdown-item" href="#!">Không tìm thấy...</a>';
                        }
                        $results.html(html).slideDown();
                    },
                    error: () => {
                        $results.html('<a className="tour__dropdown-item" href="#!">Không tìm thấy...</a>').slideDown();
                    }
                });
            }, 100); // debounce delay 100ms
        } else {
            $results.slideUp();
        }
    });

    // Ẩn autocomplete khi click ra ngoài box search
    $(document).on('click', (e) => {
        if (!$(e.target).closest($searchBox).length) {
            $results.slideUp();
        }
    });
});

$(document).ready(function () {
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom >= 0;
    }

    function animateCounter($element, targetValue, prefix) {
        $({count: 0}).animate(
            {count: targetValue},
            {
                duration: 2000, // Thời gian đếm (2 giây)
                easing: "swing",
                step: function () {
                    $element.text(prefix + Math.floor(this.count)); // Giữ nguyên ký tự đặc biệt
                },
                complete: function () {
                    $element.text(prefix + targetValue); // Đảm bảo hiển thị số cuối cùng đúng
                }
            }
        );
    }

    function startCounterAnimation() {
        $(".counter__number").each(function () {
            const $this = $(this);
            const textValue = $this.text().trim(); // Lấy nội dung gốc
            const prefix = textValue.replace(/\d+/g, ""); // Lấy ký tự đặc biệt (+, >)
            const number = parseInt(textValue.replace(/\D/g, ""), 10); // Lấy số từ nội dung

            if (!$this.data("animated") && isElementInViewport(this)) {
                $this.data("animated", true); // Tránh chạy lại nhiều lần
                animateCounter($this, number, prefix);
            }
        });
    }

    // Kiểm tra khi trang tải và khi cuộn
    $(window).on("scroll load", function () {
        startCounterAnimation();
    });
});

$(document).ready(function () {
    const $search = $('.js-destination-search');
    const $dropdown = $('.js-destination-dropdown');
    const $empty = $('.js-destination-empty');

    function normalizeText(text) {
        return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
    }

    // Tự động đồng bộ danh sách tìm kiếm từ file relics-data.js (window.markersData)
    function syncDestinationList() {
        if (!$dropdown.length || !window.markersData) return;
        const markersData = window.markersData;
        const keys = Object.keys(markersData);
        if (keys.length === 0) return;

        // Xóa các item cũ và render danh sách đúng theo relics-data.js
        $dropdown.find('.js-destination-item').remove();
        keys.forEach((routeKey, index) => {
            const item = markersData[routeKey];
            const info = item.info || {};
            const title = info.title || '';
            const desc = info.description || '';
            const img = info.imageUrl || 'images/placeholder.png';
            const relicId = routeKey.replace('route_', '');

            const html = `
                <div class="route__item js-destination-item" data-name="${title}">
                    <label class="checkbox-styled">
                        <input class="checkbox-styled__input js-location-checkbox" type="checkbox"
                            name="location" value="${index + 1}"
                            data-destination-id="${index + 1}"
                            data-relics="${relicId}">
                        <span class="checkbox-styled__icon"></span>
                        <div class="route__item-image">
                            <img src="${img}" alt="${title}" onerror="this.src='images/placeholder.png'">
                        </div>
                        <div class="route__item-content">
                            <strong class="route__item-name">${title}</strong>
                            <span class="route__item-address">
                                <i class="fal fa-map-marker-alt"></i>
                                ${desc}
                            </span>
                        </div>
                    </label>
                </div>
            `;
            $dropdown.append(html);
        });
    }

    syncDestinationList();

    function filterDestinations(keyword) {
        if ($dropdown.find('.js-destination-item').length === 0) {
            syncDestinationList();
        }
        keyword = normalizeText(keyword);
        let found = 0;
        $dropdown.find('.js-destination-item').each(function () {
            const $item = $(this);
            const name = normalizeText($item.find('.route__item-name').text());
            const addr = normalizeText($item.find('.route__item-address').text());
            if (keyword === '' || name.includes(keyword) || addr.includes(keyword)) {
                $item.show();
                found++;
            } else {
                $item.hide();
            }
        });
        if (found === 0) {
            $empty.addClass('is-show');
        } else {
            $empty.removeClass('is-show');
        }
    }

    $search.on('click', function () {
        filterDestinations($(this).val());
        $dropdown.addClass('is-open');
    });
    $search.on('input', function () {
        filterDestinations($(this).val());
        $dropdown.addClass('is-open');
    });
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.route').length) {
            $dropdown.removeClass('is-open');
        }
    });

    window.syncDestinationList = syncDestinationList;
});


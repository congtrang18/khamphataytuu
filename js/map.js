/**
 * Bản đồ Tây Tựu 360
 * Sử dụng Google Maps Tile qua Leaflet - Không cần API Key, không lo Referrer
 * Thể hiện đầy đủ chủ quyền Quần đảo Hoàng Sa & Quần đảo Trường Sa (Việt Nam)
 */
(function () {
    'use strict';

    const DEFAULT_CENTER = [21.065, 105.742]; // Tâm Phường Tây Tựu, Hà Nội
    const DEFAULT_ZOOM = 14;

    let map = null;
    let markersLayer = null;
    let routeLine = null;
    let activeRouteGroup = null;
    let userMarker = null;
    let currentUserLocation = null;

    // Tọa độ chủ quyền biển đảo Việt Nam
    const SOVEREIGNTY_POINTS = [
        {
            name: "Quần đảo Hoàng Sa (Đà Nẵng, Việt Nam)",
            lat: 16.53,
            lng: 112.02
        },
        {
            name: "Quần đảo Trường Sa (Khánh Hòa, Việt Nam)",
            lat: 9.50,
            lng: 114.00
        }
    ];

    // Marker icon màu đỏ đặc trưng cho di tích
    function createCustomMarkerIcon() {
        return L.divIcon({
            className: 'custom-relic-marker',
            html: `
                <div style="
                    position: relative;
                    width: 30px;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <svg viewBox="0 0 384 512" width="30" height="38" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                        <path fill="#419481" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
                        <circle cx="192" cy="192" r="80" fill="#ffffff"/>
                    </svg>
                </div>
            `,
            iconSize: [30, 38],
            iconAnchor: [15, 38],
            popupAnchor: [0, -38]
        });
    }

    function initMap() {
        const mapEl = document.getElementById("map");
        if (!mapEl) {
            console.error('[Bản đồ Tây Tựu] Không tìm thấy phần tử #map!');
            return;
        }

        if (typeof L === 'undefined') {
            console.error('[Bản đồ Tây Tựu] Thư viện Leaflet chưa được tải!');
            return;
        }

        // Đảm bảo chiều cao container
        if (mapEl.offsetHeight === 0) {
            mapEl.style.height = '520px';
        }

        try {
            map = L.map('map', {
                center: DEFAULT_CENTER,
                zoom: DEFAULT_ZOOM,
                minZoom: 4,
                maxZoom: 19,
                scrollWheelZoom: true
            });

            // 1. Google Maps Road Map layer (tiếng Việt, không cần API Key, CDN siêu nhanh)
            const googleRoadMap = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}', {
                subdomains: ['0', '1', '2', '3'],
                maxZoom: 20,
                attribution: '© Google Maps | Bản đồ Việt Nam'
            });

            // 2. Google Maps Hybrid layer (Ảnh vệ tinh + tên đường tiếng Việt)
            const googleHybrid = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&hl=vi&x={x}&y={y}&z={z}', {
                subdomains: ['0', '1', '2', '3'],
                maxZoom: 20,
                attribution: '© Google Maps'
            });

            // Thêm lớp mặc định
            googleRoadMap.addTo(map);

            // Layer ranh giới Phường Tây Tựu
            let tayTuuBoundaryLayer = null;
            const boundaryCoords = window.TAY_TUU_BOUNDARY;
            if (Array.isArray(boundaryCoords) && boundaryCoords.length > 0) {
                const tayTuuPolygon = L.polygon(boundaryCoords, {
                    color: '#e63946',
                    weight: 2.5,
                    opacity: 0.9,
                    fillColor: '#e63946',
                    fillOpacity: 0.12,
                    dashArray: '5, 5'
                });

                tayTuuPolygon.bindTooltip("<b>Ranh giới Phường Tây Tựu</b>", {
                    sticky: true,
                    direction: 'top',
                    className: 'boundary-tooltip'
                });

                tayTuuPolygon.on('mouseover', function () {
                    this.setStyle({
                        weight: 3.5,
                        fillOpacity: 0.25
                    });
                });

                tayTuuPolygon.on('mouseout', function () {
                    this.setStyle({
                        weight: 2.5,
                        fillOpacity: 0.12
                    });
                });

                tayTuuBoundaryLayer = L.layerGroup([tayTuuPolygon]);
                tayTuuBoundaryLayer.addTo(map);
            }

            // Menu chuyển đổi loại bản đồ (Base maps) và các lớp phủ (Overlays)
            const baseMaps = {
                "Bản đồ tiêu chuẩn": googleRoadMap,
                "Ảnh vệ tinh": googleHybrid
            };

            const overlayMaps = {};
            if (tayTuuBoundaryLayer) {
                overlayMaps["Ranh giới"] = tayTuuBoundaryLayer;
            }

            L.control.layers(baseMaps, overlayMaps, { position: 'topright' }).addTo(map);

            // Layer chứa các marker di tích
            markersLayer = L.layerGroup().addTo(map);

            // Đánh dấu cố định chủ quyền 2 Quần đảo Hoàng Sa và Trường Sa
            const sovereigntyIcon = L.divIcon({
                className: 'sovereignty-icon',
                html: '<div style="width:14px;height:14px;background:#dc3545;border:2px solid #ffd700;border-radius:50%;box-shadow:0 0 8px rgba(220,53,69,0.9);"></div>',
                iconSize: [14, 14],
                iconAnchor: [7, 7]
            });

            SOVEREIGNTY_POINTS.forEach(pt => {
                const marker = L.marker([pt.lat, pt.lng], { icon: sovereigntyIcon, interactive: true }).addTo(map);
                marker.bindTooltip(`★ ${pt.name}`, {
                    permanent: true,
                    direction: 'top',
                    className: 'sovereignty-label',
                    offset: [0, -8]
                });
            });

            // Render các tuyến và marker mặc định ban đầu
            renderDefaultRoutes();

            // Khắc phục lỗi render kích thước trắng bằng invalidateSize
            setTimeout(() => { if (map) map.invalidateSize(); }, 200);
            setTimeout(() => { if (map) map.invalidateSize(); }, 600);
            setTimeout(() => { if (map) map.invalidateSize(); }, 1200);

            console.log('[Bản đồ Tây Tựu] Khởi tạo bản đồ thành công!');
        } catch (e) {
            console.error('[Bản đồ Tây Tựu] Lỗi khi tạo bản đồ:', e);
        }
    }

    function createUserLocationIcon() {
        return L.divIcon({
            className: 'user-location-marker',
            html: `
                <div class="user-location-pulse"></div>
                <div class="user-location-pin"></div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
    }

    /**
     * Tạo nội dung Info Popup nhỏ trên bản đồ (Tóm tắt gọn gàng + nút mở Popup lớn xem chi tiết)
     */
    function createPopupContent(loc, locIndex) {
        const info = (loc && loc.info) ? loc.info : {};
        const title = info.title || '';
        const desc = info.description || '';
        const ranking = info.ranking || '';
        const abbot = info.abbot || '';
        const manager = info.manager || '';
        const area = info.area || '';
        const landStatus = info.landStatus || '';
        const otherIssues = info.otherIssues || '';
        const activityStatus = info.activityStatus || '';
        const note = info.note || '';
        const lat = loc.lat;
        const lng = loc.lng;
        const safeTitle = title.replace(/'/g, "\\'");
        const imgSrc = info.imageUrl ? info.imageUrl.trim() : 'images/placeholder.png';
        const vrUrl = info.url_vrtour ? info.url_vrtour.trim() : '';

        const leaderTitle = abbot ? 'Trụ trì' : (manager ? 'Quản lý' : '');
        const leaderName = abbot || manager;

        // Tóm tắt 1 mục nội dung dài (nếu có) để hiển thị gọn trong popup nhỏ
        const previewLabel = landStatus ? 'Đất đai' : (otherIssues ? 'Lịch sử' : (activityStatus ? 'Hiện vật' : ''));
        const previewText = landStatus || otherIssues || activityStatus || '';

        return `
            <div class="relic-popup">
                <div class="relic-popup__media" onclick="window.openRelicDetailModal(${locIndex})" title="Nhấn để xem chi tiết">
                    <img src="${imgSrc}" alt="${title}" onerror="this.onerror=null; this.src='images/placeholder.png';" />
                </div>
                <div class="relic-popup__body">
                    <div class="relic-popup__header">
                        <h3 class="relic-popup__title" onclick="window.openRelicDetailModal(${locIndex})" style="cursor:pointer;" title="Nhấn để xem chi tiết">${title}</h3>
                        <div class="relic-popup__sub">
                            <span class="relic-popup__addr"><i class="fal fa-map-marker-alt"></i> ${desc}</span>
                            ${ranking ? `<span class="relic-popup__rank-dot">•</span><span class="relic-popup__rank">${ranking}</span>` : ''}
                        </div>
                    </div>

                    <div class="relic-popup__info-list">
                        ${area ? `
                            <div class="relic-popup__info-row">
                                <span class="info-label">Diện tích:</span>
                                <span class="info-val info-val--clamp-1">${area}</span>
                            </div>
                        ` : ''}
                        ${leaderName ? `
                            <div class="relic-popup__info-row">
                                <span class="info-label">${leaderTitle}:</span>
                                <span class="info-val info-val--clamp-1">${leaderName}</span>
                            </div>
                        ` : ''}
                        ${previewText ? `
                            <div class="relic-popup__info-row">
                                <span class="info-label">${previewLabel}:</span>
                                <span class="info-val info-val--clamp-2">${previewText}</span>
                            </div>
                        ` : ''}
                        ${note ? `
                            <div class="relic-popup__info-row">
                                <span class="info-label">Quyết định:</span>
                                <span class="info-val info-val--clamp-1">${note}</span>
                            </div>
                        ` : ''}
                    </div>

                    <div class="relic-popup__actions">
                        <button type="button" class="relic-popup__btn-detail" onclick="window.openRelicDetailModal(${locIndex})">
                            <i class="fas fa-file-alt"></i> Chi tiết
                        </button>
                        ${vrUrl ? `
                            <a href="${vrUrl}" target="_blank" class="relic-popup__btn-vr">
                                <i class="fal fa-vr-cardboard"></i> VR 360°
                            </a>
                        ` : ''}
                        <button type="button" class="relic-popup__btn-route" onclick="window.routeFromUserLocation(${lat}, ${lng}, '${safeTitle}')">
                            <i class="fas fa-location-arrow"></i> Chỉ đường
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Khởi tạo và mở Modal lớn hiển thị đầy đủ thông tin di tích chia theo các đầu mục
     */
    let currentRenderedLocations = [];

    function ensureDetailModalDOM() {
        let modal = document.getElementById('relic-detail-modal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'relic-detail-modal';
        modal.className = 'relic-modal';
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `
            <div class="relic-modal__backdrop" onclick="window.closeRelicDetailModal()"></div>
            <div class="relic-modal__dialog" role="dialog" aria-modal="true">
                <div id="relic-modal-content" class="relic-modal__content"></div>
            </div>
        `;
        document.body.appendChild(modal);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) {
                closeRelicDetailModal();
            }
        });

        return modal;
    }

    function openRelicDetailModal(locIndex) {
        const loc = currentRenderedLocations[locIndex];
        if (!loc) return;

        const modal = ensureDetailModalDOM();
        const contentEl = document.getElementById('relic-modal-content');
        if (!contentEl) return;

        const info = loc.info || {};
        const title = info.title || 'Di tích lịch sử - văn hóa';
        const category = info.category || '';
        const worship = info.worship || '';
        const desc = info.description || 'Phường Tây Tựu';
        const ranking = info.ranking || 'Chưa xếp hạng';
        const abbot = info.abbot || '';
        const manager = info.manager || '';
        const area = info.area || 'Đang cập nhật';
        const intro = info.intro || '';
        const history = info.history || '';
        const architecture = info.architecture || '';
        const festival = info.festival || '';
        const landStatus = info.landStatus || '';
        const otherIssues = info.otherIssues || '';
        const activityStatus = info.activityStatus || '';
        const note = info.note || 'Đang cập nhật';
        const lat = loc.lat;
        const lng = loc.lng;
        const safeTitle = title.replace(/'/g, "\\'");
        const imgSrc = info.imageUrl ? info.imageUrl.trim() : 'images/placeholder.png';
        const vrUrl = info.url_vrtour ? info.url_vrtour.trim() : '';
console.log(vrUrl);
        const leaderTitle = abbot ? 'Trụ trì' : 'Người quản lý';
        const leaderName = abbot || manager || 'Ban quản lý di tích';

        const rankLabel = category || (ranking.toLowerCase().includes('chưa')
            ? 'Di tích lịch sử - văn hóa'
            : `Di tích cấp ${ranking}`);

        // Nội dung văn bản cho từng Tab từ dữ liệu chuẩn
        const overviewParagraphs = [];
        if (intro) {
            overviewParagraphs.push(intro);
        } else {
            overviewParagraphs.push(
                `<strong>${title}</strong> tọa lạc tại <strong>${desc}, Phường Tây Tựu</strong>, Thành phố Hà Nội.`
            );
        }
        if (worship) {
            overviewParagraphs.push(`<strong>Đối tượng thờ:</strong> ${worship}.`);
        }
        if (history) {
            overviewParagraphs.push(history);
        }
        if (architecture) {
            overviewParagraphs.push(architecture);
        }
        if (festival) {
            overviewParagraphs.push(festival);
        }
        if (landStatus) {
            overviewParagraphs.push(`<strong>Hiện trạng quản lý đất đai:</strong> ${landStatus}`);
        }

        const landParts = [];
        if (architecture) {
            landParts.push(`<p class="boss-popup__desc"><strong>Kiến trúc & Di vật:</strong> ${architecture}</p>`);
        }
        if (landStatus) {
            landParts.push(`<p class="boss-popup__desc"><strong>Hiện trạng quản lý đất đai:</strong> ${landStatus}</p>`);
        }
        if (landParts.length === 0) {
            landParts.push(`<p class="boss-popup__desc">Đang chờ bổ sung từ hồ sơ khoa học di tích.</p>`);
        }
        const landHtml = landParts.join('');

        const historyText = history || otherIssues;
        const historyHtml = historyText
            ? `<p class="boss-popup__desc">${historyText}</p>`
            : `<p class="boss-popup__desc">Đang chờ bổ sung từ hồ sơ khoa học di tích.</p>`;

        const cultureParts = [];
        if (worship) {
            cultureParts.push(`<p class="boss-popup__desc"><strong>Đối tượng thờ:</strong> ${worship}.</p>`);
        }
        if (festival) {
            cultureParts.push(`<p class="boss-popup__desc"><strong>Lễ hội:</strong> ${festival}</p>`);
        }
        if (architecture) {
            cultureParts.push(`<p class="boss-popup__desc"><strong>Di vật & Không gian thờ tự:</strong> ${architecture}</p>`);
        } else if (activityStatus) {
            cultureParts.push(`<p class="boss-popup__desc">${activityStatus}</p>`);
        }
        if (cultureParts.length === 0) {
            cultureParts.push(`<p class="boss-popup__desc">Đang chờ bổ sung từ hồ sơ khoa học di tích.</p>`);
        }
        const cultureHtml = cultureParts.join('');

        const tabs = [
            {
                id: 'tab-overview',
                label: 'Tổng quan',
                html: overviewParagraphs.map(p => `<p class="boss-popup__desc">${p}</p>`).join('')
            },
            { id: 'tab-land', label: 'Đất đai & Kiến trúc', html: landHtml },
            { id: 'tab-history', label: 'Lịch sử', html: historyHtml },
            { id: 'tab-culture', label: 'Văn hóa & Hiện vật', html: cultureHtml }
        ];

        const tabsNavHtml = tabs.map((t, i) => `
            <button type="button" class="boss-popup__tab ${i === 0 ? 'is-active' : ''}" data-tab="${t.id}">
                ${t.label}
            </button>
        `).join('');

        const tabsPanelsHtml = tabs.map((t, i) => `
            <div class="boss-popup__panel ${i === 0 ? 'is-active' : ''}" id="${t.id}">
                ${t.html}
            </div>
        `).join('');

        const vrActionHtml = vrUrl
            ? `<a href="${vrUrl}" target="_blank" class="boss-popup__btn boss-popup__btn--vr"><i class="fal fa-vr-cardboard"></i> Xem 360°</a>`
            : '';

        contentEl.innerHTML = `
            <div class="boss-popup">
                <!-- Phần ảnh minh họa: Tên di tích và Địa chỉ nằm ngay bên dưới -->
                <div class="boss-popup__hero">
                    <img src="${imgSrc}" alt="${title}" onerror="this.onerror=null; this.src='images/placeholder.png';" />
                    <div class="boss-popup__hero-overlay"></div>
                    <span class="boss-popup__tag">${rankLabel}</span>
                    <button type="button" class="boss-popup__close" onclick="window.closeRelicDetailModal()" title="Đóng">&times;</button>
                    <div class="boss-popup__hero-text">
                        <h2 class="boss-popup__title">${title}</h2>
                        <div class="boss-popup__address">
                            <i class="fas fa-map-marker-alt"></i> ${desc}, Phường Tây Tựu, Hà Nội
                        </div>
                    </div>
                </div>

                <!-- Phần chia 3: Diện tích, Người quản lý và Quyết định -->
                <div class="boss-popup__stats">
                    <div class="boss-popup__stat-col boss-popup__stat-col--compact">
                        <span class="boss-popup__stat-label">Diện tích</span>
                        <strong class="boss-popup__stat-val">${area}</strong>
                    </div>
                    <div class="boss-popup__stat-col">
                        <span class="boss-popup__stat-label">${leaderTitle}</span>
                        <strong class="boss-popup__stat-val">${leaderName}</strong>
                    </div>
                    <div class="boss-popup__stat-col">
                        <span class="boss-popup__stat-label">Quyết định</span>
                        <strong class="boss-popup__stat-val">${note}</strong>
                    </div>
                </div>

                <!-- Thanh chuyển Tab -->
                <div class="boss-popup__tabs" role="tablist">
                    ${tabsNavHtml}
                </div>

                <!-- Nội dung chi tiết tự giãn theo chiều cao 90vh -->
                <div class="boss-popup__body">
                    ${tabsPanelsHtml}
                </div>

                <!-- Hai nút hành động cuối Popup -->
                <div class="boss-popup__footer">
                    ${vrActionHtml}
                    <button type="button" class="boss-popup__btn boss-popup__btn--route" onclick="window.closeRelicDetailModal(); window.routeFromUserLocation(${lat}, ${lng}, '${safeTitle}');">
                        <i class="fas fa-location-arrow"></i> Chỉ đường
                    </button>
                </div>
            </div>
        `;

        // Xử lý chuyển đổi giữa các Tab
        const tabBtns = contentEl.querySelectorAll('.boss-popup__tab');
        const tabPanels = contentEl.querySelectorAll('.boss-popup__panel');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const targetId = this.getAttribute('data-tab');
                tabBtns.forEach(b => b.classList.remove('is-active'));
                tabPanels.forEach(p => p.classList.remove('is-active'));
                this.classList.add('is-active');
                const activePanel = contentEl.querySelector('#' + targetId);
                if (activePanel) activePanel.classList.add('is-active');
            });
        });

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeRelicDetailModal() {
        const modal = document.getElementById('relic-detail-modal');
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    /**
     * Hiển thị Card tóm tắt lộ trình (km & phút)
     */
    function showRouteCard(startName, endName, distanceText, durationText, gmapsUrl) {
        const card = document.getElementById('route-card');
        if (!card) return;

        const startEl = document.getElementById('route-start-text');
        const endEl = document.getElementById('route-end-text');
        const distEl = document.getElementById('route-distance-text');
        const durEl = document.getElementById('route-duration-text');
        const gmapsBtn = document.getElementById('btn-open-gmaps');

        if (startEl) startEl.textContent = startName || 'Điểm xuất phát';
        if (endEl) endEl.textContent = endName || 'Điểm đến';
        if (distEl) distEl.textContent = distanceText || '-- km';
        if (durEl) durEl.textContent = durationText || '-- phút';
        if (gmapsBtn) gmapsBtn.href = gmapsUrl || '#';

        card.style.display = 'block';
    }

    /**
     * Xóa tuyến đường đang hiển thị
     */
    function clearRoute() {
        if (activeRouteGroup && map) {
            map.removeLayer(activeRouteGroup);
            activeRouteGroup = null;
        }
        if (routeLine && map) {
            map.removeLayer(routeLine);
            routeLine = null;
        }
        const card = document.getElementById('route-card');
        if (card) card.style.display = 'none';
    }

    /**
     * Tính toán và vẽ đường đi thực tế theo mạng lưới giao thông (OSRM)
     */
    function calculateAndDrawRoute(waypoints, waypointNames) {
        if (!map || !Array.isArray(waypoints) || waypoints.length < 2) {
            clearRoute();
            return;
        }

        const startName = waypointNames && waypointNames[0] ? waypointNames[0] : 'Điểm 1';
        const endName = waypointNames && waypointNames[waypointNames.length - 1] ? waypointNames[waypointNames.length - 1] : `Điểm ${waypoints.length}`;

        showRouteCard(startName, endName, 'Đang tính...', 'Đang tính...', '#');

        const coordString = waypoints.map(p => `${p[1]},${p[0]}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    const distKm = (route.distance / 1000).toFixed(1) + ' km';
                    const durMin = Math.max(1, Math.round(route.duration / 60)) + ' phút';
                    const latLngs = route.geometry.coordinates.map(c => [c[1], c[0]]);

                    if (activeRouteGroup) {
                        map.removeLayer(activeRouteGroup);
                        activeRouteGroup = null;
                    }
                    if (routeLine) {
                        map.removeLayer(routeLine);
                        routeLine = null;
                    }

                    // Đường viền ngoài xanh lam + vệt chỉ đường chính chuẩn Google Maps
                    const shadowLine = L.polyline(latLngs, {
                        color: '#0d6efd',
                        weight: 8,
                        opacity: 0.35,
                        lineCap: 'round',
                        lineJoin: 'round'
                    });

                    const mainLine = L.polyline(latLngs, {
                        color: '#1a73e8',
                        weight: 5,
                        opacity: 0.95,
                        lineCap: 'round',
                        lineJoin: 'round'
                    });

                    activeRouteGroup = L.layerGroup([shadowLine, mainLine]).addTo(map);
                    map.fitBounds(latLngs, { padding: [50, 50], maxZoom: 16 });

                    const startPt = waypoints[0];
                    const endPt = waypoints[waypoints.length - 1];
                    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startPt[0]},${startPt[1]}&destination=${endPt[0]},${endPt[1]}&travelmode=driving`;

                    showRouteCard(startName, endName, distKm, durMin, gmapsUrl);
                } else {
                    throw new Error('OSRM routing return code not Ok');
                }
            })
            .catch(err => {
                console.warn('[Bản đồ] Dùng khoảng cách đường thẳng dự phòng:', err);
                let totalMeters = 0;
                for (let i = 0; i < waypoints.length - 1; i++) {
                    totalMeters += map.distance(waypoints[i], waypoints[i + 1]);
                }
                const distKm = (totalMeters / 1000).toFixed(1) + ' km (chim bay)';
                const durMin = Math.max(1, Math.round((totalMeters / 1000) * 2.5)) + ' phút';

                if (activeRouteGroup) {
                    map.removeLayer(activeRouteGroup);
                    activeRouteGroup = null;
                }

                const fallbackLine = L.polyline(waypoints, {
                    color: '#1a73e8',
                    weight: 4,
                    dashArray: '6, 6',
                    opacity: 0.85
                });
                activeRouteGroup = L.layerGroup([fallbackLine]).addTo(map);
                map.fitBounds(waypoints, { padding: [50, 50] });

                const startPt = waypoints[0];
                const endPt = waypoints[waypoints.length - 1];
                const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startPt[0]},${startPt[1]}&destination=${endPt[0]},${endPt[1]}&travelmode=driving`;

                showRouteCard(startName, endName, distKm, durMin, gmapsUrl);
            });
    }

    /**
     * Xác định vị trí GPS của người dùng
     */
    function locateUser(callback) {
        if (!navigator.geolocation) {
            alert('Trình duyệt của bạn không hỗ trợ định vị GPS.');
            return;
        }

        const locateBtn = document.getElementById('btn-user-locate');
        if (locateBtn) locateBtn.classList.add('is-active');

        navigator.geolocation.getCurrentPosition(
            position => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                currentUserLocation = { lat: userLat, lng: userLng, name: 'Vị trí của bạn' };

                if (userMarker) {
                    userMarker.setLatLng([userLat, userLng]);
                } else {
                    userMarker = L.marker([userLat, userLng], {
                        icon: createUserLocationIcon(),
                        zIndexOffset: 1000
                    }).addTo(map);
                    userMarker.bindTooltip('<b>Vị trí của bạn</b>', { permanent: false, direction: 'top' });
                }

                if (callback) {
                    callback(currentUserLocation);
                } else {
                    map.setView([userLat, userLng], 15);
                }
            },
            error => {
                if (locateBtn) locateBtn.classList.remove('is-active');
                console.warn('[Geolocation error]:', error);
                alert('Không thể xác định vị trí của bạn. Vui lòng cho phép quyền truy cập vị trí trong trình duyệt.');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
        );
    }

    /**
     * Chỉ đường từ vị trí người dùng đến di tích
     */
    function routeFromUserLocation(targetLat, targetLng, targetTitle) {
        if (currentUserLocation) {
            calculateAndDrawRoute(
                [[currentUserLocation.lat, currentUserLocation.lng], [targetLat, targetLng]],
                ['Vị trí của bạn', targetTitle]
            );
        } else {
            locateUser(userLoc => {
                calculateAndDrawRoute(
                    [[userLoc.lat, userLoc.lng], [targetLat, targetLng]],
                    ['Vị trí của bạn', targetTitle]
                );
            });
        }
    }

    /**
     * Render các markers và vẽ tuyến đường
     */
    function renderMarkersAndCentering(locations) {
        if (!map || !markersLayer) return;

        markersLayer.clearLayers();
        clearRoute();

        if (!Array.isArray(locations) || locations.length === 0) {
            map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
            return;
        }

        const latLngs = [];
        const markerIcon = createCustomMarkerIcon();
        currentRenderedLocations = locations;

        locations.forEach((loc, idx) => {
            const lat = Number(loc.lat);
            const lng = Number(loc.lng);
            if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

            const latLng = [lat, lng];
            latLngs.push(latLng);

            const marker = L.marker(latLng, { icon: markerIcon });
            const popupHtml = createPopupContent(loc, idx);
            const isMobile = window.innerWidth < 520;
            marker.bindPopup(popupHtml, {
                maxWidth: isMobile ? 320 : 510,
                minWidth: isMobile ? 280 : 480,
                className: 'relic-leaflet-popup'
            });

            markersLayer.addLayer(marker);
        });

        // Nếu người dùng chọn từ 2 địa điểm trở lên: Tự động vẽ tuyến đường thực tế qua các điểm
        if (locations.length >= 2) {
            const waypoints = locations.map(l => [Number(l.lat), Number(l.lng)]);
            const waypointNames = locations.map(l => (l.info && l.info.title) ? l.info.title : 'Điểm di tích');
            calculateAndDrawRoute(waypoints, waypointNames);
        } else if (latLngs.length === 1) {
            map.setView(latLngs[0], 15);
        }
    }

    /**
     * Render tuyến mặc định từ window.defaultRoutes
     */
    function renderDefaultRoutes() {
        const defaultRoutes = window.defaultRoutes || [];
        const markersData = window.markersData || {};

        const list = defaultRoutes
            .map(routeName => markersData[routeName])
            .filter(Boolean);

        renderMarkersAndCentering(list);
    }

    // Khởi động khi DOM sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }

    function onReady() {
        if (typeof window.syncDestinationList === 'function') {
            window.syncDestinationList();
        }

        initMap();

        // Gắn sự kiện nút định vị GPS của người dùng
        const locateBtn = document.getElementById('btn-user-locate');
        if (locateBtn) {
            locateBtn.addEventListener('click', function () {
                locateUser();
            });
        }

        // Gắn sự kiện nút đóng khung chỉ đường
        const closeCardBtn = document.getElementById('route-card-close');
        if (closeCardBtn) {
            closeCardBtn.addEventListener('click', function () {
                clearRoute();
            });
        }

        // Bắt sự kiện lọc checkbox địa điểm (dùng delegated để nhận cả khi render động)
        if (typeof $ !== 'undefined') {
            $(document).on('change', '.js-location-checkbox', function () {
                const checkedRoutes = [];
                let routeIds = [];
                let count = 0;

                $('.js-location-checkbox').each(function () {
                    if (this.checked) {
                        let relics = $(this).data('relics');
                        relics = String(relics).split(',');
                        routeIds = [...routeIds, ...relics];
                        count++;
                    }
                });

                const markersData = window.markersData || {};

                if (count) {
                    routeIds = [...new Set(routeIds)];

                    routeIds.forEach(routeId => {
                        const routeName = 'route_' + routeId;
                        if (markersData[routeName]) {
                            checkedRoutes.push(markersData[routeName]);
                        }
                    });

                    renderMarkersAndCentering(checkedRoutes);
                } else {
                    renderDefaultRoutes();
                }
            });
        }
    }

    // Đảm bảo map resize lại khi cửa sổ trình duyệt thay đổi
    window.addEventListener('resize', function () {
        if (map) map.invalidateSize();
    });

    // Expose ra window để gọi từ Popup
    window.routeFromUserLocation = routeFromUserLocation;
    window.clearCurrentRoute = clearRoute;
    window.openRelicDetailModal = openRelicDetailModal;
    window.closeRelicDetailModal = closeRelicDetailModal;

})();

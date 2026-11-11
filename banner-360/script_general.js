(function(){
let translateObjs = {};
const trans = (...a) => {
    return translateObjs[a[0x0]] = a, '';
};
function regTextVar(a, b) {
    var c = ![];
    return d(b);
    function d(k, l) {
        switch (k['toLowerCase']()) {
        case 'title':
        case 'subtitle':
        case 'photo.title':
        case 'photo.description':
            var m = (function () {
                switch (k['toLowerCase']()) {
                case 'title':
                case 'photo.title':
                    return 'media.label';
                case 'subtitle':
                    return 'media.data.subtitle';
                case 'photo.description':
                    return 'media.data.description';
                }
            }());
            if (m)
                return function () {
                    var r, s, t = (l && l['viewerName'] ? this['getComponentByName'](l['viewerName']) : undefined) || this['getMainViewer']();
                    if (k['toLowerCase']()['startsWith']('photo'))
                        r = this['getByClassName']('PhotoAlbumPlayListItem')['filter'](function (v) {
                            var w = v['get']('player');
                            return w && w['get']('viewerArea') == t;
                        })['map'](function (v) {
                            return v['get']('media')['get']('playList');
                        });
                    else
                        r = this['_getPlayListsWithViewer'](t), s = j['bind'](this, t);
                    if (!c) {
                        for (var u = 0x0; u < r['length']; ++u) {
                            r[u]['bind']('changing', f, this);
                        }
                        c = !![];
                    }
                    return i['call'](this, r, m, s);
                };
            break;
        case 'tour.name':
        case 'tour.description':
            return function () {
                return this['get']('data')['tour']['locManager']['trans'](k);
            };
        default:
            if (k['toLowerCase']()['startsWith']('viewer.')) {
                var n = k['split']('.'), o = n[0x1];
                if (o) {
                    var p = n['slice'](0x2)['join']('.');
                    return d(p, { 'viewerName': o });
                }
            } else {
                if (k['toLowerCase']()['startsWith']('quiz.') && 'Quiz' in TDV) {
                    var q = undefined, m = (function () {
                            switch (k['toLowerCase']()) {
                            case 'quiz.questions.answered':
                                return TDV['Quiz']['PROPERTY']['QUESTIONS_ANSWERED'];
                            case 'quiz.question.count':
                                return TDV['Quiz']['PROPERTY']['QUESTION_COUNT'];
                            case 'quiz.items.found':
                                return TDV['Quiz']['PROPERTY']['ITEMS_FOUND'];
                            case 'quiz.item.count':
                                return TDV['Quiz']['PROPERTY']['ITEM_COUNT'];
                            case 'quiz.score':
                                return TDV['Quiz']['PROPERTY']['SCORE'];
                            case 'quiz.score.total':
                                return TDV['Quiz']['PROPERTY']['TOTAL_SCORE'];
                            case 'quiz.time.remaining':
                                return TDV['Quiz']['PROPERTY']['REMAINING_TIME'];
                            case 'quiz.time.elapsed':
                                return TDV['Quiz']['PROPERTY']['ELAPSED_TIME'];
                            case 'quiz.time.limit':
                                return TDV['Quiz']['PROPERTY']['TIME_LIMIT'];
                            case 'quiz.media.items.found':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_ITEMS_FOUND'];
                            case 'quiz.media.item.count':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_ITEM_COUNT'];
                            case 'quiz.media.questions.answered':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_QUESTIONS_ANSWERED'];
                            case 'quiz.media.question.count':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_QUESTION_COUNT'];
                            case 'quiz.media.score':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_SCORE'];
                            case 'quiz.media.score.total':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_TOTAL_SCORE'];
                            case 'quiz.media.index':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_INDEX'];
                            case 'quiz.media.count':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_COUNT'];
                            case 'quiz.media.visited':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_VISITED_COUNT'];
                            default:
                                var s = /quiz\.([\w_]+)\.(.+)/['exec'](k);
                                if (s) {
                                    q = s[0x1];
                                    switch ('quiz.' + s[0x2]) {
                                    case 'quiz.score':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['SCORE'];
                                    case 'quiz.score.total':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['TOTAL_SCORE'];
                                    case 'quiz.media.items.found':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_ITEMS_FOUND'];
                                    case 'quiz.media.item.count':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_ITEM_COUNT'];
                                    case 'quiz.media.questions.answered':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_QUESTIONS_ANSWERED'];
                                    case 'quiz.media.question.count':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_QUESTION_COUNT'];
                                    case 'quiz.questions.answered':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['QUESTIONS_ANSWERED'];
                                    case 'quiz.question.count':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['QUESTION_COUNT'];
                                    case 'quiz.items.found':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['ITEMS_FOUND'];
                                    case 'quiz.item.count':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['ITEM_COUNT'];
                                    case 'quiz.media.score':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_SCORE'];
                                    case 'quiz.media.score.total':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_TOTAL_SCORE'];
                                    }
                                }
                            }
                        }());
                    if (m)
                        return function () {
                            var r = this['get']('data')['quiz'];
                            if (r) {
                                if (!c) {
                                    if (q != undefined) {
                                        if (q == 'global') {
                                            var s = this['get']('data')['quizConfig'], t = s['objectives'];
                                            for (var u = 0x0, v = t['length']; u < v; ++u) {
                                                r['bind'](TDV['Quiz']['EVENT_OBJECTIVE_PROPERTIES_CHANGE'], h['call'](this, t[u]['id'], m), this);
                                            }
                                        } else
                                            r['bind'](TDV['Quiz']['EVENT_OBJECTIVE_PROPERTIES_CHANGE'], h['call'](this, q, m), this);
                                    } else
                                        r['bind'](TDV['Quiz']['EVENT_PROPERTIES_CHANGE'], g['call'](this, m), this);
                                    c = !![];
                                }
                                try {
                                    var w = 0x0;
                                    if (q != undefined) {
                                        if (q == 'global') {
                                            var s = this['get']('data')['quizConfig'], t = s['objectives'];
                                            for (var u = 0x0, v = t['length']; u < v; ++u) {
                                                w += r['getObjective'](t[u]['id'], m);
                                            }
                                        } else
                                            w = r['getObjective'](q, m);
                                    } else {
                                        w = r['get'](m);
                                        if (m == TDV['Quiz']['PROPERTY']['PANORAMA_INDEX'])
                                            w += 0x1;
                                    }
                                    return w;
                                } catch (x) {
                                    return undefined;
                                }
                            }
                        };
                }
            }
            break;
        }
        return function () {
            return '';
        };
    }
    function e() {
        var k = this['get']('data');
        k['updateText'](k['translateObjs'][a], a['split']('.')[0x0]);
        let l = a['split']('.'), m = l[0x0] + '_vr';
        m in this && k['updateText'](k['translateObjs'][a], m);
    }
    function f(k) {
        var l = k['data']['nextSelectedIndex'];
        if (l >= 0x0) {
            var m = k['source']['get']('items')[l], n = function () {
                    m['unbind']('begin', n, this), e['call'](this);
                };
            m['bind']('begin', n, this);
        }
    }
    function g(k) {
        return function (l) {
            k in l && e['call'](this);
        }['bind'](this);
    }
    function h(k, l) {
        return function (m, n) {
            k == m && l in n && e['call'](this);
        }['bind'](this);
    }
    function i(k, l, m) {
        for (var n = 0x0; n < k['length']; ++n) {
            var o = k[n], p = o['get']('selectedIndex');
            if (p >= 0x0) {
                var q = l['split']('.'), r = o['get']('items')[p];
                if (m !== undefined && !m['call'](this, r))
                    continue;
                for (var s = 0x0; s < q['length']; ++s) {
                    if (r == undefined)
                        return '';
                    r = 'get' in r ? r['get'](q[s]) : r[q[s]];
                }
                return r;
            }
        }
        return '';
    }
    function j(k, l) {
        var m = l['get']('player');
        return m !== undefined && m['get']('viewerArea') == k;
    }
}
var script = {"width":"100%","watermark":false,"vrPolyfillScale":0.5,"backgroundColorRatios":[0],"start":"this.init()","id":"rootPlayer","data":{"locales":{"vi":"locale/vi.txt","en":"locale/en.txt"},"initialScale":0.5,"textToSpeechConfig":{"pitch":1,"speechOnQuizQuestion":false,"stopBackgroundAudio":false,"rate":1,"speechOnTooltip":false,"volume":1,"speechOnInfoWindow":false},"forceDefaultLocale":true,"defaultLocale":"vi","displayTooltipInTouchScreens":true,"history":{},"name":"Player14994"},"backgroundColor":["#000000"],"propagateClick":false,"scrollBarColor":"#000000","layout":"absolute","class":"Player","gap":10,"minHeight":20,"minWidth":20,"scrollBarMargin":2,"hash": "f2648fb74b57dcb1d1bc9dce47b52cd038c69712122b689401d60bf83acb6005", "definitions": [{"class":"Panorama","vfov":180,"frames":[{"cube":{"levels":[{"colCount":42,"height":3584,"url":"media/panorama_FC130A71_C53A_E51A_41C9_D39580AD0523_0/{face}/0/{row}_{column}.jpg","tags":"ondemand","class":"TiledImageResourceLevel","rowCount":7,"width":21504},{"colCount":24,"height":2048,"url":"media/panorama_FC130A71_C53A_E51A_41C9_D39580AD0523_0/{face}/1/{row}_{column}.jpg","tags":"ondemand","class":"TiledImageResourceLevel","rowCount":4,"width":12288},{"colCount":12,"height":1024,"url":"media/panorama_FC130A71_C53A_E51A_41C9_D39580AD0523_0/{face}/2/{row}_{column}.jpg","tags":"ondemand","class":"TiledImageResourceLevel","rowCount":2,"width":6144},{"colCount":6,"height":512,"url":"media/panorama_FC130A71_C53A_E51A_41C9_D39580AD0523_0/{face}/3/{row}_{column}.jpg","tags":["ondemand","preload"],"class":"TiledImageResourceLevel","rowCount":1,"width":3072}],"class":"ImageResource"},"thumbnailUrl":"media/panorama_3825A5F4_7260_905B_41B6_C44FF85D5288_t.jpg","class":"CubicPanoramaFrame"}],"id":"panorama_FC130A71_C53A_E51A_41C9_D39580AD0523","hfovMax":130,"data":{"subtitle":trans('panorama_FC130A71_C53A_E51A_41C9_D39580AD0523.subtitle','panorama_FC130A71_C53A_E51A_41C9_D39580AD0523.data.subtitle'),"label":"To\u00e0n c\u1ea3nh C\u1ee5m di t\u00edch"},"hfovMin":"120%","hfov":360,"overlays":["this.overlay_FC0E8A72_C53A_E51E_41E2_F23321FE1C14","this.overlay_ED865A4F_C8E0_9BE3_41BD_692C013FB046"],"thumbnailUrl":"media/panorama_3825A5F4_7260_905B_41B6_C44FF85D5288_t.jpg","label":trans('panorama_FC130A71_C53A_E51A_41C9_D39580AD0523.label')},{"playbackBarProgressBackgroundColor":["#FFFF00"],"toolTipFontColor":"#606060","vrPointerSelectionTime":2000,"playbackBarHeadShadowOpacity":0.7,"playbackBarProgressBackgroundColorRatios":[1],"left":0,"subtitlesGap":0,"playbackBarBorderColor":"#AAAAAA","toolTipBorderColor":"#767676","data":{"name":"Main Viewer"},"surfaceReticleColor":"#FFFFFF","playbackBarProgressBorderColor":"#000000","propagateClick":false,"playbackBarBorderRadius":0,"toolTipPaddingBottom":4,"subtitlesBackgroundColor":"#000000","playbackBarHeadBorderRadius":0,"toolTipPaddingRight":6,"toolTipShadowColor":"#333333","playbackBarHeadBorderColor":"#000000","progressBackgroundColorRatios":[0,1],"subtitlesTextShadowOpacity":1,"playbackBarBorderSize":2,"subtitlesTextShadowHorizontalLength":1,"progressRight":10,"toolTipTextShadowColor":"#000000","subtitlesFontColor":"#FFFFFF","progressBarBorderColor":"#000000","subtitlesTop":0,"toolTipFontFamily":"Arial","progressBarBackgroundColorRatios":[0,1],"subtitlesTextShadowColor":"#000000","surfaceReticleSelectionColor":"#FFFFFF","subtitlesFontSize":"3vmin","playbackBarHeadShadowBlurRadius":3,"playbackBarHeadShadowHorizontalLength":0,"playbackBarBackgroundOpacity":1,"subtitlesBackgroundOpacity":0.2,"progressBorderColor":"#AAAAAA","playbackBarLeft":0,"toolTipPaddingLeft":6,"toolTipBackgroundColor":"#F6F6F6","playbackBarHeadBackgroundColorRatios":[1],"vrPointerColor":"#FFFFFF","toolTipPaddingTop":4,"playbackBarHeadShadowColor":"#000000","id":"MainViewer","playbackBarHeadBorderSize":0,"progressBackgroundColor":["#EEEEEE","#CCCCCC"],"progressBottom":1,"subtitlesBottom":50,"subtitlesBorderColor":"#FFFFFF","playbackBarHeadShadow":true,"progressBarBackgroundColor":["#222222","#444444"],"progressHeight":20,"playbackBarHeadShadowVerticalLength":0,"progressBorderSize":2,"subtitlesTextShadowVerticalLength":1,"playbackBarHeadBackgroundColor":["#019680"],"class":"ViewerArea","progressBarBorderRadius":4,"minHeight":50,"progressBarBorderSize":0,"minWidth":100,"top":0,"playbackBarBottom":10,"playbackBarBackgroundColor":["#EEEEEE","#CCCCCC"],"playbackBarHeight":20,"subtitlesFontFamily":"Arial","playbackBarHeadWidth":8,"playbackBarHeadHeight":16,"playbackBarProgressBorderSize":0,"width":"100%","progressBorderRadius":4,"playbackBarBackgroundColorDirection":"vertical","height":"100%","vrPointerSelectionColor":"#FF6600","progressLeft":10,"playbackBarRight":0,"firstTransitionDuration":0,"playbackBarProgressBorderRadius":0},{"idleSequence":"this.sequence_FC0CBA71_C53A_E51A_41BC_DAF059DBA375","enterPointingToHorizon":true,"class":"PanoramaCamera","initialPosition":{"pitch":-8.69,"hfov":105,"class":"PanoramaCameraPosition","yaw":-4.53},"initialSequence":"this.sequence_FC0CBA71_C53A_E51A_41BC_DAF059DBA375","displayOriginPosition":{"pitch":-90,"stereographicFactor":1,"hfov":165,"class":"RotationalCameraDisplayPosition","yaw":-4.53},"displayMovements":[{"duration":1000,"class":"TargetRotationalCameraDisplayMovement"},{"easing":"cubic_in_out","class":"TargetRotationalCameraDisplayMovement","targetHfov":105,"targetPitch":-8.69,"duration":3000,"targetStereographicFactor":0}],"id":"panorama_FC130A71_C53A_E51A_41C9_D39580AD0523_camera","timeToIdle":3000},{"id":"mainPlayList","items":[{"camera":"this.panorama_FC130A71_C53A_E51A_41C9_D39580AD0523_camera","media":"this.panorama_FC130A71_C53A_E51A_41C9_D39580AD0523","class":"PanoramaPlayListItem","end":"this.trigger('tourEnded')","player":"this.MainViewerPanoramaPlayer"}],"class":"PlayList"},{"id":"MainViewerPanoramaPlayer","class":"PanoramaPlayer","aaEnabled":true,"keepModel3DLoadedWithoutLocation":true,"mouseControlMode":"drag_rotation","viewerArea":"this.MainViewer","touchControlMode":"drag_rotation","displayPlaybackBar":true,"arrowKeysAction":"translate"},{"id":"TDVAuthor","class":"PlayerMenuItem","label":trans('TDVAuthor.label')},{"data":{"label":"GoToĐìnhTâyTựu(đìnhĐăm)"},"class":"HotspotPanoramaOverlay","items":[{"pitch":-8.12,"distance":50,"class":"HotspotPanoramaOverlayImage","scaleMode":"fit_inside","yaw":-25.02,"vfov":8.94,"rotationX":-15.91,"hfov":4.22,"image":"this.AnimatedImageResource_E3556ADF_C8E1_78E4_41E8_843995C21C74","data":{"label":"GoTo\u0110\u00ecnhT\u00e2yT\u1ef1u(\u0111\u00ecnh\u0110\u0103m)"}}],"areas":["this.HotspotPanoramaOverlayArea_FC0FEA72_C53A_E51E_41E5_6D945E069BE2"],"enabledInVR":true,"useHandCursor":true,"id":"overlay_FC0E8A72_C53A_E51E_41E2_F23321FE1C14","maps":[]},{"data":{"label":"GoToĐìnhTâyTựu(đìnhĐăm)"},"class":"HotspotPanoramaOverlay","items":[{"pitch":-26.99,"distance":50,"class":"HotspotPanoramaOverlayImage","scaleMode":"fit_inside","yaw":5.07,"vfov":8.94,"rotationX":-15.91,"hfov":4.22,"image":"this.AnimatedImageResource_E353AADF_C8E1_78E4_41DF_91B760B2C814","data":{"label":"GoTo\u0110\u00ecnhT\u00e2yT\u1ef1u(\u0111\u00ecnh\u0110\u0103m)"}}],"areas":["this.HotspotPanoramaOverlayArea_ED871A50_C8E0_9BFD_41CD_AEB0ABD3BD62"],"enabledInVR":true,"useHandCursor":true,"id":"overlay_ED865A4F_C8E0_9BE3_41BD_692C013FB046","maps":[]},{"class":"PanoramaCameraSequence","id":"sequence_FC0CBA71_C53A_E51A_41BC_DAF059DBA375","movements":[{"yawSpeed":2.66,"easing":"cubic_in","yawDelta":30.75,"class":"DistancePanoramaCameraMovement"},{"yawSpeed":2.66,"yawDelta":3538.5,"class":"DistancePanoramaCameraMovement"},{"yawSpeed":2.66,"easing":"cubic_out","yawDelta":30.75,"class":"DistancePanoramaCameraMovement"}]},{"id":"AnimatedImageResource_E3556ADF_C8E1_78E4_41E8_843995C21C74","rowCount":9,"class":"AnimatedImageResource","frameCount":69,"finalFrame":"first","levels":[{"height":2682,"url":"media/res_61F9C48C_7317_F64B_41CE_53CED661C904_0.png","class":"ImageResourceLevel","width":1320}],"frameDuration":20,"colCount":8},{"click":"this.openLink(this.translate('LinkBehaviour_EE91A92A_C8E3_99AD_41D7_2042EE2745B2.source'), '_blank')","displayTooltipInTouchScreens":true,"class":"HotspotPanoramaOverlayArea","id":"HotspotPanoramaOverlayArea_FC0FEA72_C53A_E51E_41E5_6D945E069BE2","mapColor":"any","toolTip":trans('HotspotPanoramaOverlayArea_FC0FEA72_C53A_E51E_41E5_6D945E069BE2.toolTip')},{"id":"AnimatedImageResource_E353AADF_C8E1_78E4_41DF_91B760B2C814","rowCount":9,"class":"AnimatedImageResource","frameCount":69,"finalFrame":"first","levels":[{"height":2682,"url":"media/res_61F9C48C_7317_F64B_41CE_53CED661C904_0.png","class":"ImageResourceLevel","width":1320}],"frameDuration":20,"colCount":8},{"click":"this.openLink(this.translate('LinkBehaviour_EE14312B_C8E3_A9AC_41D8_2A2948E955AB.source'), '_blank')","displayTooltipInTouchScreens":true,"class":"HotspotPanoramaOverlayArea","id":"HotspotPanoramaOverlayArea_ED871A50_C8E0_9BFD_41CD_AEB0ABD3BD62","mapColor":"any","toolTip":trans('HotspotPanoramaOverlayArea_ED871A50_C8E0_9BFD_41CD_AEB0ABD3BD62.toolTip')}],"height":"100%","defaultMenu":["fullscreen","mute","rotation"],"menu":["this.TDVAuthor"],"scripts":{"pauseGlobalAudio":TDV.Tour.Script.pauseGlobalAudio,"setOverlayBehaviour":TDV.Tour.Script.setOverlayBehaviour,"_getObjectsByTags":TDV.Tour.Script._getObjectsByTags,"stopGlobalAudios":TDV.Tour.Script.stopGlobalAudios,"getAudioByTags":TDV.Tour.Script.getAudioByTags,"setOverlaysVisibility":TDV.Tour.Script.setOverlaysVisibility,"getOverlays":TDV.Tour.Script.getOverlays,"mixObject":TDV.Tour.Script.mixObject,"setOverlaysVisibilityByTags":TDV.Tour.Script.setOverlaysVisibilityByTags,"pauseGlobalAudios":TDV.Tour.Script.pauseGlobalAudios,"stopGlobalAudio":TDV.Tour.Script.stopGlobalAudio,"setLocale":TDV.Tour.Script.setLocale,"setPanoramaCameraWithCurrentSpot":TDV.Tour.Script.setPanoramaCameraWithCurrentSpot,"setMeasurementUnits":TDV.Tour.Script.setMeasurementUnits,"playAudioList":TDV.Tour.Script.playAudioList,"initOverlayGroupRotationOnClick":TDV.Tour.Script.initOverlayGroupRotationOnClick,"clone":TDV.Tour.Script.clone,"getOverlaysByTags":TDV.Tour.Script.getOverlaysByTags,"setValue":TDV.Tour.Script.setValue,"textToSpeech":TDV.Tour.Script.textToSpeech,"stopAndGoCamera":TDV.Tour.Script.stopAndGoCamera,"getOverlaysByGroupname":TDV.Tour.Script.getOverlaysByGroupname,"stopTextToSpeech":TDV.Tour.Script.stopTextToSpeech,"setPanoramaCameraWithSpot":TDV.Tour.Script.setPanoramaCameraWithSpot,"syncPlaylists":TDV.Tour.Script.syncPlaylists,"setSurfaceSelectionHotspotMode":TDV.Tour.Script.setSurfaceSelectionHotspotMode,"playGlobalAudioWhilePlayActiveMedia":TDV.Tour.Script.playGlobalAudioWhilePlayActiveMedia,"getComponentByName":TDV.Tour.Script.getComponentByName,"initAnalytics":TDV.Tour.Script.initAnalytics,"changeBackgroundWhilePlay":TDV.Tour.Script.changeBackgroundWhilePlay,"initQuiz":TDV.Tour.Script.initQuiz,"setPlayListSelectedIndex":TDV.Tour.Script.setPlayListSelectedIndex,"clonePanoramaCamera":TDV.Tour.Script.clonePanoramaCamera,"getPanoramaOverlayByName":TDV.Tour.Script.getPanoramaOverlayByName,"getPixels":TDV.Tour.Script.getPixels,"openLink":TDV.Tour.Script.openLink,"getPanoramaOverlaysByTags":TDV.Tour.Script.getPanoramaOverlaysByTags,"copyObjRecursively":TDV.Tour.Script.copyObjRecursively,"pauseGlobalAudiosWhilePlayItem":TDV.Tour.Script.pauseGlobalAudiosWhilePlayItem,"getKey":TDV.Tour.Script.getKey,"_initSplitViewer":TDV.Tour.Script._initSplitViewer,"playGlobalAudio":TDV.Tour.Script.playGlobalAudio,"sendAnalyticsData":TDV.Tour.Script.sendAnalyticsData,"quizStart":TDV.Tour.Script.quizStart,"playGlobalAudioWhilePlay":TDV.Tour.Script.playGlobalAudioWhilePlay,"setStartTimeVideo":TDV.Tour.Script.setStartTimeVideo,"setCameraSameSpotAsMedia":TDV.Tour.Script.setCameraSameSpotAsMedia,"toggleTextToSpeechComponent":TDV.Tour.Script.toggleTextToSpeechComponent,"triggerOverlay":TDV.Tour.Script.triggerOverlay,"setStartTimeVideoSync":TDV.Tour.Script.setStartTimeVideoSync,"_initTwinsViewer":TDV.Tour.Script._initTwinsViewer,"textToSpeechComponent":TDV.Tour.Script.textToSpeechComponent,"skip3DTransitionOnce":TDV.Tour.Script.skip3DTransitionOnce,"copyToClipboard":TDV.Tour.Script.copyToClipboard,"setComponentVisibility":TDV.Tour.Script.setComponentVisibility,"setComponentsVisibilityByTags":TDV.Tour.Script.setComponentsVisibilityByTags,"quizSetItemFound":TDV.Tour.Script.quizSetItemFound,"shareSocial":TDV.Tour.Script.shareSocial,"updateDeepLink":TDV.Tour.Script.updateDeepLink,"unloadViewer":TDV.Tour.Script.unloadViewer,"_getPlayListsWithViewer":TDV.Tour.Script._getPlayListsWithViewer,"quizShowQuestion":TDV.Tour.Script.quizShowQuestion,"showComponentsWhileMouseOver":TDV.Tour.Script.showComponentsWhileMouseOver,"executeFunctionWhenChange":TDV.Tour.Script.executeFunctionWhenChange,"getPlayListWithItem":TDV.Tour.Script.getPlayListWithItem,"isComponentVisible":TDV.Tour.Script.isComponentVisible,"init":TDV.Tour.Script.init,"changeOpacityWhilePlay":TDV.Tour.Script.changeOpacityWhilePlay,"showPopupMedia":TDV.Tour.Script.showPopupMedia,"updateIndexGlobalZoomImage":TDV.Tour.Script.updateIndexGlobalZoomImage,"isCardboardViewMode":TDV.Tour.Script.isCardboardViewMode,"showPopupImage":TDV.Tour.Script.showPopupImage,"updateVideoCues":TDV.Tour.Script.updateVideoCues,"updateMediaLabelFromPlayList":TDV.Tour.Script.updateMediaLabelFromPlayList,"getFirstPlayListWithMedia":TDV.Tour.Script.getFirstPlayListWithMedia,"isPanorama":TDV.Tour.Script.isPanorama,"getPlayListItems":TDV.Tour.Script.getPlayListItems,"visibleComponentsIfPlayerFlagEnabled":TDV.Tour.Script.visibleComponentsIfPlayerFlagEnabled,"showPopupPanoramaOverlay":TDV.Tour.Script.showPopupPanoramaOverlay,"createTweenModel3D":TDV.Tour.Script.createTweenModel3D,"getPlayListItemByMedia":TDV.Tour.Script.getPlayListItemByMedia,"getGlobalAudio":TDV.Tour.Script.getGlobalAudio,"showWindow":TDV.Tour.Script.showWindow,"keepCompVisible":TDV.Tour.Script.keepCompVisible,"setMapLocation":TDV.Tour.Script.setMapLocation,"enableVR":TDV.Tour.Script.enableVR,"_initItemWithComps":TDV.Tour.Script._initItemWithComps,"showPopupPanoramaVideoOverlay":TDV.Tour.Script.showPopupPanoramaVideoOverlay,"getCurrentPlayers":TDV.Tour.Script.getCurrentPlayers,"changePlayListWithSameSpot":TDV.Tour.Script.changePlayListWithSameSpot,"getMainViewer":TDV.Tour.Script.getMainViewer,"setEndToItemIndex":TDV.Tour.Script.setEndToItemIndex,"getQuizTotalObjectiveProperty":TDV.Tour.Script.getQuizTotalObjectiveProperty,"getMediaByName":TDV.Tour.Script.getMediaByName,"getPlayListItemIndexByMedia":TDV.Tour.Script.getPlayListItemIndexByMedia,"assignObjRecursively":TDV.Tour.Script.assignObjRecursively,"getMediaByTags":TDV.Tour.Script.getMediaByTags,"quizPauseTimer":TDV.Tour.Script.quizPauseTimer,"startModel3DWithCameraSpot":TDV.Tour.Script.startModel3DWithCameraSpot,"setMainMediaByName":TDV.Tour.Script.setMainMediaByName,"showWindowBase":TDV.Tour.Script.showWindowBase,"setMainMediaByIndex":TDV.Tour.Script.setMainMediaByIndex,"cloneBindings":TDV.Tour.Script.cloneBindings,"setMediaBehaviour":TDV.Tour.Script.setMediaBehaviour,"disableVR":TDV.Tour.Script.disableVR,"fixTogglePlayPauseButton":TDV.Tour.Script.fixTogglePlayPauseButton,"createTween":TDV.Tour.Script.createTween,"getRootOverlay":TDV.Tour.Script.getRootOverlay,"_initTTSTooltips":TDV.Tour.Script._initTTSTooltips,"startPanoramaWithModel":TDV.Tour.Script.startPanoramaWithModel,"setModel3DCameraSpot":TDV.Tour.Script.setModel3DCameraSpot,"startPanoramaWithCamera":TDV.Tour.Script.startPanoramaWithCamera,"loadFromCurrentMediaPlayList":TDV.Tour.Script.loadFromCurrentMediaPlayList,"startMeasurement":TDV.Tour.Script.startMeasurement,"autotriggerAtStart":TDV.Tour.Script.autotriggerAtStart,"downloadFile":TDV.Tour.Script.downloadFile,"executeAudioAction":TDV.Tour.Script.executeAudioAction,"resumePlayers":TDV.Tour.Script.resumePlayers,"quizResumeTimer":TDV.Tour.Script.quizResumeTimer,"registerKey":TDV.Tour.Script.registerKey,"setModel3DCameraWithCurrentSpot":TDV.Tour.Script.setModel3DCameraWithCurrentSpot,"stopMeasurement":TDV.Tour.Script.stopMeasurement,"getActiveMediaWithViewer":TDV.Tour.Script.getActiveMediaWithViewer,"getStateTextToSpeech":TDV.Tour.Script.getStateTextToSpeech,"executeAudioActionByTags":TDV.Tour.Script.executeAudioActionByTags,"toggleVR":TDV.Tour.Script.toggleVR,"historyGoBack":TDV.Tour.Script.historyGoBack,"getComponentsByTags":TDV.Tour.Script.getComponentsByTags,"unregisterKey":TDV.Tour.Script.unregisterKey,"getActivePlayerWithViewer":TDV.Tour.Script.getActivePlayerWithViewer,"toggleMeasurement":TDV.Tour.Script.toggleMeasurement,"quizShowScore":TDV.Tour.Script.quizShowScore,"resumeGlobalAudios":TDV.Tour.Script.resumeGlobalAudios,"setObjectsVisibility":TDV.Tour.Script.setObjectsVisibility,"getMediaFromPlayer":TDV.Tour.Script.getMediaFromPlayer,"executeJS":TDV.Tour.Script.executeJS,"existsKey":TDV.Tour.Script.existsKey,"quizShowTimeout":TDV.Tour.Script.quizShowTimeout,"getMediaWidth":TDV.Tour.Script.getMediaWidth,"setModel3DCameraSequence":TDV.Tour.Script.setModel3DCameraSequence,"historyGoForward":TDV.Tour.Script.historyGoForward,"openEmbeddedPDF":TDV.Tour.Script.openEmbeddedPDF,"setObjectsVisibilityByID":TDV.Tour.Script.setObjectsVisibilityByID,"takeScreenshot":TDV.Tour.Script.takeScreenshot,"pauseCurrentPlayers":TDV.Tour.Script.pauseCurrentPlayers,"cleanAllMeasurements":TDV.Tour.Script.cleanAllMeasurements,"cleanSelectedMeasurements":TDV.Tour.Script.cleanSelectedMeasurements,"getActivePlayersWithViewer":TDV.Tour.Script.getActivePlayersWithViewer,"htmlToPlainText":TDV.Tour.Script.htmlToPlainText,"setObjectsVisibilityByTags":TDV.Tour.Script.setObjectsVisibilityByTags,"getMediaHeight":TDV.Tour.Script.getMediaHeight,"translate":TDV.Tour.Script.translate,"restartTourWithoutInteraction":TDV.Tour.Script.restartTourWithoutInteraction,"getPlayListsWithMedia":TDV.Tour.Script.getPlayListsWithMedia,"quizFinish":TDV.Tour.Script.quizFinish,"setDirectionalPanoramaAudio":TDV.Tour.Script.setDirectionalPanoramaAudio,"getModel3DInnerObject":TDV.Tour.Script.getModel3DInnerObject,"setMeasurementsVisibility":TDV.Tour.Script.setMeasurementsVisibility,"toggleMeasurementsVisibility":TDV.Tour.Script.toggleMeasurementsVisibility,"getCurrentPlayerWithMedia":TDV.Tour.Script.getCurrentPlayerWithMedia},"children":["this.MainViewer"]};
if (script['data'] == undefined)
    script['data'] = {};
script['data']['translateObjs'] = translateObjs, script['data']['createQuizConfig'] = function () {
    let a = {}, b = this['get']('data')['translateObjs'];
    for (const c in translateObjs) {
        if (!b['hasOwnProperty'](c))
            b[c] = translateObjs[c];
    }
    return a;
}, TDV['PlayerAPI']['defineScript'](script);
//# sourceMappingURL=script_device.js.map
})();
//Generated with v2026.0.3, Wed Nov 11 2026
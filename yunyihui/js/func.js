// JavaScript Document

(function ($) {

    var $pgTypDom = $('script:last');
    var pgTyp = $pgTypDom.attr('src');
    pgTyp = pgTyp.split('?');
    if (pgTyp.length == 2) {
        pgTyp = pgTyp[1];
    }

    if (pgTyp == 'idx') {
        fwnr();
        biggingImg();
    }
    else if (pgTyp == 'abot') {
        fwnr();
        biggingImg();
        var $abotNav = $('#abotNav');
        $(window).scroll(fixedAbotNav);
        fixedAbotNav();
        var $abotRegionTit = $('.cm-tit1');
        var $abotNavP = $('.abot-nav p');
        $abotNavP.click(function () {
            var $ths = $(this);
            var idx = $abotNavP.index(this);
            $(document.body).animate({scrollTop: $abotRegionTit.eq(idx).offset().top - 100}, 300);
            $(document.documentElement).animate({scrollTop: $abotRegionTit.eq(idx).offset().top - 100}, 300);
            $ths.addClass('abot-nav-it-on').siblings('.abot-nav-it-on').removeClass('abot-nav-it-on');
        });
        $(window).scroll(function () {
            $abotRegionTit.each(function () {
                var $ths = $(this);
                var scrollY = tools.getScrollY();
                var thsY = $ths.offset().top;
                if (scrollY >= thsY - 200 && scrollY <= thsY + 200) {
                    $abotNavP.eq($abotRegionTit.index(this)).addClass('abot-nav-it-on').siblings('.abot-nav-it-on').removeClass('abot-nav-it-on');
                }
                var $fwmsTit = $('#fwmsTit');
                if (scrollY > $fwmsTit.offset().top - 300) {
                    $('.abot-nav-it-on').removeClass('abot-nav-it-on');
                }
            });
        });
    }
    else if (pgTyp == 'news') {
        biggingImg();
    }
    else if (pgTyp == 'prod') {
        /*
         $('.prod-blck').mouseover(function () {
         var $ths = $(this);
         console.log($ths.hasClass('visible'));
         if(!$ths.hasClass('visible')) {
         $ths.addClass('visible');
         var $alst = $ths.find('a');
         if(tools.getScrollY() > $ths.offset().top - 500) {
         var delay = 0;
         for(var i = 0; i< $alst.length; i++) {
         var $a = $alst.eq(i);
         if(!$a.hasClass('visible')) {
         $a.stop().delay(delay).animate({top:0, opacity:100}, 500);
         $a.css('visibility', 'visible');
         $a.addClass('visible');
         delay += 100;
         }
         }
         }
         }
         });
         */
    }
    else if (pgTyp == 'ctct') {
        //创建和初始化地图函数：
        function initMap() {
            createMap();//创建地图
            setMapEvent();//设置地图事件
            addMapControl();//向地图添加控件
            addMarker();//向地图中添加marker
        }

        //创建地图函数：
        function createMap() {
            var map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
            var point = new BMap.Point(113.726421, 34.779004);//定义一个中心点坐标
            map.centerAndZoom(point, 17);//设定地图的中心点和坐标并将地图显示在地图容器中
            window.map = map;//将map变量存储在全局
        }

        //地图事件设置函数：
        function setMapEvent() {
            map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
            map.enableScrollWheelZoom();//启用地图滚轮放大缩小
            map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
            map.enableKeyboard();//启用键盘上下左右键移动地图
        }

        //地图控件添加函数：
        function addMapControl() {
            //向地图中添加缩放控件
            var ctrl_nav = new BMap.NavigationControl({
                anchor: BMAP_ANCHOR_TOP_LEFT,
                type: BMAP_NAVIGATION_CONTROL_LARGE
            });
            map.addControl(ctrl_nav);
            //向地图中添加缩略图控件
            var ctrl_ove = new BMap.OverviewMapControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1});
            map.addControl(ctrl_ove);
            //向地图中添加比例尺控件
            var ctrl_sca = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});
            map.addControl(ctrl_sca);
        }

        //标注点数组
        var markerArr = [{
            title: "河南金品实业有限公司",
            content: "河南省郑州市商务内环西二街伟业财智广场13C",
            point: "113.726376|34.779093",
            isOpen: 0,
            icon: {w: 21, h: 21, l: 0, t: 0, x: 6, lb: 5}
        }
        ];
        //创建marker
        function addMarker() {
            for (var i = 0; i < markerArr.length; i++) {
                var json = markerArr[i];
                var p0 = json.point.split("|")[0];
                var p1 = json.point.split("|")[1];
                var point = new BMap.Point(p0, p1);
                var iconImg = createIcon(json.icon);
                var marker = new BMap.Marker(point, {icon: iconImg});
                var iw = createInfoWindow(i);
                var label = new BMap.Label(json.title, {"offset": new BMap.Size(json.icon.lb - json.icon.x + 10, -20)});
                marker.setLabel(label);
                map.addOverlay(marker);
                label.setStyle({
                    borderColor: "#808080",
                    color: "#333",
                    cursor: "pointer"
                });

                (function () {
                    var index = i;
                    var _iw = createInfoWindow(i);
                    var _marker = marker;
                    _marker.addEventListener("click", function () {
                        this.openInfoWindow(_iw);
                    });
                    _iw.addEventListener("open", function () {
                        _marker.getLabel().hide();
                    })
                    _iw.addEventListener("close", function () {
                        _marker.getLabel().show();
                    })
                    label.addEventListener("click", function () {
                        _marker.openInfoWindow(_iw);
                    })
                    if (!!json.isOpen) {
                        label.hide();
                        _marker.openInfoWindow(_iw);
                    }
                })()
            }
        }

        //创建InfoWindow
        function createInfoWindow(i) {
            var json = markerArr[i];
            var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>" + json.content + "</div>");
            return iw;
        }

        //创建一个Icon
        function createIcon(json) {
            var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w, json.h), {
                imageOffset: new BMap.Size(-json.l, -json.t),
                infoWindowOffset: new BMap.Size(json.lb + 5, 1),
                offset: new BMap.Size(json.x, json.h)
            })
            return icon;
        }

        initMap();//创建和初始化地图
    }

    function fixedAbotNav() {
        if (tools.getScrollY() > 56) $abotNav.addClass('abot-nav-top');
        else $abotNav.removeClass('abot-nav-top');
    }

    function fwnr() {
        var $servCtnt = $("#servCtnt");
        $('.idx-fwnr-it').click(function () {
            var $ths = $(this);
            $ths.addClass('idx-fwnr-it-on').siblings('.idx-fwnr-it-on').removeClass('idx-fwnr-it-on');
            $servCtnt.text($ths.find('span').text());
        });
    }

    function biggingImg() {
        $(document).ready(function () {
            $('.bigging-img').each(function () {
                var $ths = $(this);
                var $img = $ths.find('img');
                $img.css('top', '50%');
                $img.css('margin-top', -$img.height() / 2 + 'px');
            });
        });
    }

    var $pgeDom = $('*:not(.idx-prod, hr)');
    $pgeDom.addClass('wow fadeInUp');
    $pgeDom.attr('data-wow-duration', '.5s');
    new WOW().init();
})(jQuery);
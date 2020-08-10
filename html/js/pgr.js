var scripts = document.getElementsByTagName('script');
var url = scripts[scripts.length -1 ].src;

var pgTyp = url.indexOf('?') > 0 ? url.split('?')[1] : '';

var showHideMnu = function () {
    var $cmMnu = $('#cmMnu');
    var $cmMnuClz = $('#cmMnuClz');
    var $cmMnuShow = $("#cmMnuShow");
    $cmMnuShow.click(function () {$cmMnu.addClass('cm-mnu-on')});
    $cmMnuClz.click(function () {$cmMnu.removeClass('cm-mnu-on');});
    $cmMnu.hover(function(){}, function () {
      $cmMnu.removeClass('cm-mnu-on');
    });
  };

  var bnr = function () {
    var swiper = new Swiper('.swiper-container', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable:true
      },
      autoplay : { delay: 1000, stopOnLastSlide: false, disableOnInteraction: false },
      speed:700,
      direction: 'horizontal',
      loop: true
    });
  }

  var fwlxTab = function () {
    var $servCtnt = $('#servCtnt');
    var $servTit = $('#servTit');
    $('.fwlx-it').click(function () {
      var $ths = $(this);
      $ths.addClass('fwlx-it-on').siblings('.fwlx-it-on').removeClass('fwlx-it-on');
      $servTit.text($ths.find('i').text());
      $servCtnt.text($ths.find('span').text());
    });
  }

  var navSlide = function () {
    var $nav = $('.nav');
    var lastScroll = tools.getScrollY();
    $(window).scroll(function () {
      var scrollY = tools.getScrollY();
      if(scrollY > 20) {
        $nav.addClass('nav-dark');
      } else {
        $nav.removeClass('nav-dark');
      }
      if(scrollY > 120) {
        $nav.stop().animate({top: -120});
      } else {
        $nav.stop().animate({top: 0});
      }});
      /*
      if(scrollY > 120 && scrollY < lastScroll) {
        $nav.stop().animate({top: 0});
      } else {
        lastScroll = scrollY;
      }
    });
    $(document).on('mousewheel DOMMouseScroll', function (e) {
      var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
              (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));
      if (delta > 0) {
               // 向上滚           
        $nav.stop().slideDown();   
         } else if (delta < 0) {
              // 向下滚
         }
      });
      */    
  }

  var alIt = function () {
    $(document).ready(function () {
      var $alItHeight = $('#alItHeight');
      $(window).resize(function() {
        var height = 516/640*$('.alsx-case-it:first').width();
        $alItHeight.html('<style>.alsx-case-it {height:'+Math.floor(height)+'px}</style>');
        console.log($alItHeight.html());
      });var height = 516/640*$('.alsx-case-it:first').width();
      $alItHeight.html('<style>.alsx-case-it {height:'+Math.floor(height)+'px}</style>');
    })
  } 
  

  switch(pgTyp) {
    case 'idx':
      showHideMnu();      
      navSlide();
      break;
      case 'main':
        showHideMnu();
        navSlide();
        bnr();
        break;
      case 'fwlx':
        showHideMnu();
        navSlide();
        bnr();
        fwlxTab();
        break;
      case 'alsx':
        showHideMnu();
        navSlide();
        bnr();
        alIt();
        break;
  }


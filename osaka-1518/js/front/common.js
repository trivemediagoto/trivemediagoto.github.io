//----------------------------------------------------
// 
// COMMON -全ページ共通JS-
// (commoon.js)
//
// ----------------------------------------------------


// スムーススクロール
// ----------------------------------------------------

$(function(){
   // #で始まるアンカーをクリックした場合に処理
   $('a[href^="#"]').click(function() {
      // スクロールの速度
      var speed = 400; // ミリ秒
      // アンカーの値取得
      var href= $(this).attr("href");
      // 移動先を取得
      var target = $(href == "#" || href == "" ? 'html' : href);
      // 移動先を数値で取得
      var position = target.offset().top;
      // スムーススクロール
      $('body,html').animate({scrollTop:position}, speed, 'swing');
      return false;
   });
});

// グローバルナビ（SP用）
// ----------------------------------------------------

$(function(){
  $(".header .gNavSp .menu-btn").click(function(){
    $(".header").toggleClass("open");
    }); 
});

$(function(){
  $(".header .gNavSp a").click(function(){
    $(".header").toggleClass("open");
    }); 
});


// PC・SP画像切り替え
// ----------------------------------------------------
$(function() {
  var $elem = $('.switch');
  var sp = '_sp.';
  var pc = '_pc.';
  var replaceWidth = 769;

  function imageSwitch() {
    var windowWidth = parseInt($(window).width());
    $elem.each(function() {
      var $this = $(this);
      if(windowWidth >= replaceWidth) {
        $this.attr('src', $this.attr('src').replace(sp, pc));
      } else {
        $this.attr('src', $this.attr('src').replace(pc, sp));
      }
    });
  }
  imageSwitch();
  var resizeTimer;
  $(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      imageSwitch();
    }, 200);
  });
});

// 要素の高さを合わせる
// ----------------------------------------------------
(function($) {

    $.fn.matchHeight = function(byRow) {
        if (this.length <= 1)
            return this;

        // byRow default to true
        byRow = (typeof byRow !== 'undefined') ? byRow : true;

        // keep track of this group so we can re-apply later on load and resize events
        $.fn.matchHeight._groups.push({
            elements: this,
            byRow: byRow
        });

        // match each element's height to the tallest element in the selection
        $.fn.matchHeight._apply(this, byRow);

        return this;
    };

    $.fn.matchHeight._apply = function(elements, byRow) {
        var $elements = $(elements),
            rows = [$elements];

        // get rows if using byRow, otherwise assume one row
        if (byRow) {

            // must first force an arbitrary equal height so floating elements break evenly
            $elements.css({
                'display': 'block',
                'padding-top': '0',
                'padding-bottom': '0',
                'border-top': '0',
                'border-bottom': '0',
                'height': '100px'
            });

            // get the array of rows (based on element top position)
            rows = _rows($elements);

            // revert the temporary forced style
            $elements.css({
                'display': '',
                'padding-top': '',
                'padding-bottom': '',
                'border-top': '',
                'border-bottom': '',
                'height': ''
            });
        }

        $.each(rows, function(key, row) {
            var $row = $(row),
                maxHeight = 0;

            // iterate the row and find the max height
            $row.each(function(){
                var $that = $(this);

                // ensure we get the correct actual height (and not a previously set height value)
                $that.css({ 'display': 'block', 'height': '' });

                // find the max height (including padding, but not margin)
                if ($that.outerHeight(false) > maxHeight)
                    maxHeight = $that.outerHeight(false);
            });

            // iterate the row and apply the height to all elements
            $row.each(function(){
                var $that = $(this),
                    verticalPadding = 0;

                // handle padding and border correctly (required when not using border-box)
                if ($that.css('box-sizing') !== 'border-box') {
                    verticalPadding += parseInt($that.css('border-top-width'), 10) + parseInt($that.css('border-bottom-width'), 10);
                    verticalPadding += parseInt($that.css('padding-top'), 10) + parseInt($that.css('padding-bottom'), 10);
                }

                // set the height (accounting for padding and border)
                $that.css('height', maxHeight - verticalPadding);
            });
        });

        return this;
    };

    /*
    *  _applyDataApi will apply matchHeight to all elements with a data-match-height attribute
    */
   
    $.fn.matchHeight._applyDataApi = function() {
        var groups = {};

        // generate groups by their groupId set by elements using data-match-height
        $('[data-match-height], [data-mh]').each(function() {
            var $this = $(this),
                groupId = $this.attr('data-match-height');
            if (groupId in groups) {
                groups[groupId] = groups[groupId].add($this);
            } else {
                groups[groupId] = $this;
            }
        });

        // apply matchHeight to each group
        $.each(groups, function() {
            this.matchHeight(true);
        });
    };

    /* 
    *  _update function will re-apply matchHeight to all groups with the correct options
    */
   
    $.fn.matchHeight._groups = [];

    $.fn.matchHeight._update = function() {
        $.each($.fn.matchHeight._groups, function() {
            $.fn.matchHeight._apply(this.elements, this.byRow);
        });
    };

    /* 
    *  bind events
    */

    // apply on DOM ready event
    $($.fn.matchHeight._applyDataApi);

    // update heights on load and resize events
    $(window).on('load resize orientationchange', $.fn.matchHeight._update);

    /*
    *  rows utility function
    *  returns array of jQuery selections representing each row 
    *  (as displayed after float wrapping applied by browser)
    */

    var _rows = function(elements) {
        var tolerance = 1,
            $elements = $(elements),
            lastTop = null,
            rows = [];

        // group elements by their top position
        $elements.each(function(){
            var $that = $(this),
                top = $that.offset().top - parseInt($that.css('margin-top'), 10),
                lastRow = rows.length > 0 ? rows[rows.length - 1] : null;

            if (lastRow === null) {
                // first item on the row, so just push it
                rows.push($that);
            } else {
                // if the row top is the same, add to the row group
                if (Math.floor(Math.abs(lastTop - top)) <= tolerance) {
                    rows[rows.length - 1] = lastRow.add($that);
                } else {
                    // otherwise start a new row group
                    rows.push($that);
                }
            }

            // keep track of the last row top
            lastTop = top;
        });

        return rows;
    };

})(jQuery);

$(function() {
    $('.matchHeight').matchHeight();
	$('.matchHeight-inner').matchHeight();
});

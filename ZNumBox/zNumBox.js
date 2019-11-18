/*
* ZNumBox
* written by Andonero, 2019.11.17
* serious DOMs :
<label class="num_ader0">
	<i class="disbl">-</i>
	<input id="persCnt" minnum="3" maxnum="9" value="3" />
	<i class="enbl">+</i>
</label>
* invoke ： <input minnum="<0-9999>" maxnum="<0-9999>" value="<0-9999>" />
*/
(function($) {
	'use strict';
	$.fn.extend({NumBox:function(setts) {
		var $ths = $(this);
		var $txb = $ths.find("input");

		var dfltSetts = {
			iniNum: 0,
			disClz: "disbl",
			enClz: "enbl",
			minNum: 0,
			maxNum: 9999,
			change: null
		};
		var currSetts = $.extend(0, dfltSetts, setts);

		currSetts.minNum = $txb.attr("minnum") ? $txb.attr("minnum").toInt() : currSetts.minNum;
		currSetts.maxNum = $txb.attr("maxnum") ? $txb.attr("maxnum").toInt() : currSetts.maxNum;
		currSetts.iniNum = $txb.val().toInt();
		currSetts.iniNum > currSetts.maxNum ? currSetts.iniNum = currSetts.maxNum: 0;
		currSetts.iniNum < currSetts.minNum ? currSetts.iniNum = currSetts.minNum: 0;
		$txb.val(currSetts.iniNum);

		var $btnRds = $ths.find("i:first");
		var $btnAd = $ths.find("i:last");
		setBtnStatus(currSetts.iniNum);

		$txb.blur(function() { setNum($txb.val().toInt()); });
		$btnRds.click(function() { setNum($txb.val().toInt() - 1); });
		$btnAd.click(function() {	setNum($txb.val().toInt() + 1);	});

		function setNum(num) {
			if (num < currSetts.minNum) num = currSetts.minNum;
			if (num > currSetts.maxNum) num = currSetts.maxNum;
			$txb.val(num);
			if (currSetts.change) {
				currSetts.change(num);
			}
			setBtnStatus(num);
		}

		function setBtnStatus(curNum) {
			enblBtn($btnRds, curNum !== currSetts.minNum);
			enblBtn($btnAd, curNum !== currSetts.maxNum);
		}

		function enblBtn($btn, isEnbl) {
			isEnbl ? $btn.addClass(currSetts.enClz).removeClass(currSetts.disClz) : $btn.addClass(currSetts.disClz).removeClass(currSetts.enClz);
		}
	}});
})(jQuery);
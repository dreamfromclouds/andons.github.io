/*
* ZPager.js
* Plugin for jQuery
* written by Andonero, 2019/11/25
* perSetts : {'<containerSelector>' : <instance of dfltPerSett>, '<containerSelector>' : <instance of dfltPerSett>, ...}
* invocation demo ：
Pager({
	numChnging : fetchPge,
	recordAmount : $(dta).find('li').length,
	perSetts : {
		'#pgr1' : {numApear:3, gtoOn:1, labl: '.lblpgr'},
		'#pgr2' : { }
	}});
}
*/

function Pager(sett) {
	if (sett.recordAmount <= 0) return;
	if (sett.recordAmount <= sett.pgeSze) {
		if(sett.autoDta === 1) {
			sett.numChnging(1, sett.pgeSze, new Function());
			sett.autoDta = -1;
			return;
		}
	}

	var dfltSett = {
		numChnging: function(pgeNo, pgeSze, calNumAmount) {}, // interface of fetching data, calbck can be used to fetch new record amount. invoke: calNumAmount(<dta.recordAmount>);
		recordAmount: 0,
		pgeSze: 10,
		startNo: 1, // pageNo of initialization
		autoDta: 1, // fetch data on pageload or not : 1-allow, 0-forbid, (-1)-alreadyloaded
		perSetts: {} // setts for each container of the same pagination
	};
	var dfltPerSett = {
		numOn: 1, // turn on or off number buttons
		numApear: 7, // max-count of number buttons
		prvnxtOn: 1, // turn on or off previous & next buttons
		gtoOn: 0, // turn on or off goto-buttons
		labl: null, // jqSelector of text displayer below
		lblPttrn: "{:pgeNo}/{:numAmount}" // <pgeNo & numAmount & recordAmount>
	};
	var glSett = $.extend(0, dfltSett, sett);
	for (var i in glSett.perSetts) {
		glSett.perSetts[i] = $.extend(0, dfltPerSett, glSett.perSetts[i]);
	}
	var currNo = glSett.startNo ? glSett.startNo : 1;
	var ctrlOked = 0; //上下或多个分页器控制同一个数据集
	var numPnl = '<span class="ZPagerNums">{:nums}</span>';
	var prvnxtHtm = '<a href="javascript:;" class="ZPager_btn ZPager_prv">&lt;</a>' + numPnl + '<a href="javascript:;" class="ZPager_btn ZPager_nxt">&gt;</a>';
	var gtoHtm = '<span class="ZPager_goto"><em class="ZPager_labl">请输入页数：</em><input class="ZPager_gtono" type="text" /><a class="ZPager_gto" href="javascript:void(0)">跳转</a></span>';
	var numAmount;
	calNumAmount(glSett.recordAmount);
	
	function calNumAmount(rmnt) {
		glSett.recordAmount = rmnt;
		numAmount = Math.ceil(glSett.recordAmount / glSett.pgeSze);
	}

	function gtoNo(tNo) {
		currNo = tNo;
		for (var ctnr in glSett.perSetts) {
			var $ctnr = $(ctnr);
			var sett = glSett.perSetts[ctnr];
			setLablTxt($ctnr, sett);
			setNumStatus($ctnr, sett);
			setPrvnxtStatus($ctnr, sett);
		}
		if(sett.autoDta != 0) glSett.numChnging(currNo, glSett.pgeSze, calNumAmount);
	}

	function setLablTxt($ctnr, sett) {
		if (sett.labl) $(sett.labl).html(sett.lblPttrn.replace(new RegExp("\\\{\\\:pgeNo\\\}", "g"), currNo).replace(new RegExp("\\\{\\\:numAmount\\\}", "g"), numAmount).replace(new RegExp("\\\{\\\:recordAmount\\\}", "g"), glSett.recordAmount));
	}

	function numHtm(sett) {
		/* num<=a+1 => 从1开始显示完整numApear个
		 * num>=100-b => 从100开始倒序显示完整numApear个
		 * num为a+2到100-b-1 => 前后有...，前a后b
		 * a + b = numApear - 1 (除去当前)*/		 
		var html = '';
		var bgnNo, endNo;

		if (numAmount <= sett.numApear + 1) {
			bgnNo = 1;
			endNo = numAmount;
			for (var i = bgnNo; i <= endNo; i++) {
				html += '<a href="javascript:;" class="ZPager_btn ZPager_num" num="' + i + '">' + i + '</a>';
			}
		} else {
			var a = Math.ceil((sett.numApear - 1) / 2);
			var b = sett.numApear - 1 - a;
			if (currNo > numAmount - b - 1) {
				bgnNo = numAmount - sett.numApear + 1;
				endNo = numAmount;
			} else if (currNo <= a + 1) {
				bgnNo = 1;
				endNo = sett.numApear;
			} else {
				bgnNo = currNo - a;
				endNo = currNo + b;
			}
			if (currNo > a + 1) {
				html += '<a href="javascript:;" class="ZPager_btn ZPager_num" num="1">1</a><span>...</span>';
			}
			for (var i = bgnNo; i <= endNo; i++) {
				html += '<a href="javascript:;" class="ZPager_btn ZPager_num" num="' + i + '">' + i + '</a>';
			}
			if (currNo <= numAmount - b - 1) {
				html += '<span>...</span>\
                    <a href="javascript:;" class="ZPager_btn ZPager_num" num="' + numAmount + '">' + numAmount + '</a>';
			}
		}
		html = html.replace('<a href="javascript:;" class="ZPager_btn ZPager_num" num="' + currNo + '">' + currNo + '</a>',
			'<span class="ZPager_btn ZPager_num" num="' + currNo + '">' + currNo + '</span>');
		return html;
	}

	function resetNum($ctnr, sett) {
		$ctnr.find(".ZPagerNums").html(numHtm(sett));
	}

	function bindNum($ctnr) {
		$ctnr.on("click", ".ZPager_num",
		function() {
			gtoNo(parseInt($(this).text()));
		});
	}

	function bindPrvnxt($ctnr) {
		$ctnr.find(".ZPager_prv").attr("prev", 1).click(prvnxtEvt);
		$ctnr.find(".ZPager_nxt").attr("prev", 0).click(prvnxtEvt);
	}

	function bindGto($ctnr) {
		$ctnr.find(".ZPager_gto").click(gtoEvt);
		$ctnr.find(".ZPager_gtono").keydown(function(e) {
			if (e.keyCode == 13) gtoEvt.call(this);
		});
	}

	function gtoEvt() {
		var $fom = $(this).closest(".ZPager");
		var num = parseInt($fom.find(".ZPager_gtono").val());
		if (isNaN(num)) {
			alert('请输入数字！');
			$fom.find(".ZPager_gtono").val("");
			return;
		}
		if (num < 1 || num > numAmount) {
			alert('页码数值超出范围！');
			$fom.find(".ZPager_gtono").val("");
			return;
		}
		gtoNo(num);
	}

	function prvnxtEvt() {
		if ($(this).attr("prev") === '1') { //点击prev
			gtoNo(currNo - 1);
		} else { //点击next
			gtoNo(currNo + 1);
		}
	}

	function setNumStatus($ctnr, sett) {
		$ctnr.find('.ZPagerNums').html(numHtm(sett));
	}

	function setPrvnxtStatus($ctnr, sett) {
		if (numAmount === 1) {
			$ctnr.find(".ZPager_prv, .ZPager_nxt").addClass("ZPager_hid");
		} else {
			if (currNo === 1) {
				$ctnr.find(".ZPager_prv").addClass("ZPager_hid");
				$ctnr.find(".ZPager_nxt").removeClass("ZPager_hid");
			} else if (currNo === numAmount) {
				$ctnr.find(".ZPager_prv").removeClass("ZPager_hid");
				$ctnr.find(".ZPager_nxt").addClass("ZPager_hid");
			} else {
				$ctnr.find(".ZPager_prv, .ZPager_nxt").removeClass("ZPager_hid");
			}
		}
	}

	function iniCtrl($ctnr, sett) {
		function doOne($ctnr, sett) {
			var html;
			if (sett.prvnxtOn) html = prvnxtHtm;
			else html = numPnl;
			if (sett.gtoOn) html += gtoHtm;
			if (sett.numOn) html = html.replace("{:nums}", numHtm(sett));
			else html = html.replace(numPnl, "");
			$ctnr.html(html);
			$ctnr.addClass('ZPager');
			if (sett.prvnxtOn) bindPrvnxt($ctnr);
			if (sett.gtoOn) bindGto($ctnr);
			if (sett.numOn) bindNum($ctnr);
		}
		if($ctnr) {
			doOne($ctnr, sett);
		} else {
			for (var ctnr in glSett.perSetts) {
				doOne($(ctnr), glSett.perSetts[ctnr]);
			}
		}
		ctrlOked = 1;
	}

	var pathParms = location.href.split(/\?|\&/);
	var tNo = 1;
	for (var i in pathParms) {
		var pp = pathParms[i];
		if (pp.indexOf('zpn=') == 0) {			
			currNo = parseInt(pp.split('=')[1]);
			break;
		}
	}
	
	iniCtrl();
	gtoNo(currNo);
	if(glSett.autoDta === 1) {
		glSett.numChnging(currNo, glSett.pgeSze, calNumAmount);
	}
	glSett.autoDta = -1;
}
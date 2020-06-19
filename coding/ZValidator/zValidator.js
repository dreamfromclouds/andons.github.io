/*
* ZValidator
* written by Andonero, 2019.11.17

------------jQuery Running Entry 运行入口
$(<containerSelector>).ZValidate(<settings>);
<settings>: 
{
	zname:<zname>,
	zAddClazz:<zAddClazz>,
	zSubmitButton:<jqSelector>,
	noSubmit:<yes|no>
}

------------DOM元素
<input|textarea|select> <input type='<text|checkbox|radio>' .. />
<DOM zname='<zname>'
	zrequire='<显示的提示字段名>'
	zminlen='<最少字符数|3>'
	zmaxlen='<最多字符数|8>'
	zequal='<匹配的控件值|jQuery>'
	zmobile
	zidcard
	zemail
	zcustom='<variable-JSON>'
	zdesync='<variable-JSON>' />

------------AJAX验证
zdesync = {
'url' : 'urlrequest://..',
'type' : 'get|post',
'data' : {},
'dataType' : 'JSON|..',
'zsuccess' : function ($elm, dta) {	..; return {isOk:<true|false>, msgtxt:<AJAX验证警告提示>}; }
};

zcustom = {
'zsuccess' : function ($elm) { ..; return {isOk:<true|false>, msgtxt:<custom验证警告提示>}; }
};

CSS Specification Demo:
<container|form|div> .ZValidator
<msgDom|span>	.ZValidatorMsg {:zAddClazz}
	-.ZValidatorMsg_dcr
	-.ZValidatorMsg_ico
	-.ZValidatorMsg_txt
*/

(function($) {
	'use strict';
	var _zValiDifotSetts = { zname:'zValiElm', zAddClazz: '' };
	var _zValiMacValNm = '@@ZFomValidon';
	var _zValiMsgtxt_Z = 'zvalimsgtxt_z';
	
	window[_zValiMacValNm] = function(setts, $fom) {
		var _zvaliokTag = 'zvaliok';
		var _zValiPriority = {
			zReq: 'zrequire',
			zMinlen: 'zminlen',
			zMaxlen: 'zmaxlen',
			zEq: 'zequal',
			zMbl: 'zmobile',
			zIDkd: 'zidcard',
			zEml: 'zemail',
			zCust: 'zcustom',
			zAjaz: 'zdesync'
		};
		var _zequalTxt = 'zequalTxt';
		var _zValiCustMsgAttr ='zwarntxt';
		var _zValiDifotMsgtxt = {};
		_zValiDifotMsgtxt[_zValiPriority.zReq] = '请输入{:0}';
		_zValiDifotMsgtxt[_zValiPriority.zMinlen] = '长度不能超过{:0}';
		_zValiDifotMsgtxt[_zValiPriority.zMaxlen] = '长度不能短于{:0}';
		_zValiDifotMsgtxt[_zValiPriority.zEq] = '和{:0}不相等';
		_zValiDifotMsgtxt[_zValiPriority.zMbl] = '手机号格式不正确';
		_zValiDifotMsgtxt[_zValiPriority.zIDkd] = '身份证号格式不正确';
		_zValiDifotMsgtxt[_zValiPriority.zEml] = '邮箱格式不正确';
		_zValiDifotMsgtxt[_zValiPriority.zCust] = '此处填写不正确';
		_zValiDifotMsgtxt[_zValiPriority.zAjaz] = '此处填写不正确';
		var _zValiExpr = {};
		_zValiExpr[_zValiPriority.zReq] = function($elm) {
			var rzlt = '';
			rzlt = $elm.is(':checkbox') ? $elm[0].checked : '';
			if (rzlt === '' && $elm.is(':radio')) {
				rzlt = false;
				var $rdos = $elm.parents('.ZValidator').find('[name='+$elm.attr('name')+']');
				for(var i = 0; i< $rdos.length; i++) {if($rdos[i].checked) { rzlt = true; break; }}
			}
			if (rzlt === '') {rzlt = $elm.val() !== '';}
			return rzlt;
		};
		_zValiExpr[_zValiPriority.zMinlen] = function($elm) {
			return $elm.val().length >= parseInt($elm.attr(_zValiPriority.zMinlen));
		};
		_zValiExpr[_zValiPriority.zMaxlen] = function($elm) {
			return $elm.val().length <= parseInt($elm.attr(_zValiPriority.zMaxlen));
		};
		_zValiExpr[_zValiPriority.zEq] = function($elm) {
			var $toEq = $($elm.attr(_zValiPriority.zEq));
			var eqTxt = '';
			if($toEq.is('input,textarea')) { eqTxt = $toEq.val(); }
			else { eqTxt = $toEq.html(); }
			return $elm.val() === eqTxt;
		};
		_zValiExpr[_zValiPriority.zMbl] = function($elm) {
			return (/^\d{11}$/).test($elm.val());
		};
		_zValiExpr[_zValiPriority.zIDkd] = function($elm) {
			return (/^\d{17}[0-9xy]$/i).test($elm.val());
		};
		_zValiExpr[_zValiPriority.zEml] = function($elm) {
			return (/^[a-z0-9\_\-]+\@[a-z0-9\_\-]+(\.[a-z0-9]+){1,2}$/i).test($elm.val());
		};
		_zValiExpr[_zValiPriority.zCust] = function($elm) {
			var dta = eval($elm.attr(_zValiPriority.zCust))['zsuccess']($elm);
			$elm.attr(_zValiMsgtxt_Z, dta.msgtxt);
			valiOk($elm, _zValiPriority.zCust, dta.isOk);
		};
		_zValiExpr[_zValiPriority.zAjaz] = function($elm) {
			var ajzDta = eval($elm.attr(_zValiPriority.zAjaz));
			ajzDta['success'] || (ajzDta['success'] = function(resDta) {
				var dta = ajzDta.zsuccess($elm, resDta);
				$elm.attr(_zValiMsgtxt_Z, dta.msgtxt);
				valiOk($elm, _zValiPriority.zAjaz, dta.isOk);
			});
			$.ajax(ajzDta);
		};
		var _zValiMsg = {};
		_zValiMsg[_zValiPriority.zReq] = function($elm) {
			var msg = _zValiDifotMsgtxt[_zValiPriority.zReq].replace(/\{\:0\}/g, $elm.attr(_zValiPriority.zReq) || '');
			if($elm.is(':checkbox, :radio, select')) msg = msg.replace('输入', '选择');
			return msg;
		};
		_zValiMsg[_zValiPriority.zMinlen] = function($elm) {
			return _zValiDifotMsgtxt[_zValiPriority.zMinlen].replace(new RegExp('{:0}', 'g'), $elm.attr(_zValiPriority.zMinlen));
		};
		_zValiMsg[_zValiPriority.zMaxlen] = function($elm) {
			return _zValiDifotMsgtxt[_zValiPriority.zMaxlen].replace(new RegExp('{:0}', 'g'), $elm.attr(_zValiPriority.zMaxlen));
		};
		_zValiMsg[_zValiPriority.zEq] = function($elm) {
			return _zValiDifotMsgtxt[_zValiPriority.zEq].replace('{:0}', $elm.attr(_zequalTxt));
		};
		_zValiMsg[_zValiPriority.zMbl] = function() {
			return _zValiDifotMsgtxt[_zValiPriority.zMbl];
		};
		_zValiMsg[_zValiPriority.zIDkd] = function() {
			return _zValiDifotMsgtxt[_zValiPriority.zIDkd];
		};
		_zValiMsg[_zValiPriority.zEml] = function() {
			return _zValiDifotMsgtxt[_zValiPriority.zEml];
		};		
		_zValiMsg[_zValiPriority.zCust] = function($elm) {
			return $elm.attr(_zValiMsgtxt_Z) || _zValiDifotMsgtxt[_zValiPriority.zAjaz];
		};		
		_zValiMsg[_zValiPriority.zAjaz] = function($elm) {
			return $elm.attr(_zValiMsgtxt_Z) || _zValiDifotMsgtxt[_zValiPriority.zAjaz];
		};
		
		var _zValiMsgOptr = {
			_domHtml : '<span class="ZValidatorMsg {:zAddClazz}"><i class="ZValidatorMsg_dcr"></i><i class="ZValidatorMsg_ico"></i><span class="ZValidatorMsg_txt"></span></span>',
			_buildDom : function ($elm, zAddClazz) {
				if($elm.attr('msgdom') !== '1') {
					$elm.attr('msgdom', 1);
					$(_zValiMsgOptr._domHtml.replace('{:zAddClazz}', zAddClazz)).insertAfter($elm);
				}
			},
			showMsg : function ($elm, valiItem, zAddClazz) {
				_zValiMsgOptr._buildDom($elm, zAddClazz);
				var $msgDom = $elm.next('.ZValidatorMsg');
				$msgDom.find('.ZValidatorMsg_txt').text($elm.attr(_zValiCustMsgAttr) || _zValiMsg[valiItem]($elm));
				$msgDom.show();
			},
			hideMsg : function ($elm) {
				$elm.next('.ZValidatorMsg').hide();
			}
		};
		
		function MainExec() {
			$fom.addClass('ZValidator');
			$fom.on('blur', '[zname=' + setts.zname + ']', valiStack);
			if(setts.zSubmitButton) {
				var $subBtn = $(setts.zSubmitButton);
				if(!$subBtn.is(':submit')) {
					$subBtn.click(valiOnly);
				}
			}
			setts.noSubmit ? valiOnly() : $fom.submit(valiAll);
		}

		function valiAll() {
			setts.waiting ? setts.waiting() : 0;
			var $failItms = $fom.find('[zname=' + setts.zname + ']:not([' + _zvaliokTag + '=1])');
			var alloked = $failItms.length === 0;
			if(!alloked) {
				$failItms.each(function () { valiStack(null, $(this)); });
			}
			return alloked;
		}
		
		function valiOnly() {
			$fom.submit(function () {return false;});
			valiAll();
		}
		
		function valiOk($elm, valiItem, isOk) { // isOK: 0 | 1
			if(!$elm.is(':visible')) {$elm.attr(_zvaliokTag, 1); return;}
			$elm.attr(_zvaliokTag, isOk * 1);
			isOk ? _zValiMsgOptr.hideMsg($elm) : _zValiMsgOptr.showMsg($elm, valiItem, setts.zAddClazz);
		}

		function valiStack(e, $elm) {
			$elm = $elm || $(e.srcElement || e.target);
			$elm.val($.trim($elm.val()));
			for (var i in _zValiPriority) {
				if($elm.is('['+_zValiPriority[i]+']')) {
					if (!_zValiExpr[_zValiPriority[i]]($elm)) {
						if(['zCust', 'zAjaz'].indexOf(i) < 0) {
							valiOk($elm, _zValiPriority[i], 0);
						}
						return false;
					} else {
						if(['zCust', 'zAjaz'].indexOf(i) < 0) {
							valiOk($elm, 0, 1);
						}
					}
				}
			}
			return true;
		}
		
		MainExec();
	};

	$.fn.extend({ZValidate:function(setts) {
		setts = $.extend(0, _zValiDifotSetts, setts);
		window[_zValiMacValNm](setts, $(this));
	}});
})(jQuery);
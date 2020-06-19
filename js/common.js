/* written by Andonero, 2019.11.17 */

(function($) {
	'use strict';
	String.prototype.toInt = function() {
		return parseInt(this);
	};
	String.prototype.toFloat = function() {
		return parseFloat(this);
	};
	Number.prototype.toMoney = function() {
		var val = Math.round(this * 100);
		var str = val.toString();
		return str.replace(str.substr(0, str.length - 2), str.substr(0, str.length - 2) + '.');
	};

	window.tools = {
		//HTML智能替换，默认替换符号为{:<变量名>}
		htmlExReplacer: function(tmplte, data, allowEmpty, chats) {
			var rExp;
			chats = chats || ['\\{\\:', '\\}'];
			rExp = [chats[0], '(\\w+[\\w\\d]?)', chats[1]].join('');
			rExp = new RegExp(rExp, 'g');
			return tmplte.replace(rExp,
			function(s, s1) {
				if ([null, undefined].indexOf(data[s1]) < 0) {
					return data[s1];
				} else {
					return allowEmpty ? '': s;
				}
			});
		}
	};
	
	$(document).ready(function () {
		$('<a style="display:block; padding:.5em 1em; text-align:right;" href="../index.html">&lt;&lt; back to list</a>').insertBefore($('body *:first'));
	});
})(jQuery);
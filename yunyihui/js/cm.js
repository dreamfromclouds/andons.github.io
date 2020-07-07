window.tools = {
	winWidth: function () {
		return $(window).width();
	},
	htmlMaker: function (template, data, allowEmpty, chats) {
		var regExp;
		//默认替换符号为{:xxx}
		chats = chats || ['\\{\\:', '\\}'];
		regExp = [chats[0], '([_\\w]+[\\w\\d_]?)', chats[1]].join('');
		regExp = new RegExp(regExp, 'g');
		return template.replace(regExp,
			function (s, s1) {
				if (data[s1] != null && data[s1] != undefined) {
					return data[s1];
				} else {
					return allowEmpty ? '' : s;
				}
			});
	},
	tabs: function ($tabs, $tabPnl, evt, initIdx) {
		if (!($tabs instanceof jQuery)) {
			$tabs = $($tabs);
		}
		if (!($tabPnl instanceof jQuery)) {
			$tabPnl = $($tabPnl);
		}
		if (!evt) {
			evt = "click";
		}

		$tabs.bind(evt, function () {
			var $ths = $(this);
			var idx = $tabs.index(this);
			$ths.addClass("mytabs_tab_on").siblings(".mytabs_tab_on").removeClass("mytabs_tab_on");
			$tabPnl.eq(idx).addClass("mytabs_pnl_on").siblings(".mytabs_pnl_on").removeClass("mytabs_pnl_on");
		});
		if (!initIdx) {
			initIdx = 0;
		}
		$tabs.eq(initIdx).trigger(evt);
	},

	pgeTyp: function () {
		var typ = $("script:last").attr("src").toString().split("?");
		if (typ.length > 1) {
			return typ[1];
		}
		return false;
	},
	goScrollY: function (offsetY) {
		if (offsetY === undefined) {
			return document.body.scrollTop > 0 ? document.body.scrollTop : document.documentElement.scrollTop;
		} else {
			document.body.scrollTop = document.documentElement.scrollTop = offsetY;
		}
	},
	
	getScrollY : function () {
		return document.body.scrollTop > document.documentElement.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
	},
	
	changeVliCode : function (img) {
		img.src = img.src + '?p=' + Math.random();
	}
}
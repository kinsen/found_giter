define('kong/dialog', ['$', 'templatable', 'confirmbox'], function(require, exports) {
	var $ = require('$');
	var ConfirmBox = require('confirmbox');

	exports.notice = function(message) {
		require.async('jgrowl', function() {
			$.jGrowl(message);
		});
	};

	exports.alert = function(message, title, fn, btnText) {
		var screenHeight = window.screen.height; //当前浏览器窗口的 高
		var scrolltop = $(document).scrollTop(); //获取当前窗口距离页面顶部高度

		ConfirmBox.alert(message, fn, {
			title: title || "提示",
			closeTpl: " ",
			effect: "fade",
			align: {
				selfXY: ["center", "center"],
				baseXY: ["center", window == top ? scrolltop > 0 ? screenHeight / 2 : screenHeight / 2 : "center"]
			},
			// parentNode: self == top ? document.body : top.document.body,
			confirmTpl: '<a class="ui-button ui-button-hgreen fn-width90">' + (btnText || "确定") + '</a>'
		});
	};

	exports.confirm = function(message, title, fn1, fn2, btnConfirmText, btnCancelText) {
		var screenHeight = window.screen.height; //当前浏览器窗口的 高
		var scrolltop = $(document).scrollTop(); //获取当前窗口距离页面顶部高度

		ConfirmBox.confirm(message, title || "提示", fn1, fn2, {
			closeTpl: ' ',
			align: {
				selfXY: ["center", "center"],
				baseXY: ["center", window == top ? scrolltop > 0 ? screenHeight / 2 : screenHeight / 2 : "center"]
			},
			// parentNode: self == top ? document.body : top.document.body,
			confirmTpl: '<a class="ui-button ui-button-lgreen fn-width100px">' + (btnConfirmText || "确定") + '</a>',
			cancelTpl: '<a class="ui-button ui-button-horange fn-width100px">' + (btnCancelText || "取消") + '</a>'
		});
	};

	exports.timerAlert = function(message, title, fn, timerMax, options) {
		timerMax = timerMax || 3;

		var screenHeight = window.screen.height; //当前浏览器窗口的 高
		var scrolltop = $(document).scrollTop(); //获取当前窗口距离页面顶部高度

		var defaults = {
			message: message,
			title: title || "提示",
			confirmTpl: '<a class="ui-button ui-button-sorange">确定</a>',
			cancelTpl: '',
			closeTpl: " ",
			align: {
				selfXY: ["center", "center"],
				baseXY: ["center", window == top ? scrolltop > 0 ? screenHeight / 2 : screenHeight / 2 : "center"]
			},
			// parentNode: self == top ? document.body : top.document.body,
			onConfirm: function() {
				fn && fn();
				this.hide();
			}
		};
		var cb = new ConfirmBox($.extend(null, defaults, options)).after("hide", function() {
			this.destroy();
		});
		cb.show();

		timerMax--;
		var timer = window.setInterval(function() {
			var html = '<a class="ui-button ui-button-sorange">确定' + "(" + timerMax + ")</a>";
			cb.set('confirmTpl', html);
			if (timerMax-- <= 0) {
				cb.hide();
				window.clearInterval(timer);
				fn && fn();
			}
		}, 1000);
	};
});
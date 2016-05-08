define("kong/jquery.extend", ['$'], function(require, exports) {
	var $ = require("$");
	/*Browser detection patch*/
	$.browser = {};
	$.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
	$.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
	$.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
	$.browser.safari = /safari/.test(navigator.userAgent.toLowerCase());
	$.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
	$.browser.msie10 = $.browser.msie && /msie 10\.0/i.test(navigator.userAgent.toLowerCase());
	$.browser.msie9 = $.browser.msie && /msie 9\.0/i.test(navigator.userAgent.toLowerCase());
	$.browser.msie8 = $.browser.msie && /msie 8\.0/i.test(navigator.userAgent.toLowerCase());
	$.browser.msie7 = $.browser.msie && /msie 7\.0/i.test(navigator.userAgent.toLowerCase());
	$.browser.msie6 = !$.browser.msie8 && !$.browser.msie7 && $.browser.msie && /msie 6\.0/i.test(navigator.userAgent.toLowerCase());

	/**
	 * 只能输入数字
	 * 例如：$(input[type='text']).numeral();
	 * @param  {Boolean} isSupportZero 是否支持0开头
	 */
	$.fn.numeral = function(isSupportZero) {
		$(this).css("ime-mode", "disabled");
		this.bind("keypress", function() {
			//Delete
			if (event.keyCode == 46) {
				if (this.value.indexOf(".") != -1) {
					return false;
				}
			} else {
				//0-9
				return event.keyCode >= 46 && event.keyCode <= 57;
			}
		});
		this.bind("blur", function() {
			if (this.value.lastIndexOf(".") == (this.value.length - 1)) {
				this.value = this.value.substr(0, this.value.length - 1);
			} else if (isNaN(this.value)) {
				this.value = "";
			}
		});
		this.bind("paste", function() {
			var s = clipboardData.getData('text');
			if (!/\D/.test(s));
			if (!isSupportZero)
				value = s.replace(/^0*/, '');
			return false;
		});
		this.bind("dragenter", function() {
			return false;
		});
		this.bind("keyup", function() {
			if (/(^0+)/.test(this.value)) {
				if (!isSupportZero)
					this.value = this.value.replace(/^0*/, '');
			}
		});
		return this;
	};

	/**
	 * 只能输入数字
	 * 例如：$(input[type='text']).digital();
	 * @param  {Boolean} isSupportZero 是否支持0开头
	 */
	$.fn.digital = function(isSupportZero) {
		$(this).css("ime-mode", "disabled");
		this.bind("keypress", function() {
			//Delete
			if (event.keyCode == 46) {
				return false;
			} else {
				//0-9
				return event.keyCode >= 46 && event.keyCode <= 57;
			}
		});
		this.bind("blur", function() {
			if (this.value.lastIndexOf(".") == (this.value.length - 1)) {
				this.value = this.value.substr(0, this.value.length - 1);
			} else if (isNaN(this.value)) {
				this.value = "";
			}
		});
		this.bind("paste", function() {
			var s = clipboardData.getData('text');
			if (!/\D/.test(s));
			if (!isSupportZero)
				value = s.replace(/^0*/, '');
			return false;
		});
		this.bind("dragenter", function() {
			return false;
		});
		this.bind("keyup", function() {
			if (/^\d+$/.test(this.value)) {
				if (!isSupportZero)
					this.value = this.value.replace(/^0\d*$/, '');
			}
		});
		return this;
	};

	/**
	 * 输入内容必须和正则相匹配
	 * @param  {Regex} regex_rule 正则表达式
	 * Example:
	 * /^[0-9]+(.[0-9]{1,3})?$/ 验证有1-3位小数的正实数
	 * /^[0-9]+(.[0-9]{2})?$/ 	验证有两位小数的正实数
	 */
	$.fn.regex = function(regex_rule) {
		regex_rule = regex_rule || /\d*/;
		$(this).css("ime-mode", "disabled");
		this.bind("keypress", function() {
			var ch = String.fromCharCode(event.keyCode);
			return regex_rule.test(this.value + ch);
		});
		this.bind("blur", function() {
			if (!regex_rule.test(this.value)) {
				this.value = "";
			}
		});
		this.bind("paste", function() {
			var s = clipboardData.getData('text');
			return regex_rule.test(s);
		});
		this.bind("dragenter", function() {
			return false;
		});
		this.bind("keyup", function() {});
		return this;
	};
});
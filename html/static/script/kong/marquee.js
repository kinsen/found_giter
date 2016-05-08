(function(global, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
          return factory($, global, global.document, global.Math);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'), global, global.document, global.Math);
    } else {
        factory(jQuery, global, global.document, global.Math);
    }
})(typeof window !== 'undefined' ? window : this, function($, window, document, Math, undefined) {
    'use strict';
	$.fn.ScrollMarquee = function(options) {
		//默认配置
		var defaults = {
			speed: 3000, //滚动速度,值越大速度越慢
			rowHeight: 32 //每行的高度
		};

		var opts = $.extend({}, defaults, options),
			intId = [];

		function marquee(obj, rowHeight) {

			$(obj).find("ul:first").animate({
				marginTop: "-" + rowHeight + "px"
			}, 500, function() {
				$(this).css({
					marginTop: "0px"
				}).find("li:first").appendTo(this);
			});
		}

		this.each(function(i) {
			var sh = opts["rowHeight"],
				speed = opts["speed"],
				_this = $(this);
			intId[i] = setInterval(function() {
				if (_this.find("ul").height() <= _this.height()) {
					clearInterval(intId[i]);
				} else {
					marquee(_this, sh);
				}
			}, speed);

			_this.hover(function() {
				clearInterval(intId[i]);
			}, function() {
				intId[i] = setInterval(function() {
					if (_this.find("ul").height() <= _this.height()) {
						clearInterval(intId[i]);
					} else {
						marquee(_this, sh);
					}
				}, speed);
			});

		});

	}
});
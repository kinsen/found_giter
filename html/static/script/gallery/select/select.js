define(['$', 'mousewheel', 'jscrollpane', 'gallery/jScrollPane/jquery.jscrollpane.css'], function(require, exports, module) {
	var $ = require('$');
	$.fn.select = function(l) {
		$.fn.select.deflunt = {
			style: "ui-select-gray",
			border: 0,
			w: 100,
			h: 24,
			sw: 24,
			sh: 24,
			fn: "click",
			z: 0,
			snum: 5
		};

		return this.each(function() {
			var b = $.extend({}, $.fn.select.deflunt, l),
				h = $(this),
				f = b.style,
				s = b.style,
				c = b.border,
				d = b.w,
				g = b.h,
				i = b.sw,
				j = b.sh,
				m = b.fn,
				n = b.snum,
				z = b.z
			e = (new Date).getTime(),
				e = e.toString().substr(9, 4),
				k = (g - j) / 2,
				b = " width:" + (d - 2 * c) + "px; border-width:" + c + "px; z-index:" + z + ";",
				o = " width:" + (d - 2 * c) + "px; height:" + (g - 2 * c) + "px;",
				p = " width:" + (d - 2 * c - 10 - 2 * k - i) + "px; height:" + g + "px; line-height:" + g + "px; padding:0 5px;",
				i = " width:" + i + "px; height:" + j + "px; margin:" + k + "px;",
				j = " width:" + (d - 2 * c) + "px; height:" + n * g + "px;",
				c = " width:" + (d - 2 * c - 10) + "px; height:" + g + "px; line-height:" + g + "px; padding:0 5px;";
			//重新设置select宽度
			h.width(d);
			f = "" + ("<div class='" + f + "' style='" + b + "' id='" + e + "'>") + ("<div class='dt' style='" + o + "'>") + ("<span class='bt ellipsis' style='" + p + "'>" + h.find("option").eq(0).html() + "</span>");
			f = f + ("<span class='xl' style='" + i + "'></span>") + "</div>" + ("<div class='dd' id='DD_" + e + "' style='" + j + "'>");
			//设置选择事件
			var changeEvent = h.attr("onchange");
			for (d = 0; d < h.find("option").length; d++) {
				if (changeEvent != undefined)
					f += "<a href='javascript:void(0)' style='" + c + "' onclick='" + changeEvent + "' alt='" + h.find("option").eq(d).val() + "'>" + h.find("option").eq(d).html() + "</a>";
				else
					f += "<a href='javascript:void(0)' style='" + c + "'>" + h.find("option").eq(d).html() + "</a>";
			}
			//移除option变化后的重复样式
			if (h.parent().find("div[class='" + s + "']") != null)
				h.parent().find("div[class='" + s + "']").remove();

			h.after(f + "</div></div>");
			$("body").delegate("#" + e, m, function() {
				$(this).find(".dd").stop().slideToggle(100)
			});
			$("body").delegate("#" + e + " a", "click", function() {
				//a("#" + e + " .bt").html(a(this).html());
				$(this).parent().parent().parent().siblings().find(".bt").html($(this).html())
				$(h).find("option").eq($(this).index()).attr("selected", "selected").siblings().removeAttr("selected")
			});
			$("#DD_" + e).jScrollPane();
			$("#DD_" + e).hide()
		})
	}
});
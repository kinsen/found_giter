(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function(jQuery) {
	$.timer = function(func, time, autostart) {
		return this.set = function(func, time, autostart) {
			var paramList, arg;
			if (this.init = !0, "object" == typeof func) {
				paramList = ["autostart", "time"];
				for (arg in paramList) void 0 != func[paramList[arg]] && eval(paramList[arg] + " = func[paramList[arg]]");
				func = func.action
			}
			return "function" == typeof func && (this.action = func), isNaN(time) || (this.intervalTime = time), autostart && !this.isActive && (this.isActive = !0, this.setTimer()), this
		}, this.once = function(a) {
			var b = this;
			return isNaN(a) && (a = 0), window.setTimeout(function() {
				b.action()
			}, a), this
		}, this.play = function(a) {
			return this.isActive || (a ? this.setTimer() : this.setTimer(this.remaining), this.isActive = !0), this;
		}, this.pause = function() {
			return this.isActive && (this.isActive = !1, this.remaining -= new Date - this.last, this.clearTimer()), this;
		}, this.stop = function() {
			return this.isActive = !1, this.remaining = this.intervalTime, this.clearTimer(), this;
		}, this.toggle = function(a) {
			return this.isActive ? this.pause() : a ? this.play(!0) : this.play(), this;
		}, this.reset = function() {
			return this.isActive = !1, this.play(!0), this;
		}, this.clearTimer = function() {
			window.clearTimeout(this.timeoutObject);
		}, this.setTimer = function(a) {
			var b = this;
			"function" == typeof this.action && (isNaN(a) && (a = this.intervalTime), this.remaining = a, this.last = new Date, this.clearTimer(), this.timeoutObject = window.setTimeout(function() {
				b.go()
			}, a))
		}, this.go = function() {
			this.isActive && (this.action(), this.setTimer())
		}, this.init ? new $.timer(func, time, autostart) : (this.set(func, time, autostart), this)
	}
}));
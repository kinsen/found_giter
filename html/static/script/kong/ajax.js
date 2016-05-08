define("kong/ajax", ['$', 'mask', 'kong/dialog', 'kong/common'], function(require, exports) {
	var $ = require("$");
	var ConfirmBox = require("kong/dialog");
	var debug = false;

	// 开启加载遮罩层,Ajax请求前调用
	var openLodingMask = function() {
		// 此处不使用Arale的Mask是因为它是单一实例，如果调用会调用Dialog等后会调用Mask.hide()
		// 导致背景没遮罩，所以自己实现一个遮罩，避免和Mask调用污染
		var mask = $("#loadingmask");
		if (!mask.length) {
			mask = $("<div id='loadingmask' class='alpha'></div>");
			mask.css("height", "100%").css("width", "100%").css("z-index", "9999")
				.css("position", "fixed").css("position", "_position").css("top", "0px").css("left", "0px")
				.css("background", "#ccc").css("text-align", "center").css("filter", "alpha(Opacity=50)")
				.css("-moz-opacity", "0.5").css("opacity", "0.5");
			var loadingImg = $("<span/>").addClass('ui-loading')
				.css("position", "relative").css("top", "48%");
			loadingImg.appendTo(mask);
			$("body").append(mask);
		}
		mask.show();
	};
	// 关闭加载遮罩层,Ajax请求结束时调用
	var closeLoadingMask = function() {
		var mask = $("#loadingmask");
		if (mask.length) mask.hide();
	};

	function AjaxHelper() {}
	AjaxHelper.prototype = {
		// 是否调试状态，默认false（调试状态下会dialog出错误）
		Debug: debug,
		// 是否使用遮罩层（在Ajax调用中显示）
		IsMask: true,
		// 目标对象，既触发本次操作的对象，如表单，按钮等
		Target: undefined,
		// 当Ajax调用开始前调用（一般是一个遮罩调用）
		OnStart: function() {
			if (this.IsMask) openLodingMask();
		},
		// 给外部overview用
		OnSuccess: function(data) {
			var fn = function(data) {
				data = eval(data);
				if (data.model.redirect)
					return Redirect(data.model.redirect);
				var msg = '操作' + (data.ErrorCode == 0 ? '成功' : '失败');
				if (!isNullOrEmpty(data.message)) msg = data.message;
				ConfirmBox.alert(msg);
			};
			cp = this.OnSuccess || fn;
			cp(data);
		},
		// overview
		OnError: function(data) {
			if (data.statusText == "timeout") {
				ConfirmBox.timerAlert("服务器繁忙，请稍候再试!");
			} else {
				ConfirmBox.timerAlert(data.responseText || "未知错误", data.statusText);
			}
		},
		// 当调用结束时调用，无论成功与否（一般是关闭遮罩）
		OnComplete: undefined,
		// 内部成功方法
		onSuccess: function() {
			try {
				this.OnSuccess && this.OnSuccess.apply(this.Target, arguments);
			} catch (err) {
				console.log(err);
				if (this.Debug)
					ConfirmBox.alert(err);
			}
		},
		// 内部错误方法
		onError: function() {
			try {
				this.OnError && this.OnError.apply(this.Target, arguments);
			} catch (err) {
				console.log(err);
				if (this.Debug)
					ConfirmBox.alert(err);
			}
		},
		// 内部真实调用的完成方法
		onComplete: function() {
			// 先关闭遮罩层
			if (this.IsMask)
				closeLoadingMask();
			// 调用用户自定义完成方法
			try {
				this.OnComplete && this.OnComplete.apply(this.Target, arguments);
			} catch (err) {
				console.log(err);
				if (this.Debug)
					ConfirmBox.alert(err);
			}
		}
	};

	exports.AjaxHelper = AjaxHelper;

	// 异步GET方法
	// 如果ajaxHelper不为空则其他参数必然为空
	exports.GET = function(url, ajaxHelper, onSuccess, onError, onStart, onCompleted) {
		var argsLen = arguments.length;
		if (argsLen === 1) {
			url = arguments[0];
			ajaxHelper = new AjaxHelper();
		} else if (argsLen === 2) {
			url = arguments[0];
			ajaxHelper = arguments[1];
		} else if (argsLen > 2) {
			var argsDic = {
				0: "url",
				1: "onSuccess",
				2: "onError",
				3: "onStart",
				4: "onCompleted"
			};
			for (var i = 0; i < arguments.length; i++)
				eval('argsDic[i]=arguments[i]');
		}

		url = addActionToUrl(url, "_ticket", new Date().getTime());
		$.ajax({
			url: url,
			type: "GET",
			dateType: "json",
			timeout: 10000,
			success: onSuccess || ajaxHelper.onSuccess.Apply(ajaxHelper),
			error: onError || ajaxHelper.OnError.Apply(ajaxHelper),
			complete: onCompleted || ajaxHelper.onComplete.Apply(ajaxHelper)
		});

		var start = onStart || ajaxHelper.OnStart.Apply(ajaxHelper);
		start();
	};

	// 异步POST方法
	// 必须有url和params
	// 如果ajaxHelper不为空则其他参数必然为空
	exports.POST = function(url, params, ajaxHelper, onSuccess, onError, onStart, onCompleted) {
		var argsLen = arguments.length;
		if (argsLen === 3) {
			url = arguments[0];
			params = arguments[1];
			ajaxHelper = arguments[2];
		} else if (argsLen > 3) {
			var argsDic = {
				0: "url",
				1: "params",
				2: "onSuccess",
				3: "onError",
				4: "onStart",
				5: "onCompleted"
			};
			for (var i = 0; i < arguments.length; i++)
				eval('argsDic[i]=arguments[i]');
		}

		var paramStr = "";
		if (typeof params === "string") {
			paramStr = params;
		} else {
			var isFirst = true;
			for (var p in params) {
				if (isFirst) isFirst = false;
				else paramStr += "&";
				paramStr += "{0}={1}".format(p, params[p]);
			}
		}
		$.ajax({
			url: url,
			type: "POST",
			data: paramStr,
			dateType: "json",
			timeout: 10000,
			success: onSuccess || ajaxHelper.onSuccess.Apply(ajaxHelper),
			error: onError || ajaxHelper.OnError.Apply(ajaxHelper),
			complete: onCompleted || ajaxHelper.onComplete.Apply(ajaxHelper)
		});
		var start = onStart || ajaxHelper.OnStart.Apply(ajaxHelper);
		start();
	};

	// 异步DELETE方法
	exports.DELETE = function(url, ajaxHelper, onSuccess, onError, onStart, onCompleted) {
		var argsLen = arguments.length;
		if (argsLen === 1) {
			url = arguments[0];
			ajaxHelper = new AjaxHelper();
		} else if (argsLen === 2) {
			url = arguments[0];
			ajaxHelper = arguments[1];
		} else if (argsLen > 2) {
			var argsDic = {
				0: "url",
				1: "onSuccess",
				2: "onError",
				3: "onStart",
				4: "onCompleted"
			};
			for (var i = 0; i < arguments.length; i++)
				eval('argsDic[i]=arguments[i]');
		}

		$.ajax({
			url: url,
			type: "DELETE",
			dateType: "json",
			timeout: 10000,
			success: onSuccess || ajaxHelper.onSuccess.Apply(ajaxHelper),
			error: onError || ajaxHelper.OnError.Apply(ajaxHelper),
			complete: onCompleted || ajaxHelper.onComplete.Apply(ajaxHelper)
		});

		var start = onStart || ajaxHelper.OnStart.Apply(ajaxHelper);
		start();
	};


	// 附加AjaxHelper对象
	exports.AppendAjaxHelper = function(element, helper) {
		if (!(element instanceof $)) element = $(element);
		if (element.length > 1)
			element.each(function() {
				var clone = helper.clone();
				clone.Target = this;
				$.data(element, "ajaxHelper", clone);
			});
		else {
			helper.Target = element[0];
			$.data(element[0], "ajaxHelper", helper);
		}
	};

	// 从对象中获取AJaxHelper对象
	exports.GetAjaxHelper = function(element) {
		if (element instanceof $) element = element[0];
		return $.data(element, "ajaxHelper");
	};



});
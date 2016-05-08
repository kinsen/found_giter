/* iframe 自设高度 */
define("kong/iframe", ['$'], function(require, exports, module) {
	var $ = require("$");
	var app = {
		frame: (function() {

			var $frame;

			function init() {
				initVars();
				initEvents();
				$frame.css('width', '100%');
			}

			function initVars() {
				$frame = $('iframe[data-autosize=true]');
			}

			function resize(frame) {
				$frame = (frame instanceof jQuery) ? frame : $(frame);
				setFrameHeight();
			}

			function initEvents() {
				$(window).on('resize', setFrameHeight);
				$frame.load(function() {
					setTimeout(setFrameHeight, 100);
				});
			}

			function setFrameHeight() {
				if ($frame.length == 0) return;
				var offsetHeight = $frame[0].contentWindow ? $frame[0].contentWindow.document.body.offsetHeight : $frame[0].contentDocument.documentElement.offsetHeight;
				//$frame[0].style.height = $frame[0].contentWindow.document.body.offsetHeight + 'px';
				$frame[0].style.height = offsetHeight + 'px';

				setTimeout(setFrameHeight, 500);
			}

			return {
				init: init,
				reinit: initVars,
				resize: resize
			};
		})()
	};

	module.exports = app.frame;
});
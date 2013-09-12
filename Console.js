/*!
 * Name:    Console.js
 * Info:    A simple but useful extension for the JavaScript console with a stack trace and more.
 * Author:  Gabriel Nahmias (http://terrasoftlabs.com|gabriel@terrasoftlabs.com)
 * Version: 1.4
 */

(function(context){
	// Only global namespace.
	var Console = {
		// Options
		options: {
			debug: {},
			stackTrace: {}
		},
		_utils: {}
	},
	defaultOptions = {
		debug: {
			alwaysShowURL: false,
			enabled: true,
			showInfo: true
		},
		stackTrace: {
			enabled: true,
			collapsed: true,
			ignoreDebugFuncs: true,
			spacing: false
		}
	};
	Console.ver = Console.version = 1.4;
	// Utilities
	function extend() {
		for(var i=1; i<arguments.length; i++)
			for(var key in arguments[i])
				if(arguments[i].hasOwnProperty(key))
					arguments[0][key] = arguments[i][key];
		return arguments[0];
	}
	// Add default options.
	extend(Console.options, defaultOptions);
	// String prototype functions
	// For formatting.
	if (!String.prototype.format) {
		String.prototype.format = function () {
			var s = this.toString(),
				args = typeof arguments[0],
				args = (("string" == args || "number" == args) ? arguments : arguments[0]);
			if (!arguments.length)
				return s;
			for (arg in args)
				s = s.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
			return s;
		}
	}
	// For repeating.
	if (!String.prototype.times) {
		String.prototype.times = function () {
			var s = this.toString(),
				tempStr = "",
				times = arguments[0];
			if (!arguments.length)
				return s;
			for (var i = 0; i < times; i++)
				tempStr += s;
			return tempStr;
		}
	}
	// Commonly used functions
	Console.debug = function () {
		if (Console.options.debug.enabled) {
			var args = ((typeof arguments !== 'undefined') ? Array.prototype.slice.call(arguments, 0) : []),
				sUA = navigator.userAgent,
				currentBrowser = {
					firefox: /firefox/gi.test(sUA),
					webkit: /webkit/gi.test(sUA),
				},
				aLines = Console.stackTrace().split("\n"),
				aCurrentLine,
				iCurrIndex = ((currentBrowser.webkit) ? 3 : 2),
				sCssBlack = "color:black;",
				sCssFormat = "color:{0}; font-weight:bold;",
				sLines = "";
			if (currentBrowser.firefox)
				aCurrentLine = aLines[iCurrIndex].replace(/(.*):/, "$1@").split("@");
			else if (currentBrowser.webkit)
				aCurrentLine = aLines[iCurrIndex].replace("at ", "").replace(")", "").replace(/( \()/gi, "@").replace(/(.*):(\d*):(\d*)/, "$1@$2@$3").split("@");
			// Show info if the setting is true and there's no extra trace (would be kind of pointless).
			if (Console.options.debug.showInfo && !Console.options.stackTrace.enabled) {
				var sFunc = aCurrentLine[0].trim(),
					sURL = aCurrentLine[1].trim(),
					sURL = ((!Console.options.debug.alwaysShowURL && context.location.href == sURL) ? "this page" : sURL),
					sLine = aCurrentLine[2].trim(),
					sCol;
				if (currentBrowser.webkit)
					sCol = aCurrentLine[3].trim();
				console.info(
					"%cOn line %c{0}%c{1}%c{2}%c of %c{3}%c inside the %c{4}%c function:".
					 format(sLine, ((currentBrowser.webkit) ? ", column " : ""), ((currentBrowser.webkit) ? sCol : ""), sURL, sFunc),
						 sCssBlack, sCssFormat.format("red"),
						 sCssBlack, sCssFormat.format("purple"),
						 sCssBlack, sCssFormat.format("green"),
						 sCssBlack, sCssFormat.format("blue"),
						 sCssBlack
				);
			}
			// If the setting permits, get rid of the two obvious debug functions (Console.debug and Console.stackTrace).
			if (Console.options.stackTrace.ignoreDebugFuncs) {
				// In WebKit (Chrome at least), there's an extra line at the top that says "Error" so adjust for this.
				if (currentBrowser.webkit)
					aLines.shift();
				aLines.shift();
				aLines.shift();
			}
			sLines = aLines.join(((Console.options.stackTrace.spacing) ? "\n\n" : "\n")).trim();
			trace = typeof trace !== 'undefined' ? trace : true;
			if (typeof console !== "undefined") {
				console.debug.apply(console, args);
	
				if (Console.options.stackTrace.enabled) {
					var sCss = "color:red; font-weight: bold;",
						sTitle = "%c Stack Trace" + " ".times(70);
	
					if (Console.options.stackTrace.collapsed)
						console.groupCollapsed(sTitle, sCss);
					else
						console.group(sTitle, sCss);
	
					console.debug("%c" + sLines, "color: #666666; font-style: italic;");
	
					console.groupEnd();
				}
			}
			return true;
		}
		return false;
	}
	Console.setOption
	Console.stackTrace = function () {
		var err = new Error();
		return err.stack;
	}
	context.Console = Console;
})(window);
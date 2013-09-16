/*!
 * Name:    Console.js
 * Info:    A simple but useful extension for the JavaScript console with a stack trace and more.
 * Author:  Gabriel Nahmias (http://terrasoftlabs.com|gabriel@terrasoftlabs.com)
 * Version: 1.5
 */
(function(context){
	// Only global namespace.
	var Console = {
		// Options
		_options: {}
	},
	defaultOptions = {
		// Basic
		alwaysShowURL: false,
		enabled: true,
		showInfo: true,
		// Stack trace
		enableStackTrace: true,
		collapsed: true,
		ignoreDebugFuncs: true,
		spacing: false,
		useOldStackTrace: false
	},
	sUA = navigator.userAgent,
	currentBrowser = {
		firefox: /firefox/gi.test(sUA),
		webkit: /webkit/gi.test(sUA),
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
	extend(Console._options, defaultOptions);
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
	Console._ = function(method) {
		var enabled = Console.getOption("enabled"),
			exists = (typeof context.console[method] !== 'undefined');
		if (typeof context.console !== 'undefined') {
			if (enabled) {
				if (typeof method === "string") {
					if (exists) {
						var args = ((typeof arguments !== 'undefined') ? Array.prototype.slice.call(arguments, 1) : []),
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
						if (Console.getOption("showInfo") && !Console.getOption("enableStackTrace")) {
							var sFunc = aCurrentLine[0].trim(),
								sURL = aCurrentLine[1].trim(),
								sURL = ((!Console.getOption("alwaysShowURL") && context.location.href == sURL) ? "this page" : sURL),
								sLine = aCurrentLine[2].trim(),
								sCol;
							if (currentBrowser.webkit)
								sCol = aCurrentLine[3].trim();
							context.console.info(
								"%cOn line %c{0}%c{1}%c{2}%c of %c{3}%c inside the %c{4}%c function:".
								 format(sLine, ((currentBrowser.webkit) ? ", column " : ""), ((currentBrowser.webkit) ? sCol : ""), sURL, sFunc),
									 sCssBlack, sCssFormat.format("red"),
									 sCssBlack, sCssFormat.format("purple"),
									 sCssBlack, sCssFormat.format("green"),
									 sCssBlack, sCssFormat.format("blue"),
									 sCssBlack
							);
						}
						// If the setting permits, get rid of the two obvious debug functions (Console.* and Console.stackTrace).
						if (Console.getOption("ignoreDebugFuncs")) {
							// In WebKit (Chrome at least), there's an extra line at the top that says "Error" so adjust for this.
							if (currentBrowser.webkit)
								aLines.shift();
							aLines.shift();
							aLines.shift();
						}
						sLines = aLines.join(((Console.getOption("spacing")) ? "\n\n" : "\n")).trim();
						trace = typeof trace !== 'undefined' ? trace : true;
						context.console[method].apply(context.console, args);
						if (Console.getOption("enableStackTrace")) {
							var sCss = "color:red; font-weight: bold;",
								sTitle = "%c Stack Trace" + " ".times(70);
							if (Console.getOption("collapsed"))
								context.console.groupCollapsed(sTitle, sCss);
							else
								context.console.group(sTitle, sCss);
							// For now, if useOldStackTrace is false and the console being used is Firebug,
							// use console.trace() (it provides great detail about the variables passed, etc.).
							if (!Console.getOption("useOldStackTrace") && context.console.firebug)
								context.console.trace();
							// Otherwise, use old stack trace method (console.trace() on Chrome, etc. is not as
							// detailed as it is on Firebug, so the old method is very comparable).
							else
								context.console.debug("%c" + sLines, "color: #666666; font-style: italic;");
							context.console.groupEnd();
						}
						return true;
					} else
						throw new Error("\"{0}\" does not exist in intrinsic console object.".format(method));
				} else
					throw new Error("Method must be a string.");
			}
		} else
			throw new Error("Console functionality is not available in this browser.");
		return false;
	}
	Console.stackTrace = function () {
		var err = new Error();
		return err.stack;
	}
	Console.getOption = function(option) {
		if (typeof Console._options[option] !== "undefined") {
			return Console._options[option];
		} else
			throw new Error("Option does not exist.");
		// Return null to distinguish true/false scenarios from when the option
		// simply doesn't exist.
		return null;
	}
	Console.setOption = function(option, value) {
		// Only allowing true/false options at the moment, so
		// ensure the values are.
		if (typeof value === "boolean") {
			Console._options[option] = value;
			return true;
		} else
			throw new Error("Value must be a boolean (true/false).");
		return false;
	}
	// Add shortcuts for _ method to Console object.
	Console.assert = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("assert");
		Console._.apply(Console, argList);
	}
	Console.clear = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("clear");
		Console._.apply(Console, argList);
	}
	Console.count = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("count");
		Console._.apply(Console, argList);
	}
	Console.debug = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("debug");
		Console._.apply(Console, argList);
	}
	Console.dir = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("dir");
		Console._.apply(Console, argList);
	}
	Console.dirxml = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("dirxml");
		Console._.apply(Console, argList);
	}
	Console.error = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("error");
		Console._.apply(Console, argList);
	}
	Console.exception = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("exception");
		Console._.apply(Console, argList);
	}
	Console.group = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("group");
		Console._.apply(Console, argList);
	}
	Console.groupCollapsed = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("groupCollapsed");
		Console._.apply(Console, argList);
	}
	Console.groupEnd = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("groupEnd");
		Console._.apply(Console, argList);
	}
	Console.info = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("info");
		Console._.apply(Console, argList);
	}
	Console.log = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("log");
		Console._.apply(Console, argList);
	}
	Console.profile = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("profile");
		Console._.apply(Console, argList);
	}
	Console.profileEnd = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("profileEnd");
		Console._.apply(Console, argList);
	}
	Console.table = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("table");
		Console._.apply(Console, argList);
	}
	Console.time = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("time");
		Console._.apply(Console, argList);
	}
	Console.timeEnd = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("timeEnd");
		Console._.apply(Console, argList);
	}
	Console.timeStamp = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("timeStamp");
		Console._.apply(Console, argList);
	}
	Console.trace = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("trace");
		Console._.apply(Console, argList);
	}
	Console.warn = function() {
		var argList = Array.prototype.slice.call(arguments, 0);
		argList.unshift("warn");
		Console._.apply(Console, argList);
	}
	// Attach Console to the context (defaults to window object).
	context.Console = Console;
})(window);
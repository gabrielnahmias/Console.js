/*!
 * Name:    Console.js
 * Info:    A simple but useful extension for the JavaScript console with a stack trace and more
 * Author:  Gabriel Nahmias (http://terrasoftlabs.com)
 * Version: 1.15
 */

// Only global namespace.
var Console = {
    //Settings
    settings: {
        debug: {
            enabled: true,
            showInfo: true
        },
        stackTrace: {
            enabled: true,
            collapsed: true,
            ignoreDebugFuncs: true,
            spacing: false
        }
    }
};

// String formatting prototype function.
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

// String repeating prototype function.
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
    var args = ((typeof arguments !== 'undefined') ? Array.prototype.slice.call(arguments, 0) : []),
        aLines = Console.stackTrace().split("\n"),
        aCurrentLine = aLines[2].replace(/(.*):/, "$1@").split("@"),
        sCssBlack = "color:black;",
        sCssFormat = "color:{0}; font-weight:bold;",
        sLines = "";

    // Show info if the setting is true and there's no extra trace (would be kind of pointless).
    if (Console.settings.debug.showInfo && !Console.settings.stackTrace.enabled) {
        var sFunc = aCurrentLine[0],
            sURL = aCurrentLine[1],
            sLine = aCurrentLine[2];
        console.info("%cOn line %c{0}%c in %c{1}%c inside the %c{2}%c function:".format(sLine, sURL, sFunc),
                     sCssBlack, sCssFormat.format("red"),
                     sCssBlack, sCssFormat.format("green"),
                     sCssBlack, sCssFormat.format("blue"),
                     sCssBlack);
    }

    // If the setting permits, get rid of the two obvious debug functions (Console.debug and Console.stackTrace).
    if (Console.settings.stackTrace.ignoreDebugFuncs) {
        aLines.shift();
        aLines.shift();
    }

    sLines = aLines.join(((Console.settings.stackTrace.spacing) ? "\n\n" : "\n")).trim();

    trace = typeof trace !== 'undefined' ? trace : true;
    if (typeof console != "undefined" && Console.settings.debug.enabled == true) {
        for (var arg in args)
            console.debug(args[arg]);

        if (Console.settings.stackTrace.enabled) {
            var sCss = "color:red; font-weight: bold;",
                sTitle = "%c Stack Trace" + " ".times(70);

            if (Console.settings.stackTrace.collapsed)
                console.groupCollapsed(sTitle, sCss);
            else
                console.group(sTitle, sCss);
            
            console.debug("%c" + sLines, "color: #666666; font-style: italic;");
            
            console.groupEnd();
        }
    }
}
Console.stackTrace = function () {
    var err = new Error();
    return err.stack;
}
    /*!
     * Name:    Console.js
     * Info:    A simple but useful extension for the JavaScript console with a stack trace and more
     * Author:  Gabriel Nahmias (http://terrasoftlabs.com)
     * Version: 1.2
     */

    (function(context){
        // Only global namespace.
        var Console = {
            //Settings
            settings: {
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
            if (Console.settings.debug.showInfo && !Console.settings.stackTrace.enabled) {
                var sFunc = aCurrentLine[0].trim(),
                    sURL = aCurrentLine[1].trim(),
                    sURL = ((!Console.settings.debug.alwaysShowURL && context.location.href == sURL) ? "this page" : sURL),
                    sLine = aCurrentLine[2].trim(),
                    sCol;

                if (currentBrowser.webkit)
                    sCol = aCurrentLine[3].trim();

                console.info("%cOn line %c{0}%c{1}%c{2}%c of %c{3}%c inside the %c{4}%c function:".format(sLine, ((currentBrowser.webkit) ? ", column " : ""), ((currentBrowser.webkit) ? sCol : ""), sURL, sFunc),
                             sCssBlack, sCssFormat.format("red"),
                             sCssBlack, sCssFormat.format("purple"),
                             sCssBlack, sCssFormat.format("green"),
                             sCssBlack, sCssFormat.format("blue"),
                             sCssBlack);
            }

            // If the setting permits, get rid of the two obvious debug functions (Console.debug and Console.stackTrace).
            if (Console.settings.stackTrace.ignoreDebugFuncs) {
                // In WebKit (Chrome at least), there's an extra line at the top that says "Error" so adjust for this.
                if (currentBrowser.webkit)
                    aLines.shift();
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
    
        context.Console = Console;
    })(window);
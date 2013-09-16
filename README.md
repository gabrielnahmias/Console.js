Console.js
==========

A simple but useful extension for the JavaScript console with a stack trace and more.

###Methods (most text pulled from [here](https://getfirebug.com/wiki/index.php/Console_API))###
-------------

```javascript Console.assert(expression[, object, ...])```

Tests that an expression is true. If not, it will write a message to the console and throw an exception. 

```javascript Console.clear()```

Clears the console. 

```javascript Console.count([title])```

Writes the number of times that the line of code where count was called was executed. The optional argument title will print a message in addition to the number of the count. 

```javascript Console.debug(object[, object, ...])```

Writes a message to the console, including a hyperlink to the line where it was called. It adds a stack trace depending on if the `stackTraceEnabled` option is set to `true`.

```javascript Console.dir(object)```

Prints an interactive listing of all properties of the object. This looks identical to the view that you would see in the DOM tab.

```javascript Console.dirxml(node)```

Prints the XML source tree of an HTML or XML element. This looks identical to the view that you would see in the HTML tab. You can click on any node to inspect it in the HTML tab.

```javascript Console.error(object[, object, ...])```

Writes a message to the console with the visual "error" icon and color coding and a hyperlink to the line where it was called.

```javascript Console.exception(error-object[, object, ...])```

Prints an error message together with an interactive stack trace of JavaScript execution at the point where the exception occurred.

```javascript Console.getOption(option)```

Gets the value of an option for **Console.js**. [Refer below](#options) to see a list of options whose value you may get.

```javascript Console.group(object[, object, ...]) ```

Writes a message to the console and opens a nested block to indent all future messages sent to the console. Call console.groupEnd() to close the block.

```javascript Console.groupCollapsed(object[, object, ...]) ```

Like `Console.group()`, but the block is initially collapsed.

```javascript Console.groupEnd()```

Closes the most recently opened block created by a call to `Console.group()` or `Console.groupCollapsed()`.

```javascript Console.info(object[, object, ...])```

Writes a message to the console with the visual "info" icon and color coding and a hyperlink to the line where it was called.

######```javascript Console.log(object[, object, ...]) ```######
-------
Writes a message to the console. You may pass as many arguments as you'd like, and they will be joined together in a space-delimited line.

The first argument to log may be a string containing printf-like string substitution patterns. For example:

```javascript
Console.log("The %s jumped over %d tall buildings", animal, count);
```

The example above can be re-written without string substitution to achieve the same result:
```javascript
Console.log("The", animal, "jumped over", count, "tall buildings");
```

These two techniques can be combined. If you use string substitution   but provide more arguments than there are substitution patterns, the   remaining arguments will be appended in a space-delimited line, like so:

```javascript
Console.log("I am %s and I have:", myName, thing1, thing2, thing3);</pre>
```

If objects are logged, they will be written not as static text, but   as interactive hyperlinks that can be clicked to inspect the object in   Firebug's HTML, CSS, Script, or DOM tabs.  You may also use the %o pattern to substitute a hyperlink in a string.

You may also use the %c pattern to use the second argument as a style formatting parameter. For example:

```javascript
Console.log("%cThis is green text on a yellow background.", "color:green; background-color:yellow");</pre>
```

You can even use several `%c` patterns within the string to use different formattings. For each %c there needs to be one argument:

```javascript
Console.log("%cRed text, %cgreen text, %cblue text", "color:red", "color:green", "color:blue");</pre>
```

Here is the complete set of patterns that you may use for string substitution:
<table>
  <tbody>
    <tr>
      <th> Pattern </th>
      <th> Type </th>
    </tr>
    <tr>
      <td> %s </td>
      <td> String </td>
    </tr>
    <tr>
      <td> %d, %i </td>
      <td> Integer (numeric formatting is not yet supported) </td>
    </tr>
    <tr>
      <td> %f/%.<em>x</em>f </td>
      <td> Floating point number; <em>x</em> denotes the number of decimal places the number should be rounded to (if ommitted, the number won't be rounded) </td>
    </tr>
    <tr>
      <td> %o </td>
      <td> Object hyperlink </td>
    </tr>
    <tr>
      <td> %c </td>
      <td> Style formatting </td>
    </tr>
  </tbody>
</table>

These formats and patterns also apply to other message-oriented console functions like `info`, `debug`, and so on.

-------

```javascript Console.profile([title])```

Turns on the JavaScript profiler. The optional argument `title` would contain the text to be printed in the header of the profile report. 

```javascript Console.profileEnd()```

Turns off the JavaScript profiler and prints its report.

```javascript Console.setOption(option, value)```

Changes an option that control's **Console.js**' behavior. The options possible are as follows (defaults are shown in bold):

<a id="options"></a>

---
`alwaysShowURL` (true/**false**)

Always show the URL of the file making a console statement.

`collapsed` (**true**/false)

Show the stack trace initially collapsed.

`enabled` (**true**/false)

Enable/disable all output.

`enableStackTrace` (**true**/false)

Enable/disable stack trace output.

`ignoreInternalFuncs` (**true**/false)

Remove extra clutter from stack trace (**Console.js**-related). Does not affect new `console.trace()` method (cannot modify its output).

`showInfo` (**true**/false)

Show info before each console statement regarding line, file, etc. Does not show if stack trace is enabled (would be redundant).

`spacing` (true/**false**)

Adds extra spacing in the stack trace.

`useOldStackTrace` (true/**false**)

Use old stack trace instead of new `console.trace()` method. This setting will not affect any browser besides Firefox (Firebug) because their `console.trace()` methods are not as extensive, being effectually the same as the one provided by **Console.js**, and the old one suffices.

---

```javascript Console.table(data[, columns])```

Allows to log provided data using tabular layout. The method takes one required parameter that represents table-like data (array of arrays or list of objects). The optional columns parameter can be used to specify columns and/or properties to be logged (see more at [softwareishard.com](softwareishard.com)).

```javascript Console.time(name) ```

Creates a new timer under the given name. Call `console.timeEnd(name)` with the same name to stop the timer and print the time elapsed.. 

```javascript Console.timeEnd(name)```

Stops a timer created by a call to `console.time(name)` and writes the time elapsed.

```javascript Console.timeStamp(name)```

Creates a time stamp, which can be used together with [HTTP traffic timing](https://getfirebug.com/wiki/index.php/Net_Panel#Request_Timeline) to measure when a certain piece of code was executed. 

```javascript Console.trace()```

Prints an interactive stack trace of JavaScript execution at the point where it is called.

The stack trace details the functions on the stack, as well as the values that were passed as arguments to each function. You can click each function to take you to its source in the Script tab, and click each argument value to inspect it in the DOM or HTML tabs. 

```javascript Console.warn(object[, object, ...])```

Writes a message to the console with the visual "warning" icon and color coding and a hyperlink to the line where it was called. 

###Credits###
-------------
**Console.js** is a project by [Gabriel Nahmias](mailto:gabriel@terrasoftlabs.com).
"use strict";
function debugLine (message) {
    //this prints where debugLine is called
    let e = new Error();
    let frame = e.stack.split("\n")[2];
    let lineNumber = e.lineNumber;
    let functionName = frame.split(" ")[5];
    if(typeof message === "string"){
        return e.stack.split("\n")[2] + " " + message;
    }
    return e.stack.split("\n")[2] + " " + message.msg;
    // return functionName + ":" + lineNumber + " " + message;
}

module.exports = {debugLine}
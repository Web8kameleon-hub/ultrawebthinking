"use strict";
exports.__esModule = true;
exports.agiMonitor = exports.AGIMonitor = void 0;
// src/agi/AGIMonitor.ts
var monitor_1 = require("./monitor");
var AGIMonitor = /** @class */ (function () {
    function AGIMonitor() {
        this.logs = [];
    }
    AGIMonitor.prototype.logCommand = function (input, output) {
        var entry = {
            input: input,
            output: output,
            timestamp: new Date()
        };
        this.logs.push(entry);
        monitor_1.monitor.log("\uD83E\uDDE0 AGIMonitor: Komand\u00EB: '" + input + "' \u2192 '" + output + "'", "info", entry);
    };
    AGIMonitor.prototype.getLogs = function () {
        return this.logs;
    };
    AGIMonitor.prototype.exportLogsToJSON = function () {
        return JSON.stringify(this.logs, null, 2);
    };
    return AGIMonitor;
}());
exports.AGIMonitor = AGIMonitor;
exports.agiMonitor = new AGIMonitor();

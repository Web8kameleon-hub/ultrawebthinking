"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var core_1 = require("@/agi/core");
var framer_motion_1 = require("framer-motion");
var css_1 = require("@styled-system/css");
var Surfing = function () {
    var _a = react_1.useState(""), input = _a[0], setInput = _a[1];
    var _b = react_1.useState(""), response = _b[0], setResponse = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState(""), error = _d[0], setError = _d[1];
    var handleAsk = function () { return __awaiter(void 0, void 0, void 0, function () {
        var reply, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!input.trim()) {
                        setError("Please enter a question.");
                        return [2 /*return*/];
                    }
                    setError("");
                    setLoading(true);
                    setResponse("Thinking...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, core_1.agi.run(input)];
                case 2:
                    reply = _a.sent();
                    setResponse(reply);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    console.error("Error:", err_1);
                    setResponse("An error occurred while processing your request.");
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("section", { className: css_1.css({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
            color: "white",
            padding: "8"
        }) },
        react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, className: css_1.css({
                bg: "rgba(255, 255, 255, 0.08)",
                p: "6",
                borderRadius: "xl",
                boxShadow: "lg",
                textAlign: "center",
                maxW: "lg",
                w: "full"
            }) },
            react_1["default"].createElement("h2", { className: css_1.css({ fontSize: "2xl", fontWeight: "bold", mb: "4" }) }, "Interact with AGI"),
            react_1["default"].createElement("input", { type: "text", placeholder: "Ask a question...", value: input, onChange: function (e) { return setInput(e.target.value); }, className: css_1.css({
                    w: "full",
                    p: "3",
                    mb: "3",
                    borderRadius: "md",
                    fontSize: "md"
                }) }),
            error && react_1["default"].createElement("p", { className: css_1.css({ color: "red.400", mb: "2" }) }, error),
            react_1["default"].createElement("button", { onClick: handleAsk, disabled: loading, className: css_1.css({
                    bg: loading ? "gray.400" : "yellow.400",
                    color: "black",
                    px: "5",
                    py: "2",
                    borderRadius: "md",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    _hover: { bg: loading ? "gray.400" : "yellow.300" }
                }) }, loading ? "Thinking..." : "Ask AGI"),
            response && (react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 }, className: css_1.css({
                    mt: "6",
                    p: "4",
                    bg: "rgba(255,255,255,0.05)",
                    borderRadius: "md",
                    fontSize: "md"
                }) }, response)))));
};
exports["default"] = Surfing;

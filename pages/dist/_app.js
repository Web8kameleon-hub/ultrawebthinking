"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var head_1 = require("next/head");
require("../styled-system/styles.css"); // Ensure this path is correct
function App(_a) {
    var Component = _a.Component, pageProps = _a.pageProps;
    return (React.createElement(React.Fragment, null,
        React.createElement(head_1["default"], null,
            React.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
            React.createElement("meta", { charSet: "UTF-8" }),
            React.createElement("meta", { name: "description", content: "Ultrawebthinking - Your next-level web experience starts here." }),
            React.createElement("meta", { name: "keywords", content: "Ultrawebthinking, Next.js, React, Web Development" }),
            React.createElement("meta", { name: "author", content: "Ultrawebthinking Team" }),
            React.createElement("link", { rel: "icon", href: "/favicon.ico" }),
            React.createElement("link", { href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap", rel: "stylesheet" })),
        React.createElement(Component, __assign({}, pageProps))));
}
exports["default"] = App;

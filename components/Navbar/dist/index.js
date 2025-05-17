"use strict";
exports.__esModule = true;
var react_1 = require("react");
var css_1 = require("@styled-system/css");
var Navbar = function (_a) {
    var _b = _a.links, links = _b === void 0 ? [] : _b;
    return (react_1["default"].createElement("nav", { className: css_1.css({
            position: "sticky",
            top: 0,
            zIndex: 999,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingX: "6",
            paddingY: "4",
            background: "rgba(10, 10, 35, 0.8)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        }) },
        react_1["default"].createElement("div", { className: css_1.css({
                fontSize: "2xl",
                fontWeight: "bold",
                color: "white",
                cursor: "pointer"
            }) }, "Ultrawebthinking"),
        react_1["default"].createElement("div", { className: css_1.css({
                display: "flex",
                gap: "6"
            }) }, links.map(function (link, index) { return (react_1["default"].createElement("a", { key: index, href: link.href, className: css_1.css({
                fontWeight: "medium",
                color: "white",
                textDecoration: "none",
                transition: "color 0.2s ease-in-out",
                "&:hover": { color: "cyan.400" }
            }) }, link.label)); }))));
};
exports["default"] = Navbar;

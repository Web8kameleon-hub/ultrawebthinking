"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Surfing_1 = require("@/components/Surfing");
var links = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Contact", href: "#contact" },
];
function HomePage() {
    return react_1["default"].createElement(Surfing_1["default"], null);
}
exports["default"] = HomePage;

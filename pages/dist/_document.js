"use strict";
exports.__esModule = true;
var document_1 = require("next/document");
function Document() {
    return (React.createElement(document_1.Html, { lang: "en" },
        React.createElement(document_1.Head, null,
            React.createElement("link", { href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap", rel: "stylesheet" }),
            React.createElement("meta", { name: "description", content: "Ultrawebthinking - Collaborative thinking and advanced exploration." }),
            React.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
            React.createElement("meta", { charSet: "UTF-8" }),
            React.createElement("meta", { httpEquiv: "X-UA-Compatible", content: "IE=edge" }),
            React.createElement("meta", { name: "theme-color", content: "#000000" }),
            React.createElement("link", { rel: "icon", href: "/favicon.ico" })),
        React.createElement("body", null,
            React.createElement(document_1.Main, null),
            React.createElement(document_1.NextScript, null))));
}
exports["default"] = Document;

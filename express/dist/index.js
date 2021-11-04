"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var WSServeur_1 = require("./WSServeur");
var webSrv = (0, express_1.default)();
var httpSrv = http_1.default.createServer(webSrv);
var wsSrv = new WSServeur_1.WSServer({ httpSrv: httpSrv });
webSrv.get('/favicon.ico', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, '..', 'public', 'favicon.io'));
});
webSrv.get('/bonjour/:prenom', function (req, res) {
    var txt = "Bonjour " + req.params["prenom"];
    res.send(txt);
});
webSrv.get("/sources/:file", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "..", "public", req.params["file"]));
});

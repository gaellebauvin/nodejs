"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSServer = void 0;
var socket_io_1 = require("socket.io");
var UserCollection_1 = require("./UserCollection");
var RoomCollection_1 = require("./RoomCollection");
var WSServer = /** @class */ (function () {
    function WSServer(config) {
        var _this = this;
        this.server = new socket_io_1.Server(config.httpSrv);
        this.onlineUsers = new UserCollection_1.Users();
        this.rooms = new RoomCollection_1.Rooms();
        this.server.on("connection", function (socket) {
            console.log("Un utilisateur s'est connecté");
            socket.emit("log", "" + _this.onlineUsers.get("2"));
            socket.on("chat", function (reason) {
                console.log("Utilisateur déconnecté");
                if (reason) {
                    console.log("pour la raison suivant\"" + (reason) + "\"");
                }
            });
            socket.on("chat", function (msg) {
                console.log("message du canal chat :\"" + msg + "\"");
                socket.emit("chat", "" + msg);
            });
        });
        var port = 3000;
        config.httpSrv.listen(port, function () {
            console.log("Serveur en \u00E9coute sur " + port + " ....");
        });
    }
    return WSServer;
}());
exports.WSServer = WSServer;

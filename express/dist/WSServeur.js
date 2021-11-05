"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSServer = void 0;
var socket_io_1 = require("socket.io");
var UserCollection_1 = require("./UserCollection");
var User_1 = require("./User");
var RoomCollection_1 = require("./RoomCollection");
var WSServer = /** @class */ (function () {
    function WSServer(config) {
        var _this = this;
        this.server = new socket_io_1.Server(config.httpSrv);
        this.onlineUsers = new UserCollection_1.Users();
        this.rooms = new RoomCollection_1.Rooms();
        this.server.on("connection", function (socket) {
            console.log("Un utilisateur s'est connecté");
            var user = new User_1.User({
                id: socket.id,
                pseudo: "Toto",
                collection: _this.onlineUsers,
            });
            _this.onlineUsers.add(user);
            var userList = _this.onlineUsers.all;
            console.log(userList);
            socket.emit("userList", userList);
            socket.broadcast.emit("userList", userList);
            socket.on("disconnect", function (reason) {
                console.log("utilisateur déconnecté");
                if (reason) {
                    console.log("pour la raison suivante " + reason);
                }
                _this.onlineUsers.del(socket.id);
                var userList = _this.onlineUsers.all;
                socket.emit("userList", userList);
                socket.broadcast.emit("userList", userList);
                var userpseudo = _this.onlineUsers.get(socket.id);
            });
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

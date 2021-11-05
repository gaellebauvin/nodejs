"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSServer = void 0;
var socket_io_1 = require("socket.io");
var UserCollection_1 = require("./UserCollection");
var User_1 = require("./User");
var RoomCollection_1 = require("./RoomCollection");
var Room_1 = require("./Room");
var uuid_1 = require("uuid");
var WSServer = /** @class */ (function () {
    function WSServer(config) {
        var _this = this;
        this.server = new socket_io_1.Server(config.httpSrv);
        this.onlineUsers = new UserCollection_1.Users();
        this.rooms = new RoomCollection_1.Rooms();
        this.room1 = new Room_1.Room({ id: (0, uuid_1.v4)(), title: 'Room1', usersCollection: this.onlineUsers });
        this.room2 = new Room_1.Room({ id: (0, uuid_1.v4)(), title: 'Room2', usersCollection: this.onlineUsers });
        this.user = new User_1.User({ id: (0, uuid_1.v4)(), pseudo: 'toto', collection: this.onlineUsers });
        this.user1 = new User_1.User({ id: (0, uuid_1.v4)(), pseudo: 'titi', collection: this.onlineUsers });
        this.rooms.add(this.room1);
        this.server.on("connection", function (socket) {
            console.log("Un utilisateur s'est connecté");
            var users = _this.onlineUsers.all;
            var room = _this.rooms;
            _this.onlineUsers.add(_this.user);
            _this.onlineUsers.add(_this.user1);
            if (users && room) {
                var map = _this.onlineUsers.all.map(function (id) {
                    var user = _this.onlineUsers.get(id);
                    console.log(user);
                    if (user) {
                        return { id: id, pseudo: user.pseudo, urlImage: user.imgUrl };
                    }
                    return false;
                }).filter(function (user) {
                    return typeof user != "boolean";
                });
                console.log("map:", map);
                socket.emit('logged', map);
                socket.emit('initRooms', _this.rooms.all.map(function (id) {
                    var room = _this.rooms.get(id);
                    if (room) {
                        return { id: room.id, title: room.title, urlImage: room.urlImage };
                    }
                }));
            }
            socket.on("disconnect", function (reason) {
                console.log("utilisateur déconnecté");
                if (reason) {
                    console.log("pour la raison suivante " + reason);
                }
                _this.onlineUsers.del((0, uuid_1.v4)());
                var userList = _this.onlineUsers.all;
                socket.emit("userList", userList);
                socket.broadcast.emit("userList", userList);
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
            socket.on('_handleRooms', function (selectedRoom) { return _this._handleRooms(socket, selectedRoom); });
            // socket.on('chat', (msg: any) => this._handleChat(socket, msg));
        });
        var port = 3000;
        config.httpSrv.listen(port, function () {
            console.log("Serveur en \u00E9coute sur " + port + " ....");
        });
    }
    WSServer.prototype._handleRooms = function (socket, selectedRoom) {
        var _this = this;
        var room = this.rooms.get(selectedRoom);
        var user = this.onlineUsers.get(socket.id);
        if (room && user) {
            room.joinUser(user.id);
            socket.join(room.id);
            socket.emit('initUsers', room.joinedUsers.map(function (id) {
                var user = _this.onlineUsers.get(id);
                if (user) {
                    return { id: user.id, pseudo: user.pseudo, imgUrl: user.imgUrl };
                }
            }));
        }
    };
    WSServer.prototype._handleUsers = function (socket, pseudo) {
        var _this = this;
        var user = new User_1.User({ pseudo: pseudo, id: socket.id, collection: this.onlineUsers, imgUrl: 'default-image.jpg' });
        this.onlineUsers.add(user);
        this.room1.joinUser(user.id);
        socket.join(this.room1.id);
        this.server.to(this.room1.id).emit('logged', { user: { pseudo: pseudo }, timer: Date.now(), selectedRoom: this.room1.id });
        socket.emit('initRooms', this.rooms.all.map(function (id) {
            var room = _this.rooms.get(id);
            if (room) {
                return { id: room.id, title: room.title, urlImage: room.urlImage };
            }
        }));
        socket.emit('initUsers', this.room1.joinedUsers.map(function (id) {
            var user = _this.onlineUsers.get(id);
            console.log('user : ' + user);
            if (user) {
                return { id: user.id, pseudo: user.pseudo, imgUrl: user.imgUrl };
            }
        }));
    };
    return WSServer;
}());
exports.WSServer = WSServer;

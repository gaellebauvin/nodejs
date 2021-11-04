"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(config) {
        this.id = config.id;
        this.pseudo = config.pseudo;
        this.imgUrl = config.imgUrl;
        this.collection = config.collection;
        this.collection.add(this);
    }
    User.prototype.joinRoom = function (roomId) {
        var _a;
        if (((_a = this._rooms) === null || _a === void 0 ? void 0 : _a.indexOf(roomId)) === -1) {
            this._rooms.push(roomId);
        }
    };
    User.prototype.leaveRoom = function (roomId) {
        if (this._rooms) {
            if (roomId in this._rooms) {
                this._rooms.splice(this._rooms.indexOf(roomId));
            }
        }
    };
    return User;
}());
exports.User = User;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
var Room = /** @class */ (function () {
    function Room(config) {
        this.id = config.id;
        this.title = config.title;
        this.urlImage = config.urlImage || false;
        this.usersCollection = config.usersCollection;
        this.joinedUsers = [];
        this.adminId = config.adminId || false;
        this.public = !!config.adminId;
    }
    Room.prototype.joinUser = function (userId) {
        if (this.usersCollection.all.indexOf(userId) === -1 && this.joinedUsers.indexOf(userId) === -1) {
            this.joinedUsers.push(userId);
            return true;
        }
        return false;
    };
    Room.prototype.leaveUser = function (userId) {
        if (userId in this.joinedUsers) {
            this.joinedUsers.splice(this.joinedUsers.indexOf(userId));
        }
    };
    return Room;
}());
exports.Room = Room;

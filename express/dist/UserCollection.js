"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
var User_1 = require("./User");
var Users = /** @class */ (function () {
    function Users() {
        this._users = {};
        this._ids = [];
        this._nextId = 0;
        var user = new User_1.User({ id: "2", pseudo: "toto", collection: this });
        this.add(user);
    }
    Object.defineProperty(Users.prototype, "all", {
        get: function () { return this._ids; },
        set: function (_v) { },
        enumerable: false,
        configurable: true
    });
    Users.prototype.get = function (id) {
        if (id in this._users) {
            return this._users[id];
        }
        return false;
    };
    Users.prototype.add = function (user) {
        if (!(user.id in this._users)) {
            this._ids.push(user.id);
        }
    };
    Users.prototype.del = function (id) {
        this._ids = this._ids.filter(function (idCurrent) { return idCurrent != id; });
        if (id in this._users) {
            delete this._users[id];
        }
    };
    Users.prototype.next = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._nextId >= this._ids.length) {
            var ret = { value: this._users[this._ids[this._nextId]], done: false };
            this._nextId++;
            return ret;
        }
        this._nextId = 0;
        return { value: undefined, done: true };
    };
    return Users;
}());
exports.Users = Users;

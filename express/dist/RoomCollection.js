"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rooms = void 0;
var Rooms = /** @class */ (function () {
    function Rooms() {
        this._rooms = {};
        this._ids = [];
        this._nextId = 0;
    }
    Object.defineProperty(Rooms.prototype, "all", {
        get: function () { return this._ids; },
        set: function (_v) { },
        enumerable: false,
        configurable: true
    });
    Rooms.prototype.get = function (id) {
        if (id in this._rooms) {
            return this._rooms[id];
        }
        return false;
    };
    Rooms.prototype.add = function (room) {
        if (!(room.id in this._rooms)) {
            this._ids.push(room.id);
            this._rooms[room.id] = room;
        }
    };
    Rooms.prototype.del = function (id) {
        this._ids = this._ids.filter(function (idCurrent) { return idCurrent != id; });
        if (id in this._rooms) {
            delete this._rooms[id];
        }
    };
    Rooms.prototype.next = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._nextId >= this._ids.length) {
            var ret = { value: this._rooms[this._ids[this._nextId]], done: false };
            this._nextId++;
            return ret;
        }
        this._nextId = 0;
        return { value: undefined, done: true };
    };
    return Rooms;
}());
exports.Rooms = Rooms;

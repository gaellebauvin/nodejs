"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
var Message = /** @class */ (function () {
    function Message(msg, user, roomId) {
        this.msg = msg;
        this.timestamp = Date.now();
        this.userId = user.id;
        this.roomId = roomId;
    }
    return Message;
}());
exports.Message = Message;

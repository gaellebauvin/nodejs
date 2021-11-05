import { IUser } from "./User";

export interface IMsg {
    /**
     * Horodatage du moment ou le serveur reçoit le message
     */
    readonly timestamp?: number
    /**
     * Identifiant de l'utilisateur envoyant le message
     */
    readonly userId?: string
    /**
     * Identifiant du salon dans lequel le message est envoyé
     */
    readonly roomId?: string
    /**
     * Contenu du message
     */
    readonly msg: string
}

export class Message implements IMsg{
    timestamp?: number | undefined;
    userId?: string | undefined;
    roomId?: string | undefined;
    msg: string;

    constructor(msg:string,user:IUser,roomId:string){
        this.msg = msg;
        this.timestamp = Date.now();
        this.userId = user.id;
        this.roomId = roomId;
    }

}
import http from "http";
import {
    Server as SocketIOServer,
    Socket
} from "socket.io"

import {IUserCollection, Users} from "./UserCollection";
import {IUser, User} from "./User";
import {IRoomCollection, Rooms} from "./RoomCollection";


export interface IWSServerConfig {
    /**
     * Instance du Serveur HTTP renvoyé par http.createServer()
     *
     * @type {http.Server}
     * @memberof IWSServerConfig
     */
    httpSrv: http.Server
    /**
     * Eventuelle fonctione de log customisée.
     * Si aucune fonction n'est fournie, utiliser console.log
     *
     * @memberof IWSServerConfig
     */
    log?: (...args: Array<any>) => void
}


export interface IWSServer {
    /**
     * Instance du serveur renvoyé par Socket.IO
     *
     * @type {SocketIOServer}
     * @memberof IWSServer
     */
    readonly server: SocketIOServer
    /**
     * Liste des utilisateurs en ligne
     *
     * @type {IUserCollection}
     * @memberof IWSServer
     */
    readonly onlineUsers: IUserCollection
    /**
     * Liste des salons connus du serveur
     *
     * @type {IRoomCollection }
     * @memberof IWSServer
     */
    readonly rooms: IRoomCollection
}

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

export class WSServer implements IWSServer {
    server : SocketIOServer
    rooms : IRoomCollection
    onlineUsers : IUserCollection

    constructor(config:IWSServerConfig) {
        this.server = new SocketIOServer(config.httpSrv)
        this.onlineUsers = new Users()
        this.rooms = new Rooms()

        this.server.on("connection", (socket:Socket) => {
            console.log("Un utilisateur s'est connecté")

            const user = new User({
                id:socket.id,
                pseudo: "Toto",
                collection:this.onlineUsers,
            })

            this.onlineUsers.add(user);

            const userList = this.onlineUsers.all;
            console.log(userList);

            socket.emit("userList", userList);
            socket.broadcast.emit("userList", userList);

            socket.on("disconnect", (reason: string) => {
                console.log("utilisateur déconnecté")

                if (reason) {
                    console.log(`pour la raison suivante ${reason}`)
                }
                this.onlineUsers.del(socket.id)
                const userList = this.onlineUsers.all;
                socket.emit("userList", userList);
                socket.broadcast.emit("userList", userList);
                const userpseudo = this.onlineUsers.get(socket.id);
            })

            socket.on("chat", (reason : string) => {
                console.log("Utilisateur déconnecté")
                if(reason){
                    console.log(`pour la raison suivant"${(reason)}"`)
                }
            })
            socket.on("chat", (msg:string) => {
                console.log(`message du canal chat :"${msg}"`)
                socket.emit("chat", `${msg}`)
            })
        })

        const port: number = 3000
            config.httpSrv.listen(port, () => {
                console.log(`Serveur en écoute sur ${port} ....`)
            })
    }

}

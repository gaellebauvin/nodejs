import http from "http";
import {
    Server as SocketIOServer,
    Socket
} from "socket.io"

import {IUserCollection, Users} from "./UserCollection";
import {IUser, User} from "./User";
import {IRoomCollection, Rooms} from "./RoomCollection";
import {Room} from "./Room";
import {v4 as uuidv4} from "uuid";
import {Message} from "./Message";


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

export class WSServer implements IWSServer {
    server : SocketIOServer
    rooms : IRoomCollection
    onlineUsers : IUserCollection
    room1 : Room
    room2 : Room
    user : User
    user1 : User

    constructor(config:IWSServerConfig) {
        this.server = new SocketIOServer(config.httpSrv)
        this.onlineUsers = new Users()
        this.rooms = new Rooms()
        this.room1 = new Room({id: uuidv4(), title: 'Room1', usersCollection: this.onlineUsers})
        this.room2 = new Room({id: uuidv4(), title: 'Room2', usersCollection: this.onlineUsers})
        this.user = new User({id: uuidv4(), pseudo :'toto', collection: this.onlineUsers })
        this.user1 = new User({id: uuidv4(), pseudo :'titi', collection: this.onlineUsers })
        this.rooms.add(this.room1)

        this.server.on("connection", (socket: Socket) => {
            console.log("Un utilisateur s'est connecté");

            let users = this.onlineUsers.all;
            let room = this.rooms;

            this.onlineUsers.add(this.user);
            this.onlineUsers.add(this.user1);

            if (users && room) {
                const map =  this.onlineUsers.all.map(id => {
                    let user = this.onlineUsers.get(id);
                    if (user) {
                        return {id: id, pseudo: user.pseudo, urlImage: user.imgUrl}
                    }
                    return false
                }).filter((user) => {
                    return typeof user != "boolean"
                })

                socket.emit('logged', map)
                socket.emit('initRooms', this.rooms.all.map (id => {
                    let room = this.rooms.get(id);
                    if (room) {
                        return { id: room.id, title: room.title, urlImage: room.urlImage };
                    }
                }));
            }


            socket.on("disconnect", (reason: string) => {
                console.log("utilisateur déconnecté")

                if (reason) {
                    console.log(`pour la raison suivante ${reason}`)
                }
                this.onlineUsers.del(uuidv4())
                const userList = this.onlineUsers.all;
                socket.emit("userList", userList);
                socket.broadcast.emit("userList", userList);
            })

            socket.on("chat", (reason: string) => {
                console.log("Utilisateur déconnecté")
                if (reason) {
                    console.log(`pour la raison suivant"${(reason)}"`)
                }
            })


             socket.on("chat", (msg: string) => {
                 console.log(`message du canal chat :"${msg}"`)
                 socket.emit("chat", `${msg}`)
             })

            socket.on('_handleRooms', (selectedRoom: string) => this._handleRooms(socket, selectedRoom))

           // socket.on('chat', (msg: any) => this._handleChat(socket, msg));
        })
        const port: number = 3000
            config.httpSrv.listen(port, () => {
                console.log(`Serveur en écoute sur ${port} ....`)
            })
    }

    private _handleRooms(socket:Socket, selectedRoom:string):void {
        let room = this.rooms.get(selectedRoom);
        let user = this.onlineUsers.get(socket.id)

        if(room && user){
            room.joinUser(user.id);
            socket.join(room.id);
            socket.emit('initUsers', room.joinedUsers.map((id: string) => {
                let user = this.onlineUsers.get(id)
                if(user){
                    return {id:user.id, pseudo:user.pseudo, imgUrl: user.imgUrl}
                }
            }))
        }
    }

    private _handleUsers (socket: Socket, pseudo: string): void {
        let user = new User({ pseudo, id: socket.id, collection: this.onlineUsers, imgUrl: 'default-image.jpg' });
        this.onlineUsers.add(user);
        this.room1.joinUser(user.id);

        socket.join(this.room1.id);

        this.server.to(this.room1.id).emit('logged', { user: { pseudo }, timer: Date.now(),selectedRoom:this.room1.id });
        socket.emit('initRooms', this.rooms.all.map (id => {
            let room = this.rooms.get(id);
            if (room) {
                return { id: room.id, title: room.title, urlImage: room.urlImage };
            }
        }));
        socket.emit('initUsers', this.room1.joinedUsers.map(id => {
            let user = this.onlineUsers.get(id);
            console.log('user : '+ user)
            if (user) {
                return { id: user.id, pseudo: user.pseudo, imgUrl: user.imgUrl };
            }
        }));
    }

}

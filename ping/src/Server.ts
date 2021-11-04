import * as net from 'net'

export interface IServerConfig {
    /**
     * Numéro de port que le serveur doit écouter sur localhost
     *
     * @type {number}
     * @memberof IServerConfig
     */
    readonly listeningPort: number
    /**
     * Fonction à utiliser pour logger les évènements du serveur
     *
     * @memberof IServerConfig
     */
    readonly log?: (...args: Array<any>) => void
    /**
     * Fonction à utiliser pour logger les évènements d'erreur dans le serveur
     *
     * @memberof IServerConfig
     */
    readonly error?: (...args: Array<any>) => void
    /**
     * Fonction à fournir au serveur qui implémente le traitement à faire les messages réseaux reçus
     *
     * @memberof IServerConfig
     */
    readonly onData: (data: string) => void
}

export interface IServer {
    /**
     * Numéro de port sur lequel écoutera le serveur
     * Cette valeur est initialisée par le constructeur doit être en lecture seule au runtime
     *
     * @type {number}
     * @memberof IServer
     */
    readonly listeningPort: number
    /**
     * Fonction à utiliser pour logger les évènements du serveur
     * Cette valeur est initialisée par le constructeur doit être en lecture seule au runtime
     *
     * @type { Function }
     * @memberof IServer
     */
    readonly log: (...args: Array<any>) => void
    /**
     * Fonction à utiliser pour logger les évènements d'erreur du serveur
     * Cette valeur est initialisée par le constructeur doit être en lecture seule au runtime
     *
     * @type { Function }
     * @memberof IServer
     */
    readonly error: (...args: Array<any>) => void
    /**
     * Méthode d'écoute du serveur
     * Son appel provoque l'écoute sur le port fournit du serveur
     *
     * @memberof IServer
     */
    listen (): void
    /**
     * Arrête l'écoute du serveur.
     * Après cet appel, plus aucune connexion ne sera acceptée
     *
     * @memberof IServer
     */
    close (): void
    /**
     * Méthode implémentant le comportement du serveur lors de la réception d'un message sur le réseau
     * Cette valeur est initialisée par le constructeur doit être en lecture seule au runtime
     *
     * @type { Function }
     * @memberof IServer
     */
    readonly onData: (data: string) => void
}

export class Server implements IServer {
    readonly listeningPort : number
    server : net.Server

    constructor(config:IServerConfig) {
        this.listeningPort = config.listeningPort
        this.server = net.createServer();

        if (config.log) {
            this.log = config.log;
        }

        if (config.error) {
            this.error = config.error;
        }

        this.onData = config.onData;
        this.server.on('connection', (socket) => {
            this.log(`connection ${socket.remoteAddress}`);
            socket.on('data', (data) => {
                this.onData(socket, 'data');
            })

            socket.on('error', (err: any) => this.error(err))
        });
    };

    log(...args: any[]): void {
        console.log(args);
    };

    error(...args: any[]): void {
        console.error(args);
    };

    close(){
        this.server.close();
    }

    listen(){
        this.server.listen(this.listeningPort);
    }
}
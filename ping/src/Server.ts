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
    net : string[]

    constructor(net : string[]) {
        this.net = net
        net.createServer()
    };

    close(){
        console.log('Server closed !');
    }

    listeningPort : number = 8024

    listen(){
      if( this.listeningPort === 8024){
          console.log('server bound');
      }
    }
}
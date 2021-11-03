import express from "express"
import http from "http"
import fs from "fs"
import path from 'path'
import {
    Server,
    Socket
} from "socket.io";
import {publicDecrypt} from "crypto";

const webSrv = express()
const httpSrv = http.createServer(webSrv)
const wsSrv = new Server(httpSrv)


webSrv.get('/bonjour/:prenom', (req, res) => {
    const txt = `Bonjour ${req.params["prenom"]}`
    res.send(txt)
})

webSrv.get("/sources/:file", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", req.params["file"]))
})

wsSrv.on("connection", (socket:Socket) => {
    console.log("Un utilisateur s'est connecté")
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
httpSrv.listen(port, () => {
    console.log(`Serveur en écoute sur ${port} ....`)
})
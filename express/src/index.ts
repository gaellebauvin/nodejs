import http from "http"
import fs from "fs"
import path from 'path'
import {
    Server,
    Socket
} from "socket.io";
import express from "express"
import {
    IWSServer,
    WSServer
} from "./WSServeur";

const webSrv = express()
const httpSrv = http.createServer(webSrv)
const wsSrv : IWSServer = new WSServer({httpSrv})

webSrv.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'favicon.io'))
})

webSrv.get('/bonjour/:prenom', (req, res) => {
    const txt = `Bonjour ${req.params["prenom"]}`
    res.send(txt)
})

webSrv.get("/sources/:file", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", req.params["file"]))
})
import express from "express"

const srv = express()
const port = 3000

srv.get('/bonjour/:prenom', (req, res) => {
    const txt = `Bonjour ${req.params["prenom"]}`
    res.send(txt)
})

srv.listen(port)

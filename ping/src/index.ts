import process from "process";
import {
    IArgsParser,
    ArgsParser
} from "./ArgsParser";

const argsParser : IArgsParser = new ArgsParser(process.argv)

if(argsParser.isServer()){
    const port: number = argsParser.getListeningPort()
    console.log('J\'essaye d\'écouter 127.0.0.1:"${port}"')
} else {
    const addr:string | false = argsParser.getAddress()
    if(addr){
        console.log('Vous voulez pinger l\'adresse "${addr}"')
    } else {
        console.error("Merci de fournir une adresse IPv4 correcte à pinguer")
    }
}
const isServer = process.argv.indexOf('server') !== -1;


if (isServer) {

} else if(process.argv.length > 2) {
    const address = process.argv[2];
    console.log(address);
} else {
    console.error('ça ne fonctionne pas')
}
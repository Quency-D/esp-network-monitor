import { RemoteInfo } from 'dgram';
import * as vscode from 'vscode';
import { showMessageToTerminal } from './terminal';

const os = require('os');
function getIPV4Address():string |null{
	const interfaces = os.networkInterfaces();
	for (const devName in interfaces) {
		console.log(devName)
		const iface = interfaces[devName];
		console.log(iface)
		for (let i = 0; i < iface.length; i++) {
			let alias = iface[i];
			console.log(alias)
			if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
				return alias.address;
			}
		}
	}
	return null;
}

export class udpCommunication{

    constructor(

    ){
        const dgram = require("dgram");

        const server = dgram.createSocket("udp4");
        server.on("message", (msg:Buffer, rinfo:RemoteInfo) => {
            console.log("rinfo.address =  " + rinfo.address);
            console.log("rinfo.port =  " + rinfo.port);
            console.log(msg.toString());
            // setTimeout(() => {
            //     showMessageToTerminal(msg.toString());
            //   }, 1000);
              showMessageToTerminal(msg.toString());

        });
            
        server.on("listening", () => {
            console.log("address:" + server.address().address);
            console.log("port:" + server.address().port);
            showMessageToTerminal("address:" + server.address().address);
            showMessageToTerminal("port:" + server.address().port);

            setTimeout(() => {
                showMessageToTerminal("listening address:" + server.address().address+ '\r\n');
            }, 1000);
            setTimeout(() => {
                showMessageToTerminal("listening port:" + server.address().port+'\r\n');
            }, 1000);
        });

        server.on('error', (err:Error) => {
            console.log(`server error:\n${err.stack}`);
            server.close();
            });
        server.bind('0','192.168.2.184');
    }
}
import { RemoteInfo,Socket } from 'dgram';
import * as vscode from 'vscode';
import { showMessageToTerminal } from './terminal';
import type { ArduinoContext } from 'vscode-arduino-api';
import os from 'os';
import dgram from "dgram";

export class udpCommunication{
    private remoteAddress:string |undefined;
    private remotePort:string |undefined;
    private server:Socket;
    constructor(
        private readonly arduinoContext: ArduinoContext,
    ){
        this.remoteAddress = undefined;
        this.remotePort = undefined;
        this.server = dgram.createSocket("udp4");

        this.arduinoContext.onDidChange('port')((port) =>{
            // vscode.window.showInformationMessage(`port: ${port?.address} ${port?.hardwareId} ${port?.label} ${port?.properties} ${port?.protocol} ${port?.protocolLabel}`)
            this.remoteAddress = port?.address;
            for (const key in port?.properties) {
                if(key === 'udp_port')
                {
                    this.remotePort =port.properties[key];
                    // vscode.window.showInformationMessage(key +' '+ value);
                }
              }
              vscode.window.showInformationMessage( this.remotePort+'this.remoteAddress'+  this.remoteAddress);

            if(this.remoteAddress!==undefined) {
                this.closeUDPServer();
                this.createUDPServer();
            }
        });
        this.createUDPServer();
    }
    getIPV4Address(routeMatch:string):string |undefined{
        const interfaces = os.networkInterfaces();
        for (const devName in interfaces) {
            console.log(devName)
            const iface = interfaces[devName];
            console.log(iface)
            for (let i = 0; ((iface!==undefined) &&(i < iface.length)); i++) {
                let alias = iface[i];
                console.log(alias)
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    if(alias.address.indexOf(routeMatch.slice(0,9))!== -1)
                    {
                        vscode.window.showInformationMessage("IP:" +alias.address);
                        return alias.address;
                    }
                    vscode.window.showInformationMessage(routeMatch + ' '+alias.address.indexOf(routeMatch));
                }
            }
        }
        return undefined;
    }

    createUDPServer(): void {
        this.server = dgram.createSocket("udp4");
        vscode.window.showInformationMessage('createUDPServer');
        this.server.on("message", (msg:Buffer, rinfo:RemoteInfo) => {
            console.log("rinfo.address =  " + rinfo.address);
            console.log("rinfo.port =  " + rinfo.port);
            console.log(msg.toString());
            // setTimeout(() => {
            //     showMessageToTerminal(msg.toString());
            //   }, 1000);
              showMessageToTerminal(msg.toString());
        });
            
        this.server.on("listening", () => {
            console.log("address:" + this.server.address().address);
            console.log("port:" + this.server.address().port);
            vscode.window.showInformationMessage("address:" + this.server.address().address);
            vscode.window.showInformationMessage("port:" + this.server.address().port);
            setTimeout(() => {
                showMessageToTerminal("listening address:" + this.server.address().address+ '\r\n');
            }, 1000);
            setTimeout(() => {
                showMessageToTerminal("listening port:" + this.server.address().port+'\r\n');
            }, 1000);
        });

        this.server.on('error', (err:Error) => {
            vscode.window.showErrorMessage(`server error:\n${err.stack}`);
            this.server.close();
        });
        // this.server.bind(0);

        if(this.remoteAddress !==undefined){
            this.server.bind(0,this.getIPV4Address(this.remoteAddress));
        }
        else {
            this.server.bind(0);
        }
    }


      // 关闭UDP服务器
    closeUDPServer(): void {
        if (this.server) {
            vscode.window.showInformationMessage('UDP Server closed');
            this.server?.close(() => {
                vscode.window.showInformationMessage('UDP Server close212d');
            });
        }
    } 
  
}
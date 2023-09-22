import * as vscode from 'vscode';
import type { ArduinoContext } from 'vscode-arduino-api';

export class arduinoInfo{

    constructor(){
        const arduinoContext: ArduinoContext = vscode.extensions.getExtension(
            'dankeboy36.vscode-arduino-api'
          )?.exports;
          if (!arduinoContext) {
            // Failed to load the Arduino API.
            return;
          }
          vscode.window.showInformationMessage(
            `Sketch path: ${arduinoContext.sketchPath}`
          );
        arduinoContext.onDidChange('fqbn')((fqbn) =>
          vscode.window.showInformationMessage(`FQBN: ${fqbn}`)
        )
        arduinoContext.onDidChange('port')((port) =>
        {
            vscode.window.showInformationMessage(`port: ${port?.address} ${port?.hardwareId} ${port?.label} ${port?.properties} ${port?.protocol} ${port?.protocolLabel}`)

            for (const key in port?.properties) {
                const value = port.properties[key] ;
                vscode.window.showInformationMessage(key +' '+ value);
              }
        }
      )
    }
}
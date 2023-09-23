import vscode from 'vscode';
import type { ArduinoContext } from 'vscode-arduino-api';
import { opeTerminal } from './terminal';
import { udpCommunication } from './udp-server';
export function activate(context: vscode.ExtensionContext): void {
  findArduinoContext().then((arduinoContext) => {
    if (!arduinoContext) {
      vscode.window.showErrorMessage(
        `Could not find th '${vscodeArduinoAPI}' extension must be installed.`
      );
      return;
    }
    vscode.window.showErrorMessage(
      `Quency-d 1.1.3 `
    );
	context.subscriptions.push(
		vscode.commands.registerCommand('espNetworkMonitor.showTerminal', () =>
			opeTerminal(), new udpCommunication(arduinoContext),
		  )
		);
	// new arduinoInfo();
	});
}

async function findArduinoContext(): Promise<ArduinoContext | undefined> {
  const apiExtension = findArduinoApiExtension();
  if (apiExtension && !apiExtension.isActive) {
    await apiExtension.activate();
  }
  return apiExtension?.exports;
}

const vscodeArduinoAPI = 'dankeboy36.vscode-arduino-api';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findArduinoApiExtension(): vscode.Extension<any> | undefined {
  return vscode.extensions.getExtension(vscodeArduinoAPI);
}

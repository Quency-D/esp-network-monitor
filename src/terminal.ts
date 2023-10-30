import { stringify } from 'querystring';
import * as vscode from 'vscode';
import type { ArduinoContext } from 'vscode-arduino-api';
import diagnostics_channel from 'node:diagnostics_channel';

export const channel = diagnostics_channel.channel('udp-sendmessage');
const networkMonitorTerminalTitle = 'ESP Network Monitor';
const networkMonitorTerminalName = 'Network Monitor';
export const Sleep = (ms:number)=> {
  return new Promise(resolve=>setTimeout(resolve, ms))
}

class NetworkMonitorTerminal implements vscode.Pseudoterminal {
    readonly onDidWrite: vscode.Event<string>;
    readonly onDidClose: vscode.Event<number | void>;
  
    private readonly onDidWriteEmitter: vscode.EventEmitter<string>;
    private readonly onDidCloseEmitter: vscode.EventEmitter<number | void>;
    private readonly toDispose: vscode.Disposable[];
  
    private abortController: AbortController | undefined;
    inputStr:string;
    constructor(

    ) {
      this.onDidWriteEmitter = new vscode.EventEmitter<string>();
      this.onDidCloseEmitter = new vscode.EventEmitter<number | void>();
      this.toDispose = [
        this.onDidWriteEmitter,
        this.onDidCloseEmitter,
        new vscode.Disposable(() => this.abortController?.abort()),
      ];
      this.onDidWrite = this.onDidWriteEmitter.event;
      this.onDidClose = this.onDidCloseEmitter.event;
      this.inputStr = '';
    }
  
    open(): void {
      this.updateParams();
    }
  
    close(): void {
      vscode.Disposable.from(...this.toDispose).dispose();
    }
  
    handleInput(data: string): void {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
      const formattedTime = `${hours}:${minutes}:${seconds}.${milliseconds}`;
      if(data.startsWith('log')=== false) {
        if(data.endsWith('\r')) {
          channel.publish({
            message: this.inputStr,
          });
          this.onDidWriteEmitter.fire('\r\n'+formattedTime+': '+this.inputStr);
          this.inputStr = ''
          return;
        }
        else
        {
          this.inputStr += data;
        }
      }
      else
      {
        data = data.slice(3);
      }

      // 格式化时间为 "15:22:25.303" 格式
      this.onDidWriteEmitter.fire('\r\n'+formattedTime+': '+data);
    }

    private async updateParams(): Promise<void> {
        // let params: DecodeTerminalState['params'];
        // try {
        //   params = await createDecodeParams(this.arduinoContext);
        // } catch (err) {
        //   params = err instanceof Error ? err : new Error(String(err));
        // }
        // this.updateState({ params });
      }
  }



  
export function opeTerminal(

): vscode.Terminal {
const terminal = findDecodeTerminal() ?? createDecodeTerminal();
    terminal.show();
return terminal;
}

function findDecodeTerminal(): vscode.Terminal | undefined {
    return vscode.window.terminals.find(
      (terminal) =>
        terminal.name === networkMonitorTerminalName && terminal.exitStatus === undefined
    );
  }

  const pty = new NetworkMonitorTerminal();

  function createDecodeTerminal(
  ): vscode.Terminal {
    const options: vscode.ExtensionTerminalOptions = {
      name: networkMonitorTerminalName,
      pty,
      iconPath: new vscode.ThemeIcon('debug-console'),
    };
    return vscode.window.createTerminal(options);
  }

export function showMessageToTerminal(str:string){
  pty.handleInput('log'+str);
}

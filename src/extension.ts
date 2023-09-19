import { stringify } from 'querystring';
import * as vscode from 'vscode';

class  pseudoterminalTest implements vscode.Pseudoterminal{
	readonly onDidWrite: vscode.Event<string>;
	readonly onDidClose: vscode.Event<number | void>;
  
	private readonly onDidWriteEmitter: vscode.EventEmitter<string>;
	private readonly onDidCloseEmitter: vscode.EventEmitter<number | void>;
	private readonly toDispose: vscode.Disposable[];
  
	constructor(){
		this.onDidWriteEmitter = new vscode.EventEmitter<string>();
		this.onDidCloseEmitter = new vscode.EventEmitter<number | void>();
		this.toDispose = [
			this.onDidWriteEmitter,
			this.onDidCloseEmitter,
		  ];
		  this.onDidWrite = this.onDidWriteEmitter.event;
		  this.onDidClose = this.onDidCloseEmitter.event;
	}
	open(): void{
		this.onDidWriteEmitter.fire("open");
	}
	close(): void{
		
	}
	
	handleInput(data: string): void {
		this.onDidWriteEmitter.fire(data);
	}
}

const pty = new pseudoterminalTest();
const debug = createDebugOutput();


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log(' your extension "helloworld" is now active!');

	let disposable = vscode.commands.registerCommand('helloworld.helloworld', () => {
		const options: vscode.ExtensionTerminalOptions = {
				name: 'hello_terminal',
				pty,
				iconPath: new vscode.ThemeIcon('debug-console'),
			};
		let terminal: vscode.Terminal;
		terminal=vscode.window.createTerminal(options);
		terminal.show(true);
		terminal.sendText('\x1b[31mHello world\x1b[0m',true);
		debug("21121212");
		vscode.window.showInformationMessage("12121212121212");
	});
	context.subscriptions.push(disposable);
}
export interface Debug {
	(message: string): void;
  }

let _debugOutput: vscode.OutputChannel | undefined;
function debugOutput(): vscode.OutputChannel {
  if (!_debugOutput) {
    _debugOutput = vscode.window.createOutputChannel(
      `OUTPUT`,
	  {log:true}
    );
  }
  return _debugOutput;
}
function createDebugOutput(): Debug {
  return (message) => debugOutput().appendLine(message);
}
import * as vscode from "vscode";

export class VariableCompletionItem extends vscode.CompletionItem {
    constructor(name: string, desc?: string) {
        super(name, vscode.CompletionItemKind.Variable);
        
        this.insertText = `${name})`;
        this.detail = desc;
    }
}

export class ParentVariableCompletionItem extends vscode.CompletionItem {
    constructor(name: string) {
        super(name, vscode.CompletionItemKind.Constant);
        
        this.insertText = `(${name}`;
        // this.detail = desc;
    }
}
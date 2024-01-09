import * as vscode from "vscode";

export class VariableCompletionItem extends vscode.CompletionItem {
  constructor(name: string, desc?: string) {
    super(name, vscode.CompletionItemKind.Variable);

    this.insertText = `(${name})`;
    this.detail = desc;
  }
}

export class ChildVariableCompletionItem extends vscode.CompletionItem {
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
  }
}

export class ParameterCompletionItem extends vscode.CompletionItem {
  constructor(name: string, desc?: string) {
    super(name, vscode.CompletionItemKind.TypeParameter);

    this.insertText = `{{ parameters.${name} }}`;
    this.detail = desc;
  }
}

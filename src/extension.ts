// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import variables from "./completion/variables.json";
import { provideFromADO, provideItems, provideParents } from './completion/provide';

const LANGUAGE = "azure-pipelines";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const parentProvider = vscode.languages.registerCompletionItemProvider(LANGUAGE, {
		provideCompletionItems(document, position, token, context) {
			return provideParents(variables);
		},
	}, "$");

	const childProvider = vscode.languages.registerCompletionItemProvider(LANGUAGE, {
		provideCompletionItems(document, position, token, context) {
			return provideItems(variables, position, context, document);
		},
	}, ".");

	context.subscriptions.push(parentProvider, childProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}

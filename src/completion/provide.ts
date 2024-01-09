import * as vscode from "vscode";
import { ParentVariableCompletionItem, VariableCompletionItem } from "./VariableCompletionItem";
import { getAzureAccountExtensionApi } from "../extensions/ado";

export type VariableDefinition = {
    name: string
    desc: string
};

export type VariableHolder = Record<string, VariableDefinition[]>

export const provideParents = (items: VariableHolder): vscode.CompletionItem[] => Object.keys(items).map(x => new ParentVariableCompletionItem(x));

export const provideItems = (items: VariableHolder, position: vscode.Position, context: vscode.CompletionContext, document: vscode.TextDocument): vscode.CompletionItem[] => {
    const lineContent = document.lineAt(position.line);
    const lineSubStr = lineContent.text.substring(lineContent.firstNonWhitespaceCharacterIndex, position.character - 1);

    const regex = /\$\((\w+)/gm;
    for(const match of lineSubStr.matchAll(regex)){
        const group = match[1];
        const result = match[0];
        const index = match.index || 0;

        const pos = index + result.length + 1;

        if(pos === position.character) {
            console.log(items[group].length)
            return items[group] ? items[group].map(x => new VariableCompletionItem(x.name, x.desc)) : [];
        }
    }

    return [];
};

export const provideFromADO = async (): Promise<vscode.CompletionItem[]> => {
    const ext = await getAzureAccountExtensionApi();
    if (!(await ext.waitForLogin())) {

        const signIn = await vscode.window.showInformationMessage("Login required", "Sign In");
        if (signIn?.toLowerCase() === "Sign In".toLowerCase()) {
            await vscode.commands.executeCommand("azure-account.login");
        } else {
            void vscode.window.showWarningMessage("You really need to tho");
            return []
        }
    }

    return []
}
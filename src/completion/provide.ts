import * as vscode from "vscode";
import {
  ChildVariableCompletionItem,
  ParameterCompletionItem,
  ParentVariableCompletionItem,
  VariableCompletionItem,
} from "./completionItems";
import { parse } from "yaml";

export type VariableDefinition = {
  name: string;
  desc: string;
};

export type VariableHolder = Record<string, VariableDefinition[]>;

export const provideParents = (
  items: VariableHolder
): vscode.CompletionItem[] =>
  Object.keys(items).map((x) => new ParentVariableCompletionItem(x));

export const provideItems = (
  items: VariableHolder,
  position: vscode.Position,
  context: vscode.CompletionContext,
  document: vscode.TextDocument
): vscode.CompletionItem[] => {
  const lineContent = document.lineAt(position.line);
  const lineSubStr = lineContent.text.substring(
    lineContent.firstNonWhitespaceCharacterIndex,
    position.character - 1
  );

  const regex = /\$\((\w+)/gm;
  for (const match of lineSubStr.matchAll(regex)) {
    const group = match[1];
    const result = match[0];
    const index = match.index || 0;

    const pos = index + result.length + 1;

    if (pos === position.character) {
      return items[group]
        ? items[group].map(
            (x) => new ChildVariableCompletionItem(x.name, x.desc)
          )
        : [];
    }
  }

  return [];
};

//#region In file variables

type Variable = {
  name: string;
  value: string | number | boolean;
};

type Parameter = {
  name: string;
  type?: "string" | "boolean" | "number";
  default?: any;
  displayName?: string;
};

export const provideInlineVariablesAndParameters = (
  doc: vscode.TextDocument
): vscode.CompletionItem[] => {
  const content = parse(doc.getText());

  const result: vscode.CompletionItem[] = [];
  if (content.variables && Array.isArray(content.variables)) {
    result.push(
      ...(content.variables as Variable[]).map(
        (x) => new VariableCompletionItem(x.name, x.value.toString())
      )
    );
  }

  if (content.parameters && Array.isArray(content.parameters)) {
    result.push(
      ...(content.parameters as Parameter[]).map(
        (x) => new ParameterCompletionItem(x.name, x.type)
      )
    );
  }

  return result;
};

//#endregion

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import variables from "./completion/variables.json";
import {
  provideInlineVariablesAndParameters,
  provideItems,
  provideParents,
} from "./completion/provide";
import {
  SemanticTokenProvider,
  semanticTokenLegend,
} from "./semantics/tokens-provider";

const LANGUAGE = "yaml";
const VARIABLE_INIT = "$";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log("initialised");

  const parentProvider = vscode.languages.registerCompletionItemProvider(
    LANGUAGE,
    {
      provideCompletionItems(document, position, token, context) {
        if (!context.triggerCharacter) {
          return [];
        }
        return provideParents(variables);
      },
    },
    VARIABLE_INIT
  );

  const childProvider = vscode.languages.registerCompletionItemProvider(
    LANGUAGE,
    {
      provideCompletionItems(document, position, token, context) {
        if (!context.triggerCharacter) {
          return [];
        }
        return provideItems(variables, position, context, document);
      },
    },
    "."
  );

  const customProvider = vscode.languages.registerCompletionItemProvider(
    LANGUAGE,
    {
      provideCompletionItems(document, position, token, context) {
        if (!context.triggerCharacter) {
          return [];
        }
        return provideInlineVariablesAndParameters(document);
      },
    },
    VARIABLE_INIT
  );

  const semanticProvider =
    vscode.languages.registerDocumentSemanticTokensProvider(
      { language: LANGUAGE, scheme: "file" },
      new SemanticTokenProvider(),
      semanticTokenLegend
    );

  context.subscriptions.push(
    parentProvider,
    childProvider,
    customProvider,
    semanticProvider
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

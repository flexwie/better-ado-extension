import * as vscode from "vscode";

export const semanticTokenLegend = new vscode.SemanticTokensLegend(
  ["variable", "property", "class"],
  []
);

export class SemanticTokenProvider
  implements vscode.DocumentSemanticTokensProvider
{
  provideDocumentSemanticTokens(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.SemanticTokens> {
    const builder = new vscode.SemanticTokensBuilder(semanticTokenLegend);

    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      const regexVariable = /\$\(([\w.]+)\)/gm;
      for (var match of line.text.matchAll(regexVariable)) {
        const lineIndex = i;
        const charIndex = match.index || 0;
        const tokenLength = match[0].length;

        if (match[1].split(".").length > 1) {
          const result = match[1].split(".");

          const propTokenType =
            semanticTokenLegend.tokenTypes.indexOf("property");
          const classTokenType =
            semanticTokenLegend.tokenTypes.indexOf("class");

          builder.push(
            lineIndex,
            charIndex + 2,
            result[0].length,
            classTokenType
          );
          builder.push(
            lineIndex,
            charIndex + 2 + result[0].length + 1,
            result[1].length,
            propTokenType
          );
        } else {
          const tokenType = semanticTokenLegend.tokenTypes.indexOf("variable");
          builder.push(lineIndex, charIndex + 2, tokenLength - 3, tokenType);
        }
      }

      const regexParameter = /\${{\s*([\w.]+)\s*}}/gm;
      for (var match of line.text.matchAll(regexParameter)) {
        const tokenType = semanticTokenLegend.tokenTypes.indexOf("variable");
        const lineIndex = i;
        const charIndex = match.index || 0;
        const tokenLength = match[1].length;
        builder.push(lineIndex, charIndex + 4, tokenLength, tokenType);
      }
    }

    return builder.build();
  }
}

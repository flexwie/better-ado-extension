import * as vscode from "vscode"
import { AzureAccount } from "./AzureAccount";

let azureAccountExtensionApi: AzureAccount | undefined;
export async function getAzureAccountExtensionApi(): Promise<AzureAccount> {
    if (azureAccountExtensionApi === undefined) {
        const azureAccountExtension = vscode.extensions.getExtension<AzureAccount>("ms-vscode.azure-account");
        if (!azureAccountExtension) {
            throw new Error("Azure extension not available");
        }

        if (!azureAccountExtension.isActive) {
            await azureAccountExtension.activate();
        }

        azureAccountExtensionApi = azureAccountExtension.exports;
    }

    return azureAccountExtensionApi;
}
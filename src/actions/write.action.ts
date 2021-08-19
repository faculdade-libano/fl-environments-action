/*
 * Copyright 2021 Envio Simples
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { seal } from "tweetsodium";
import { getInput } from "@actions/core";
import { getOctokit } from "@actions/github";

import Action from "../models/action.model";
import FileTree from "../utils/file-tree.util";
import { config } from "../configs/default.config";

export default class Write implements Action {

    /**
     * This method performs the action
     * @returns Promise
     */

    public async run(): Promise<void> {
        const glob: string = getInput("glob");
        const token: string = getInput("token");
        const organization: string = getInput("org");
        const visibility: string = getInput("visibility");
        const environment: string = getInput("environment");

        if(visibility !== "all" && visibility !== "private") {
            throw new Error("The visibility value is invalid.");
        }

        const octokit = getOctokit(token);

        const keyResponse = await octokit.rest.actions.getOrgPublicKey({
            org: organization
        });

        const publicKey = keyResponse.data.key;
        const publicKeyID = keyResponse.data.key_id;

        const secretName = `${config.secret_name}_${environment}`.toUpperCase();

        const compressedTree = FileTree.compressFrom(glob);
        const buffer = Buffer.from(compressedTree);
        const encryptedTree = this.encrypt(buffer, publicKey);

        await octokit.rest.actions.createOrUpdateOrgSecret({
            org: organization,
            secret_name: secretName,
            encrypted_value: encryptedTree,
            key_id: publicKeyID,
            visibility: visibility
        });
    }
    
    /**
     * This method encrypts a data with a key
     * @param  {Buffer} data
     * @param  {string} key
     * @returns string
     */

    private encrypt(data: Buffer, key: string): string {
        const keyBytes = Buffer.from(key, "base64");
        const encryptedBytes = seal(data, keyBytes);
        const buffer = Buffer.from(encryptedBytes);
        return buffer.toString("base64");     
    }
}
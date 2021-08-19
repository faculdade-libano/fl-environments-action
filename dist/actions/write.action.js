"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tweetsodium_1 = require("tweetsodium");
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const file_tree_util_1 = __importDefault(require("../utils/file-tree.util"));
const default_config_1 = require("../configs/default.config");
class Write {
    /**
     * This method performs the action
     * @returns Promise
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const glob = core_1.getInput("glob");
            const token = core_1.getInput("token");
            const organization = core_1.getInput("org");
            const visibility = core_1.getInput("visibility");
            const environment = core_1.getInput("environment");
            if (visibility !== "all" && visibility !== "private") {
                throw new Error("The visibility value is invalid.");
            }
            const octokit = github_1.getOctokit(token);
            const keyResponse = yield octokit.rest.actions.getOrgPublicKey({
                org: organization
            });
            const publicKey = keyResponse.data.key;
            const publicKeyID = keyResponse.data.key_id;
            const secretName = `${default_config_1.config.secret_name}_${environment}`.toUpperCase();
            const compressedTree = file_tree_util_1.default.compressFrom(glob);
            const buffer = Buffer.from(compressedTree);
            const encryptedTree = this.encrypt(buffer, publicKey);
            yield octokit.rest.actions.createOrUpdateOrgSecret({
                org: organization,
                secret_name: secretName,
                encrypted_value: encryptedTree,
                key_id: publicKeyID,
                visibility: visibility
            });
        });
    }
    /**
     * This method encrypts a data with a key
     * @param  {Buffer} data
     * @param  {string} key
     * @returns string
     */
    encrypt(data, key) {
        const keyBytes = Buffer.from(key, "base64");
        const encryptedBytes = tweetsodium_1.seal(data, keyBytes);
        const buffer = Buffer.from(encryptedBytes);
        return buffer.toString("base64");
    }
}
exports.default = Write;

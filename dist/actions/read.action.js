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
const io_1 = require("@actions/io");
const fs_extra_1 = require("fs-extra");
const core_1 = require("@actions/core");
const file_tree_util_1 = __importDefault(require("../utils/file-tree.util"));
const path_1 = require("path");
class Read {
    /**
     * This method performs the action
     * @returns Promise
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const base = core_1.getInput("base");
            const chunk = core_1.getInput("chunk");
            const fileTree = file_tree_util_1.default.decompressFrom(chunk);
            if (!(base in fileTree)) {
                throw new Error("Environment is not contained in the chunk.");
            }
            const baseNode = fileTree[base];
            const unhandled = new Array();
            unhandled.push(baseNode);
            while (unhandled.length != 0) {
                const current = unhandled.shift();
                for (const key in current) {
                    const item = current[key];
                    if ("content" in item) {
                        this.writeFile(item, base);
                        continue;
                    }
                    unhandled.push(item);
                }
            }
        });
    }
    /**
     * This method write a file in workflow.
     * @param  {File} file
     * @param  {string} baseName
     * @returns void
     */
    writeFile(file, baseName) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = file.path.replace(baseName, "").replace(/^\/|\/$/g, "");
            const fullPath = !path ? file.name : `${path}/${file.name}`;
            const targetDir = path_1.dirname(fullPath);
            yield io_1.mkdirP(targetDir);
            fs_extra_1.writeFileSync(fullPath, file.content);
            core_1.setSecret(file.content);
        });
    }
}
exports.default = Read;

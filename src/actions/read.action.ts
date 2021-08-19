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

import { mkdirP } from "@actions/io";
import { writeFileSync } from "fs-extra";
import { getInput, setSecret } from "@actions/core";

import File from "../models/file.model";
import Action from "../models/action.model";
import FileTree from "../utils/file-tree.util";
import { dirname } from "path";

export default class Read implements Action {
  /**
   * This method performs the action
   * @returns Promise
   */

  public async run(): Promise<void> {
    const base: string = getInput("base");
    const chunk: string = getInput("chunk");

    const fileTree = FileTree.decompressFrom(chunk);

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
  }

  /**
   * This method write a file in workflow.
   * @param  {File} file
   * @param  {string} baseName
   * @returns void
   */

  private async writeFile(file: File, baseName: string): Promise<void> {
    const path = file.path.replace(baseName, "").replace(/^\/|\/$/g, "");

    const fullPath = !path ? file.name : `${path}/${file.name}`;

    const targetDir = dirname(fullPath);
    await mkdirP(targetDir);

    writeFileSync(fullPath, file.content);
    setSecret(file.content);
  }
}

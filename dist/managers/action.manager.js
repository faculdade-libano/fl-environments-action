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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const read_action_1 = __importDefault(require("../actions/read.action"));
const write_action_1 = __importDefault(require("../actions/write.action"));
class ActionManager {
    constructor() {
        this.actions = new Map();
        this.registerActions();
    }
    /**
     * Checks if an action exists
     * @param  {string} key
     * @returns boolean
     */
    isRegistered(key) {
        return this.actions.has(key);
    }
    /**
     * Registers an action
     * @param  {string} key
     * @param  {Action} action
     */
    registerAction(key, action) {
        this.actions.set(key, action);
    }
    /**
     * Runs an action
     * @param  {string} key
     * @returns void
     */
    runAction(key) {
        if (!this.isRegistered(key)) {
            throw new Error("The action is not registered.");
        }
        const action = this.actions.get(key);
        action === null || action === void 0 ? void 0 : action.run();
    }
    /**
     * Registers a set of actions by default
     * @returns void
     */
    registerActions() {
        this.registerAction("read", new read_action_1.default());
        this.registerAction("write", new write_action_1.default());
    }
}
exports.default = ActionManager;

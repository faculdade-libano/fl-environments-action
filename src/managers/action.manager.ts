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

import Action from "../models/action.model";
import Read from "../actions/read.action";
import Write from "../actions/write.action";

export default class ActionManager {
    private actions: Map<String, Action>

    public constructor() {
        this.actions = new Map();
        this.registerActions();
    }
    
    /**
     * Checks if an action exists
     * @param  {string} key
     * @returns boolean
     */

    public isRegistered(key: string): boolean {
        return this.actions.has(key);
    }
    
    /**
     * Registers an action
     * @param  {string} key
     * @param  {Action} action
     */

    private registerAction(key: string, action: Action): void {
        this.actions.set(key, action);
    }

    /**
     * Runs an action
     * @param  {string} key
     * @returns void
     */

    public runAction(key: string): void {
        if(!this.isRegistered(key)) {
            throw new Error("The action is not registered.");
        }

        const action = this.actions.get(key);
        action?.run();
    }

    /**
     * Registers a set of actions by default
     * @returns void
     */

    private registerActions(): void {
        this.registerAction("read", new Read());
        this.registerAction("write", new Write());
    }
}
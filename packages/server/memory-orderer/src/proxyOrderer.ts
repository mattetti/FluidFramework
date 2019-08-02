/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IClient } from "@prague/protocol-definitions";
import { IOrderer, IOrdererConnection, IWebSocket } from "@prague/services-core";

export interface IOrdererConnectionFactory {
    connect(socket: IWebSocket, client: IClient): Promise<IOrdererConnection>;
}

/**
 * Proxies ordering to an external service which does the actual ordering
 */
export class ProxyOrderer implements IOrderer {
    constructor(private factory: IOrdererConnectionFactory) {
    }

    public async connect(
        socket: IWebSocket,
        clientId: string,
        client: IClient): Promise<IOrdererConnection> {

        const proxiedSocket = await this.factory.connect(socket, client);
        return proxiedSocket;
    }

    public close() {
        return Promise.resolve();
    }
}

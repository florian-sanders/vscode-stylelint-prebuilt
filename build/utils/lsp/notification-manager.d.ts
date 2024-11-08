import * as LSP from 'vscode-languageserver-protocol';
import { Connection, Disposable } from 'vscode-languageserver';
import type winston from 'winston';
import { MaybeAsync } from '../types';
/**
 * Allows registering multiple handlers for the same notification type.
 */
export declare class NotificationManager implements Disposable {
    #private;
    /**
     * Instantiates a new notification manager.
     */
    constructor(connection: Connection, logger?: winston.Logger);
    dispose(): void;
    /**
     * Registers a handler for a notification.
     */
    on<R0>(type: LSP.ProtocolNotificationType0<R0>, handler: MaybeAsync<LSP.NotificationHandler0>): Disposable;
    on<P, R0>(type: LSP.ProtocolNotificationType<P, R0>, handler: MaybeAsync<LSP.NotificationHandler<P>>): Disposable;
    on(type: LSP.NotificationType0, handler: MaybeAsync<LSP.NotificationHandler0>): Disposable;
    on<P>(type: LSP.NotificationType<P>, handler: MaybeAsync<LSP.NotificationHandler<P>>): Disposable;
    on(type: string, handler: MaybeAsync<LSP.GenericNotificationHandler>): Disposable;
    on(handler: LSP.StarNotificationHandler): Disposable;
}

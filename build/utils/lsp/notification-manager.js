"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _NotificationManager_instances, _NotificationManager_connection, _NotificationManager_logger, _NotificationManager_notifications, _NotificationManager_handleNotification;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationManager = void 0;
/**
 * Allows registering multiple handlers for the same notification type.
 */
class NotificationManager {
    /**
     * Instantiates a new notification manager.
     */
    constructor(connection, logger) {
        _NotificationManager_instances.add(this);
        /**
         * The connection to the server.
         */
        _NotificationManager_connection.set(this, void 0);
        /**
         * The logger to use.
         */
        _NotificationManager_logger.set(this, void 0);
        /**
         * The registered notification handlers.
         */
        _NotificationManager_notifications.set(this, new Map());
        __classPrivateFieldSet(this, _NotificationManager_connection, connection, "f");
        __classPrivateFieldSet(this, _NotificationManager_logger, logger, "f");
    }
    dispose() {
        __classPrivateFieldGet(this, _NotificationManager_logger, "f")?.debug('Disposing notification manager');
        for (const [type] of __classPrivateFieldGet(this, _NotificationManager_notifications, "f")) {
            if (type) {
                __classPrivateFieldGet(this, _NotificationManager_connection, "f").onNotification(type, () => undefined);
            }
            else {
                __classPrivateFieldGet(this, _NotificationManager_connection, "f").onNotification(() => undefined);
            }
        }
        __classPrivateFieldGet(this, _NotificationManager_notifications, "f").clear();
    }
    on(type, handler) {
        const isStar = typeof type === 'function';
        const [key, func] = isStar ? [undefined, type] : [type, handler];
        if (!func) {
            throw new Error('Handler must be defined');
        }
        const disposable = {
            dispose: () => {
                __classPrivateFieldGet(this, _NotificationManager_notifications, "f").get(key)?.delete(func);
            },
        };
        const existing = __classPrivateFieldGet(this, _NotificationManager_notifications, "f").get(key);
        if (existing) {
            existing.add(func);
            return disposable;
        }
        __classPrivateFieldGet(this, _NotificationManager_notifications, "f").set(key, new Set([func]));
        if (isStar) {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            __classPrivateFieldGet(this, _NotificationManager_connection, "f").onNotification((...params) => __classPrivateFieldGet(this, _NotificationManager_instances, "m", _NotificationManager_handleNotification).call(this, undefined, params));
            return disposable;
        }
        __classPrivateFieldGet(this, _NotificationManager_connection, "f").onNotification(type, 
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        (...params) => __classPrivateFieldGet(this, _NotificationManager_instances, "m", _NotificationManager_handleNotification).call(this, type, params));
        return disposable;
    }
}
exports.NotificationManager = NotificationManager;
_NotificationManager_connection = new WeakMap(), _NotificationManager_logger = new WeakMap(), _NotificationManager_notifications = new WeakMap(), _NotificationManager_instances = new WeakSet(), _NotificationManager_handleNotification = async function _NotificationManager_handleNotification(key, params) {
    __classPrivateFieldGet(this, _NotificationManager_logger, "f")?.debug('Received notification', { notificationType: key ?? '<all>', params });
    // This function is only ever called if the handler is registered.
    const handlers = __classPrivateFieldGet(this, _NotificationManager_notifications, "f").get(key);
    const funcs = [];
    for (const handler of handlers) {
        funcs.push(async () => {
            try {
                await handler(...params);
            }
            catch (error) {
                __classPrivateFieldGet(this, _NotificationManager_logger, "f")?.error('Error handling notification', {
                    notificationType: key ?? '<all>',
                    error,
                });
            }
        });
    }
    await Promise.all(funcs.map((func) => func()));
};
//# sourceMappingURL=notification-manager.js.map
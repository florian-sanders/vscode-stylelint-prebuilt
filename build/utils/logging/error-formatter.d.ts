import type winston from 'winston';
/**
 * Language server formatter for winston.
 */
export declare class ErrorFormatter {
    transform(info: winston.Logform.TransformableInfo): winston.Logform.TransformableInfo;
}

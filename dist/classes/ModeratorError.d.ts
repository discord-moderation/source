import { ERROR_MESSAGES } from "../constants";
export declare class ModeratorError extends Error {
    errorCode: string;
    constructor(code: keyof typeof ERROR_MESSAGES, ...args: any);
    get name(): string;
    get code(): string;
}
export default ModeratorError;
//# sourceMappingURL=ModeratorError.d.ts.map
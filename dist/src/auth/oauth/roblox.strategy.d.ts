declare const RobloxStrategy_base: new (...args: [options: import("passport-oauth2").StrategyOptionsWithRequest] | [options: import("passport-oauth2").StrategyOptions]) => import("passport-oauth2") & {
    validate(...args: any[]): unknown;
};
export declare class RobloxStrategy extends RobloxStrategy_base {
    constructor();
    validate(accessToken: string, _refreshToken: string, _profile: any, done: Function): Promise<any>;
}
export {};

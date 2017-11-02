export declare type Bridge = {
    init(fn: (message: string, responseCallback: (data: any) => any) => any): void;
    registerHandler(methodName: string, fn: (data: any, responseCallback: () => any) => any): void;
    callHandler(methodName: string, params: { [key: string]: string | number } | null, responseCallback: (responseData: any) => any): void;
}
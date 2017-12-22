export declare type Bridge = {
    registerHandler(methodName: string, fn: (data: any, responseCallback: () => any) => any): void;
    callHandler(methodName: string, params: { [key: string]: string | number } | null, responseCallback: (responseData: any) => any): void;
}
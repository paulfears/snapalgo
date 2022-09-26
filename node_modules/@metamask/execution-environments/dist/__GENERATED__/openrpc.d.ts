export declare type Endowment = string;
export declare type JSONRPCString = "2.0";
export declare type StringDoaGddGA = string;
export declare type NumberHo1ClIqD = number;
export declare type JSONRPCID = StringDoaGddGA | NumberHo1ClIqD;
/**
 *
 * the name of the method
 *
 */
export declare type JSONRPCMethod = string;
export declare type JSONRPCParamsAsArray = any[];
export interface JSONRPCParamsAsObject {
    [key: string]: any;
}
export declare type JSONRPCParams = JSONRPCParamsAsArray | JSONRPCParamsAsObject;
export declare type SnapName = string;
export declare type SourceCode = string;
/**
 *
 * An array of the names of the endowments
 *
 */
export declare type Endowments = Endowment[];
export declare type Target = string;
export declare type Origin = string;
export interface JsonRpcRequest {
    jsonrpc: JSONRPCString;
    id?: JSONRPCID;
    method: JSONRPCMethod;
    params?: JSONRPCParams;
    [k: string]: any;
}
export declare type OK = "OK";
export declare type SnapRpcResult = any;
/**
 *
 * Generated! Represents an alias to any of the provided schemas
 *
 */
export declare type AnyOfSnapNameSourceCodeEndowmentsTargetOriginJsonRpcRequestOKOKOKSnapRpcResult = SnapName | SourceCode | Endowments | Target | Origin | JsonRpcRequest | OK | SnapRpcResult;
export declare type Ping = () => Promise<OK>;
export declare type Terminate = () => Promise<OK>;
export declare type ExecuteSnap = (snapName: SnapName, sourceCode: SourceCode, endowments?: Endowments) => Promise<OK>;
export declare type SnapRpc = (target: Target, origin: Origin, request: JsonRpcRequest) => Promise<SnapRpcResult>;

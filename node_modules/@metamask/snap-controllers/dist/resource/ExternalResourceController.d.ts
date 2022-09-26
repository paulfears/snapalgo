import SafeEventEmitter from '@metamask/safe-event-emitter';
export interface ResourceBase {
    readonly id: string;
    readonly fromDomain: string;
}
export declare type Resources<ResourceType extends ResourceBase> = Record<string, ResourceType>;
export declare type ResourceRequestHandler<T extends Record<string, unknown>> = (fromDomain: string, method: string, arg?: string | Partial<T>) => string | T | null;
declare const alwaysRequiredFields: string[];
declare type RequiredFieldsType = readonly string[] & typeof alwaysRequiredFields;
interface ExternalResourceControllerArgs<StorageKey extends string, RequiredFields extends readonly string[], ResourceType extends Record<RequiredFieldsType[number], unknown>> {
    storageKey: StorageKey;
    requiredFields: RequiredFields;
    initialResources: Resources<ResourceType & ResourceBase>;
}
/**
 * A class intended to describe a particular resource that is managed by snaps.
 * Example resources are assets.
 *
 * These are things that MetaMask treats as first-class objects with distinct properties within its own UI.
 */
export declare class ExternalResourceController<StorageKey extends string, RequiredFields extends readonly string[], ResourceType extends Record<RequiredFields[number], unknown>> extends SafeEventEmitter {
    private readonly requiredFields;
    private readonly storageKey;
    private readonly store;
    constructor({ storageKey, requiredFields, initialResources, }: ExternalResourceControllerArgs<StorageKey, RequiredFields, ResourceType>);
    getResources(): Resources<ResourceType & ResourceBase>;
    private setResources;
    clearResources(): void;
    deleteResourcesFor(fromDomain: string): void;
    get(fromDomain: string, id: string): (ResourceType & ResourceBase) | null;
    getAllResources(fromDomain: string): (ResourceType & ResourceBase)[];
    add(fromDomain: string, resource: ResourceType & {
        id?: string;
    }): string;
    update(fromDomain: string, resource: Partial<ResourceType> & {
        id: string;
    }): string;
    processNewResource(fromDomain: string, resource: Partial<ResourceType> & {
        id?: string;
    }): ResourceType & ResourceBase;
    delete(fromDomain: string, id: string): null;
    handleRpcRequest(fromDomain: string, method: string, arg: any): string | (ResourceType & ResourceBase) | (ResourceType & ResourceBase)[] | null;
}
export {};

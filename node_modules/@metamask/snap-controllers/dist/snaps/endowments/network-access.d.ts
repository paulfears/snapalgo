import { PermissionSpecificationBuilder, PermissionType } from '@metamask/controllers';
declare const permissionName = "endowment:network-access";
export declare const networkAccessEndowmentBuilder: Readonly<{
    readonly targetKey: "endowment:network-access";
    readonly specificationBuilder: PermissionSpecificationBuilder<PermissionType.Endowment, any, {
        permissionType: PermissionType.Endowment;
        targetKey: typeof permissionName;
        endowmentGetter: (_options?: any) => ['fetch', 'WebSocket', 'Request', 'Headers', 'Response'];
        allowedCaveats: null;
    }>;
}>;
export {};

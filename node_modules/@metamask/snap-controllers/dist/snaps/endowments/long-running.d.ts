import { PermissionSpecificationBuilder, PermissionType } from '@metamask/controllers';
declare const permissionName = "endowment:long-running";
export declare const longRunningEndowmentBuilder: Readonly<{
    readonly targetKey: "endowment:long-running";
    readonly specificationBuilder: PermissionSpecificationBuilder<PermissionType.Endowment, any, {
        permissionType: PermissionType.Endowment;
        targetKey: typeof permissionName;
        endowmentGetter: (_options?: any) => undefined;
        allowedCaveats: null;
    }>;
}>;
export {};

export declare const endowmentPermissionBuilders: {
    readonly "endowment:network-access": Readonly<{
        readonly targetKey: "endowment:network-access";
        readonly specificationBuilder: import("@metamask/controllers").PermissionSpecificationBuilder<import("@metamask/controllers").PermissionType.Endowment, any, {
            permissionType: import("@metamask/controllers").PermissionType.Endowment;
            targetKey: "endowment:network-access";
            endowmentGetter: (_options?: any) => ["fetch", "WebSocket", "Request", "Headers", "Response"];
            allowedCaveats: null;
        }>;
    }>;
    readonly "endowment:long-running": Readonly<{
        readonly targetKey: "endowment:long-running";
        readonly specificationBuilder: import("@metamask/controllers").PermissionSpecificationBuilder<import("@metamask/controllers").PermissionType.Endowment, any, {
            permissionType: import("@metamask/controllers").PermissionType.Endowment;
            targetKey: "endowment:long-running";
            endowmentGetter: (_options?: any) => undefined;
            allowedCaveats: null;
        }>;
    }>;
};
export * from './constants';

declare type Version = string;
declare type PackageName = string;
declare type Private = boolean;
declare type Main = string;
declare type StringDj4X5WuP = string;
declare type StringXp6NyS6W = "https://registry.npmjs.org" | "https://registry.npmjs.org/";
declare type PublishConfig = {
    access?: StringDj4X5WuP;
    registry: StringXp6NyS6W;
    [k: string]: any;
};
declare type Repository = {
    type: StringDj4X5WuP;
    url: StringDj4X5WuP;
};
export declare type NpmSnapPackageJson = {
    version: Version;
    name: PackageName;
    private?: Private;
    main?: Main;
    publishConfig?: PublishConfig;
    repository?: Repository;
    [k: string]: any;
};
export {};

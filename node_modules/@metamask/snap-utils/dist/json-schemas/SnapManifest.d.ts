/**
 *
 * MUST be a valid SemVer version string and equal to the corresponding `package.json` field.
 *
 */
declare type Version = string;
/**
 *
 * MUST be a non-empty string less than or equal to 280 characters. A short description of the Snap.
 *
 */
declare type Description = string;
/**
 *
 * MUST be a string less than or equal to 214 characters. The Snap author's proposed name for the Snap. The Snap host application may display this name unmodified in its user interface. The proposed name SHOULD be human-readable.
 *
 */
declare type ProposedName = string;
declare type NullQu0Arl1F = null;
declare type StringDj4X5WuP = string;
declare type ObjectOfStringDj4X5WuPStringDj4X5WuPHQwLk7Md = {
    type: StringDj4X5WuP;
    url: StringDj4X5WuP;
};
/**
 *
 * MAY be omitted. If present, MUST be equal to the corresponding package.json field.
 *
 */
declare type Repository = NullQu0Arl1F | ObjectOfStringDj4X5WuPStringDj4X5WuPHQwLk7Md;
/**
 *
 * MUST be the Base64-encoded string representation of the SHA-256 hash of the Snap source file.
 *
 */
declare type StringFpP4DSlq = string;
/**
 *
 * The path to the Snap bundle file from the project root directory.
 *
 */
declare type FilePath = string;
/**
 *
 * The path to an .svg file from the project root directory.
 *
 */
declare type IconPath = string;
/**
 *
 * The Snap's npm package name.
 *
 */
declare type PackageName = string;
/**
 *
 * The npm registry URL.
 *
 */
declare type NpmRegistry = "https://registry.npmjs.org" | "https://registry.npmjs.org/";
declare type Npm = {
    filePath: FilePath;
    iconPath?: IconPath;
    packageName: PackageName;
    registry: NpmRegistry;
};
declare type SourceLocation = {
    npm: Npm;
};
/**
 *
 * Specifies some Snap metadata and where to fetch the Snap during installation.
 *
 */
declare type Source = {
    shasum: StringFpP4DSlq;
    location: SourceLocation;
};
/**
 *
 * MUST be a valid EIP-2255 wallet_requestPermissions parameter object, specifying the initial permissions that will be requested when the Snap is added to the host application.
 *
 */
declare type InitialPermissions = {
    [key: string]: any;
};
/**
 *
 * The Snap manifest specification version targeted by the manifest.
 *
 */
declare type ManifestVersion = "0.1";
/**
 *
 * The Snap manifest file MUST be named `snap.manifest.json` and located in the package root directory.
 *
 */
export declare type SnapManifest = {
    version: Version;
    description: Description;
    proposedName: ProposedName;
    repository?: Repository;
    source: Source;
    initialPermissions: InitialPermissions;
    manifestVersion: ManifestVersion;
};
export {};

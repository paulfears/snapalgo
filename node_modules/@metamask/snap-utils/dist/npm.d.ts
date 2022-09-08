import { NpmSnapFileNames, SnapFiles, UnvalidatedSnapFiles } from './types';
import { NpmSnapPackageJson, SnapManifest } from './json-schemas';
export declare const SVG_MAX_BYTE_SIZE = 100000;
export declare const SVG_MAX_BYTE_SIZE_TEXT: string;
export declare const EXPECTED_SNAP_FILES: readonly ["manifest", "packageJson", "sourceCode"];
export declare const SnapFileNameFromKey: {
    readonly manifest: NpmSnapFileNames.Manifest;
    readonly packageJson: NpmSnapFileNames.PackageJson;
    readonly sourceCode: "source code bundle";
};
/**
 * Validates the files extracted from an npm Snap package tarball by ensuring
 * that they're non-empty and that the Json files match their respective schemas
 * and the Snaps publishing specification.
 *
 * @param snapFiles - The object containing the expected Snap file contents,
 * if any.
 * @param errorPrefix - The prefix of the error message.
 * @returns A tuple of the Snap manifest object and the Snap source code.
 */
export declare function validateNpmSnap(snapFiles: UnvalidatedSnapFiles, errorPrefix?: `${string}: `): SnapFiles;
/**
 * Validates the fields of an npm Snap manifest that has already passed JSON
 * Schema validation.
 *
 * @param snapFiles - The relevant snap files to validate.
 * @param snapFiles.manifest - The npm Snap manifest to validate.
 * @param snapFiles.packageJson - The npm Snap's `package.json`.
 * @param snapFiles.sourceCode - The Snap's source code.
 * @returns A tuple containing the validated snap manifest, snap source code,
 * and `package.json`.
 */
export declare function validateNpmSnapManifest({ manifest, packageJson, sourceCode, }: SnapFiles): [SnapManifest, string, NpmSnapPackageJson];

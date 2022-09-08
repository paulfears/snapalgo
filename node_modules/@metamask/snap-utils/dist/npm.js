"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNpmSnapManifest = exports.validateNpmSnap = exports.SnapFileNameFromKey = exports.EXPECTED_SNAP_FILES = exports.SVG_MAX_BYTE_SIZE_TEXT = exports.SVG_MAX_BYTE_SIZE = void 0;
const fast_deep_equal_1 = __importDefault(require("fast-deep-equal"));
const types_1 = require("./types");
const json_schemas_1 = require("./json-schemas");
const snaps_1 = require("./snaps");
exports.SVG_MAX_BYTE_SIZE = 100000;
exports.SVG_MAX_BYTE_SIZE_TEXT = `${Math.floor(exports.SVG_MAX_BYTE_SIZE / 1000)}kb`;
exports.EXPECTED_SNAP_FILES = [
    'manifest',
    'packageJson',
    'sourceCode',
];
exports.SnapFileNameFromKey = {
    manifest: types_1.NpmSnapFileNames.Manifest,
    packageJson: types_1.NpmSnapFileNames.PackageJson,
    sourceCode: 'source code bundle',
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
function validateNpmSnap(snapFiles, errorPrefix) {
    exports.EXPECTED_SNAP_FILES.forEach((key) => {
        if (!snapFiles[key]) {
            throw new Error(`${errorPrefix !== null && errorPrefix !== void 0 ? errorPrefix : ''}Missing file "${exports.SnapFileNameFromKey[key]}".`);
        }
    });
    // Typecast: We are assured that the required files exist if we get here.
    const { manifest, packageJson, sourceCode, svgIcon } = snapFiles;
    try {
        (0, json_schemas_1.validateSnapJsonFile)(types_1.NpmSnapFileNames.Manifest, manifest);
    }
    catch (error) {
        throw new Error(`${errorPrefix !== null && errorPrefix !== void 0 ? errorPrefix : ''}"${types_1.NpmSnapFileNames.Manifest}" is invalid:\n${error.message}`);
    }
    const validatedManifest = manifest;
    const { iconPath } = validatedManifest.source.location.npm;
    if (iconPath && !svgIcon) {
        throw new Error(`Missing file "${iconPath}".`);
    }
    try {
        (0, json_schemas_1.validateSnapJsonFile)(types_1.NpmSnapFileNames.PackageJson, packageJson);
    }
    catch (error) {
        throw new Error(`${errorPrefix !== null && errorPrefix !== void 0 ? errorPrefix : ''}"${types_1.NpmSnapFileNames.PackageJson}" is invalid:\n${error.message}`);
    }
    const validatedPackageJson = packageJson;
    validateNpmSnapManifest({
        manifest: validatedManifest,
        packageJson: validatedPackageJson,
        sourceCode,
    });
    if (svgIcon) {
        if (Buffer.byteLength(svgIcon, 'utf8') > exports.SVG_MAX_BYTE_SIZE) {
            throw new Error(`${errorPrefix !== null && errorPrefix !== void 0 ? errorPrefix : ''}The specified SVG icon exceeds the maximum size of ${exports.SVG_MAX_BYTE_SIZE_TEXT}.`);
        }
    }
    return {
        manifest: validatedManifest,
        packageJson: validatedPackageJson,
        sourceCode,
        svgIcon,
    };
}
exports.validateNpmSnap = validateNpmSnap;
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
function validateNpmSnapManifest({ manifest, packageJson, sourceCode, }) {
    const packageJsonName = packageJson.name;
    const packageJsonVersion = packageJson.version;
    const packageJsonRepository = packageJson.repository;
    const manifestPackageName = manifest.source.location.npm.packageName;
    const manifestPackageVersion = manifest.version;
    const manifestRepository = manifest.repository;
    if (packageJsonName !== manifestPackageName) {
        throw new snaps_1.ProgrammaticallyFixableSnapError(`"${types_1.NpmSnapFileNames.Manifest}" npm package name ("${manifestPackageName}") does not match the "${types_1.NpmSnapFileNames.PackageJson}" "name" field ("${packageJsonName}").`, types_1.SnapValidationFailureReason.NameMismatch);
    }
    if (packageJsonVersion !== manifestPackageVersion) {
        throw new snaps_1.ProgrammaticallyFixableSnapError(`"${types_1.NpmSnapFileNames.Manifest}" npm package version ("${manifestPackageVersion}") does not match the "${types_1.NpmSnapFileNames.PackageJson}" "version" field ("${packageJsonVersion}").`, types_1.SnapValidationFailureReason.VersionMismatch);
    }
    if (
    // The repository may be `undefined` in package.json but can only be defined
    // or `null` in the Snap manifest due to TS@<4.4 issues.
    (packageJsonRepository || manifestRepository) &&
        !(0, fast_deep_equal_1.default)(packageJsonRepository, manifestRepository)) {
        throw new snaps_1.ProgrammaticallyFixableSnapError(`"${types_1.NpmSnapFileNames.Manifest}" "repository" field does not match the "${types_1.NpmSnapFileNames.PackageJson}" "repository" field.`, types_1.SnapValidationFailureReason.RepositoryMismatch);
    }
    (0, snaps_1.validateSnapShasum)(manifest, sourceCode, `"${types_1.NpmSnapFileNames.Manifest}" "shasum" field does not match computed shasum.`);
    return [manifest, sourceCode, packageJson];
}
exports.validateNpmSnapManifest = validateNpmSnapManifest;
//# sourceMappingURL=npm.js.map
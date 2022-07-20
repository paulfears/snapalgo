/// <reference types="watchify" />
import type browserify from 'browserify';
import { Arguments } from 'yargs';
import yargs from 'yargs/yargs';
/** @see {isSnapConfig} ts-auto-guard:type-guard */
export declare type SnapConfig = {
    cliOptions?: Record<string, unknown>;
    bundlerCustomizer?: (bundler: browserify.BrowserifyObject) => void;
};
/**
 * Attempt to load the snap config file (`snap.config.js`). By default will use
 * the cached config, if it was loaded before, and `cached` is `true`. If the
 * config file is not found, or the config is invalid, this function will kill
 * the process.
 *
 * @param cached - Whether to use the cached config. Defaults to `true`.
 * @returns The snap config.
 */
export declare function loadConfig(cached?: boolean): SnapConfig;
/**
 * Attempts to read configuration options for package.json and the config file,
 * and apply them to argv if they weren't already set.
 *
 * Arguments are only set per the snap-cli config file if they were not specified
 * on the command line.
 *
 * @param snapConfig - The snap config.
 * @param processArgv - The command line arguments, i.e., `process.argv`.
 * @param yargsArgv - The processed `yargs` arguments.
 * @param yargsInstance - An instance of `yargs`.
 */
export declare function applyConfig(snapConfig: SnapConfig, processArgv: string[], yargsArgv: Arguments, yargsInstance: typeof yargs): void;

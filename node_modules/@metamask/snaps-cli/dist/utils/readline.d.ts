/// <reference types="node" />
import readline from 'readline';
declare type PromptArgs = {
    question: string;
    defaultValue?: string;
    shouldClose?: boolean;
    readlineInterface?: readline.Interface;
};
/**
 * Open a readline interface, to prompt for user input. Avoid using this
 * function directly. Use the {@link prompt} function instead.
 */
export declare function openPrompt(): void;
/**
 * Prompt for user input on the command line. If the prompt isn't open, it will
 * be opened.
 *
 * @param args - The prompt arguments.
 * @param args.question - The question to ask.
 * @param args.defaultValue - The default value to use, if no answer is provided.
 * @param args.shouldClose - Whether to close the readline interface after
 * prompting.
 * @param args.readlineInterface - The readline interface to use. Uses the
 * global readline interface if none provided.
 * @returns The user's input, or the default value if none provided.
 */
export declare function prompt({ question, defaultValue, shouldClose, readlineInterface, }: PromptArgs): Promise<string>;
/**
 * Close the readline interface.
 *
 * @param readlineInterface - The readline interface to close. Uses the global
 * readline interface if none provided.
 * @throws If no readline interface is provided, and the global interface isn't
 * open.
 */
export declare function closePrompt(readlineInterface?: readline.Interface): void;
export {};

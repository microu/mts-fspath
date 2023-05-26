/// <reference types="node" />
/// <reference types="node" />
import fs from "node:fs";
export type FSPathArg = string | FSPath;
export declare function fsPath(p: FSPathArg, followSymLinks?: boolean): FSPath;
export declare class FSPath {
    private _path;
    private _parsed;
    private _stats;
    readonly followSymlinks: boolean;
    constructor(p: string, followSymLinks?: boolean);
    isAbsolute(): boolean;
    toString(): string;
    get path(): string;
    get dir(): string;
    get root(): string;
    get base(): string;
    get ext(): string;
    exists(): boolean;
    isFile(): boolean;
    isDirectory(): boolean;
    isSymbolicLink(): boolean;
    private _readStats;
    open(flags: fs.OpenMode, mode?: fs.Mode | null | undefined): number;
    readFile(encoding?: BufferEncoding): string | Buffer;
    writeFile(data: string, options?: fs.WriteFileOptions): void;
    append(...others: (FSPath | string)[]): FSPath;
    static join(...paths: (FSPath | string)[]): FSPath;
    withSuffix(newSuffix: string, replace?: boolean | string): FSPath;
}
export declare function normalizeSeparator(p: string, stripTrailingSeparator?: boolean): string;

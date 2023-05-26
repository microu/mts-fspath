import { FSPath, FSPathArg } from "./fsPath.js";
export declare class SrcPath {
    readonly localPath: FSPath;
    base: FSPath;
    constructor(base: FSPathArg, localPath: FSPathArg);
    get fullPath(): FSPath;
    withBase(base: FSPathArg): SrcPath;
    withLocalPath(localPath: FSPathArg): SrcPath;
    withSuffix(newSuffix: string, replace?: boolean | string): SrcPath;
}
export type SrcDstMapFunc = (bp: SrcPath) => SrcPath;
export type SrcDstMapper = SrcDstMapFunc | SrcDstMapFunc[];
export type SrcDst = {
    src: FSPath;
    dst: FSPath;
};
export declare function iterSrcDst(sources: Iterable<SrcPath>, mapper: SrcDstMapper): Iterable<SrcDst>;
export declare function globSources(base: FSPathArg, patterns: string | string[]): SrcPath[];

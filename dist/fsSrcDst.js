import { fsPath } from "./fsPath.js";
import fastGlob from "fast-glob";
export class SrcPath {
    constructor(base, localPath) {
        this.localPath = fsPath(localPath);
        this.base = fsPath(base);
        if (this.localPath.isAbsolute()) {
            throw new Error(`localPath (${this.localPath}) must be relative`);
        }
    }
    get fullPath() {
        return this.base.append(this.localPath);
    }
    withBase(base) {
        return new SrcPath(base, this.localPath);
    }
    withLocalPath(localPath) {
        return new SrcPath(this.base, localPath);
    }
    withSuffix(newSuffix, replace = true) {
        return new SrcPath(this.base, this.localPath.withSuffix(newSuffix, replace));
    }
}
export function iterSrcDst(sources, mapper) {
    const mapSrcToDst = function (bp) {
        const mappers = mapper instanceof Array ? mapper : [mapper];
        for (const m of mappers) {
            bp = m(bp);
        }
        return bp;
    };
    return {
        *[Symbol.iterator]() {
            for (const source of sources) {
                yield { src: source.fullPath, dst: mapSrcToDst(source).fullPath };
            }
        },
    };
}
export function globSources(base, patterns) {
    base = fsPath(base);
    return fastGlob
        .sync(patterns, { cwd: base.path })
        .map((p) => new SrcPath(base, p));
}

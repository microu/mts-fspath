import { fsPath, FSPath, FSPathArg } from "./fsPath.js";
import fastGlob from "fast-glob";

export class SrcPath {
  readonly localPath: FSPath;
  base: FSPath;
  constructor(base: FSPathArg, localPath: FSPathArg) {
    this.localPath = fsPath(localPath);
    this.base = fsPath(base);

    if (this.localPath.isAbsolute()) {
      throw new Error(`localPath (${this.localPath}) must be relative`);
    }
  }

  get fullPath(): FSPath {
    return this.base.append(this.localPath);
  }

  withBase(base: FSPathArg): SrcPath {
    return new SrcPath(base, this.localPath);
  }

  withLocalPath(localPath: FSPathArg): SrcPath {
    return new SrcPath(this.base, localPath);
  }

  withSuffix(newSuffix: string, replace: boolean | string = true): SrcPath {
    return new SrcPath(
      this.base,
      this.localPath.withSuffix(newSuffix, replace)
    );
  }
}

export type SrcDstMapFunc = (bp: SrcPath) => SrcPath;
export type SrcDstMapper = SrcDstMapFunc | SrcDstMapFunc[];

export type SrcDst = {
  src: FSPath;
  dst: FSPath;
};

export function iterSrcDst(
  sources: Iterable<SrcPath>,
  mapper: SrcDstMapper
): Iterable<SrcDst> {
  const mapSrcToDst = function (bp: SrcPath): SrcPath {
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

export function globSources(base: FSPathArg, patterns: string | string[]) {
  base = fsPath(base);

  return fastGlob
    .sync(patterns, { cwd: base.path })
    .map((p) => new SrcPath(base, p));
}

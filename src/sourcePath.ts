import path from "node:path";
import { FSPath, FSPathArg, fsPath } from "./fsPath";

export class SourcePath extends FSPath {
  readonly localPath: FSPath;
  readonly basePath: FSPath;

  constructor(path: FSPathArg);
  constructor(basePath: FSPathArg, localPath: FSPathArg);
  constructor(pathOrBase: FSPathArg, localPath?: FSPathArg) {
    pathOrBase = fsPath(pathOrBase);
    let basePath: FSPath;
    if (localPath == undefined) {
      if (pathOrBase.isAbsolute()) {
        localPath = new FSPath(path.relative("/", pathOrBase.path));
        basePath = new FSPath("/");
      } else {
        localPath = pathOrBase;
        basePath = new FSPath(".");
      }
    } else {
      localPath = fsPath(localPath);
      basePath = pathOrBase;
    }

    if (localPath.isAbsolute()) {
      throw new Error(`localPath (${localPath}) must be relative`);
    }
    super(basePath.append(localPath).path);
    this.localPath = localPath;
    this.basePath = basePath;
  }

  withBasePath(basePath: FSPathArg): SourcePath {
    return new SourcePath(basePath, this.localPath);
  }

  withLocalPath(localPath: FSPathArg): SourcePath {
    return new SourcePath(this.base, localPath);
  }
}

type SourceDest = {
  source: SourcePath;
  dest: SourcePath;
};

export type SourceDestMapperFunc = (bp: SourcePath) => SourcePath;
export type SourceDestMapper = SourceDestMapperFunc | SourceDestMapperFunc[];

export function iterSourceDest(
  sources: Iterable<SourcePath>,
  mapper: SourceDestMapper
): Iterable<SourceDest> {
  const mapSrcToDst = function (sp: SourcePath): SourcePath {
    const mappers = mapper instanceof Array ? mapper : [mapper];
    for (const m of mappers) {
      sp = m(sp);
    }
    return sp;
  };

  return {
    *[Symbol.iterator]() {
      for (const source of sources) {
        yield { source: source, dest: mapSrcToDst(source) };
      }
    },
  };
}

import { FSPath, FSPathArg, fsPath } from "./fsPath";

export class SourcePath extends FSPath {
  readonly localPath: FSPath;
  readonly basePath: FSPath;

  constructor(basePath: FSPathArg, localPath: FSPathArg) {
    localPath = fsPath(localPath);
    basePath = fsPath(basePath);

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

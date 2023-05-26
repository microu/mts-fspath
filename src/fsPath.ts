import fs from "node:fs";
import path from "node:path";

export type FSPathArg = string | FSPath;

export function fsPath(p: FSPathArg, followSymLinks = true): FSPath {
  if (p instanceof FSPath) {
    if (followSymLinks == p.followSymlinks) {
      return p;
    } else {
      return new FSPath(p.path, followSymLinks);
    }
  } else {
    return new FSPath(p, followSymLinks);
  }
}

export class FSPath {
  private _path: string;
  private _parsed: path.ParsedPath;
  private _stats: fs.Stats | null | false;
  readonly followSymlinks: boolean;

  constructor(p: string, followSymLinks = true) {
    this._parsed = path.win32.parse(p);
    this._parsed.dir = normalizeSeparator(this._parsed.dir);
    this._parsed.root = normalizeSeparator(this._parsed.root, false);
    this._path = path.posix.join(this._parsed.dir, this._parsed.base);
    this._stats = null;
    this.followSymlinks = followSymLinks;
  }

  isAbsolute(): boolean {
    return path.win32.isAbsolute(this.path);
  }

  toString() {
    return `${this.path}`;
  }

  get path() {
    return this._path;
  }

  get dir() {
    return this._parsed.dir;
  }
  get root() {
    return this._parsed.root;
  }
  get base() {
    return this._parsed.base;
  }

  get ext() {
    return this._parsed.ext;
  }

  exists(): boolean {
    this._readStats();
    return this._stats !== false;
  }

  isFile(): boolean {
    if (this.exists()) {
      return (<fs.Stats>this._stats).isFile();
    }
    return false;
  }

  isDirectory(): boolean {
    if (this.exists()) {
      return (<fs.Stats>this._stats).isDirectory();
    }
    return false;
  }

  isSymbolicLink(): boolean {
    if (this.exists()) {
      return (<fs.Stats>this._stats).isSymbolicLink();
    }
    return false;
  }

  private _readStats() {
    if (this._stats === null) {
      try {
        if (this.followSymlinks) {
          this._stats = fs.statSync(this.path);
        } else {
          this._stats = fs.lstatSync(this.path);
        }
      } catch {
        this._stats = false;
      }
    }
  }

  open(flags: fs.OpenMode, mode?: fs.Mode | null | undefined): number {
    return fs.openSync(this.path, flags, mode);
  }

  readFile(encoding?: BufferEncoding) {
    return fs.readFileSync(this.path, encoding);
  }

  writeFile(data: string, options?: fs.WriteFileOptions) {
    if (options == null) {
      options = { encoding: "utf-8" };
    }
    fs.writeFileSync(this.path, data, options);
  }

  append(...others: (FSPath | string)[]): FSPath {
    return FSPath.join(this, ...others);
  }

  static join(...paths: (FSPath | string)[]): FSPath {
    if (paths.length == 0) {
      return fsPath("");
    }
    let r: FSPath = fsPath(paths[paths.length - 1]);
    if (r.isAbsolute()) {
      return r;
    }
    for (let i = paths.length - 2; i >= 0; i -= 1) {
      const p = fsPath(paths[i]);
      r = fsPath(path.posix.join(p.path, r.path));
      if (r.isAbsolute()) {
        return r;
      }
    }
    return r;
  }

  withSuffix(newSuffix: string, replace: boolean | string = true): FSPath {
    if (replace == true && newSuffix.startsWith(".")) {
      const pos = this.path.lastIndexOf(".");
      if (pos >= 0) {
        return new FSPath(this.path.slice(0, pos) + newSuffix);
      }
    }
    if (typeof replace == "string") {
      if (this.path.endsWith(replace)) {
        return new FSPath(
          this.path.slice(0, this.path.length - replace.length) + newSuffix
        );
      }
    }

    return new FSPath(this.path + newSuffix);
  }
}

export function normalizeSeparator(p: string, stripTrailingSeparator = true) {
  p = p.replaceAll("\\", "/");
  if (p.length > 1) {
    p = path.posix.normalize(p);
    if (stripTrailingSeparator && p.endsWith("/")) {
      p = p.slice(0, -1);
    }
  }
  return p;
}

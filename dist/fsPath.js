import fs from "node:fs";
import path from "node:path";
export function fsPath(p, followSymLinks = true) {
    if (p instanceof FSPath) {
        if (followSymLinks == p.followSymlinks) {
            return p;
        }
        else {
            return new FSPath(p.path, followSymLinks);
        }
    }
    else {
        return new FSPath(p, followSymLinks);
    }
}
export class FSPath {
    constructor(p, followSymLinks = true) {
        this._parsed = path.win32.parse(p);
        this._parsed.dir = normalizeSeparator(this._parsed.dir);
        this._parsed.root = normalizeSeparator(this._parsed.root, false);
        this._path = path.posix.join(this._parsed.dir, this._parsed.base);
        this._stats = null;
        this.followSymlinks = followSymLinks;
    }
    isAbsolute() {
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
    exists() {
        this._readStats();
        return this._stats !== false;
    }
    isFile() {
        if (this.exists()) {
            return this._stats.isFile();
        }
        return false;
    }
    isDirectory() {
        if (this.exists()) {
            return this._stats.isDirectory();
        }
        return false;
    }
    isSymbolicLink() {
        if (this.exists()) {
            return this._stats.isSymbolicLink();
        }
        return false;
    }
    _readStats() {
        if (this._stats === null) {
            try {
                if (this.followSymlinks) {
                    this._stats = fs.statSync(this.path);
                }
                else {
                    this._stats = fs.lstatSync(this.path);
                }
            }
            catch (_a) {
                this._stats = false;
            }
        }
    }
    open(flags, mode) {
        return fs.openSync(this.path, flags, mode);
    }
    readFile(encoding) {
        return fs.readFileSync(this.path, encoding);
    }
    writeFile(data, options) {
        if (options == null) {
            options = { encoding: "utf-8" };
        }
        fs.writeFileSync(this.path, data, options);
    }
    append(...others) {
        return FSPath.join(this, ...others);
    }
    static join(...paths) {
        if (paths.length == 0) {
            return fsPath("");
        }
        let r = fsPath(paths[paths.length - 1]);
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
    withSuffix(newSuffix, replace = true) {
        if (replace == true && newSuffix.startsWith(".")) {
            const pos = this.path.lastIndexOf(".");
            if (pos >= 0) {
                return new FSPath(this.path.slice(0, pos) + newSuffix);
            }
        }
        if (typeof replace == "string") {
            if (this.path.endsWith(replace)) {
                return new FSPath(this.path.slice(0, this.path.length - replace.length) + newSuffix);
            }
        }
        return new FSPath(this.path + newSuffix);
    }
}
export function normalizeSeparator(p, stripTrailingSeparator = true) {
    p = p.replaceAll("\\", "/");
    if (p.length > 1) {
        p = path.posix.normalize(p);
        if (stripTrailingSeparator && p.endsWith("/")) {
            p = p.slice(0, -1);
        }
    }
    return p;
}

import * as fs from "node:fs";
export function fsExists(path) {
    fs.existsSync(path);
}
export function fsIsFile(path) {
    try {
        const stat = fs.lstatSync(path);
        return stat.isFile();
    }
    catch (_a) {
        return false;
    }
}
export function fsIsDirectory(path) {
    try {
        const stat = fs.lstatSync(path);
        return stat.isDirectory();
    }
    catch (_a) {
        return false;
    }
}

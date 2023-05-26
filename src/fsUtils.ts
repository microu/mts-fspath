import * as fs from "node:fs";

export function fsExists(path:string) {
  fs.existsSync(path)
}

export function fsIsFile(path:string) {
  try {
    const stat = fs.lstatSync(path)
    return stat.isFile() 
  } catch {
    return false;
  }
}

export function fsIsDirectory(path:string) {
  try {
    const stat = fs.lstatSync(path)
    return stat.isDirectory() 
  } catch {
    return false;
  }
}

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { FSPath, fsPath, normalizeSeparator } from "@src/fsPath";
import fs from "node:fs";
import { expect } from "chai";

describe("fsPath", () => {
  test("Basic usage - absolute posix path", () => {
    const fspa = fsPath("/home/michel/local/bin/node");
    expect(fspa).to.be.ok;
    expect(`${fspa}`).to.equal("/home/michel/local/bin/node");
    assert.equal(fspa.isAbsolute(), true);
    assert.equal(fspa.dir, "/home/michel/local/bin");
    assert.equal(fspa.base, "node");
    assert.equal(fspa.ext, "");
    assert.equal(fspa.root, "/");
  });

  test("Basic usage - relative posix path", () => {
    const fspa = fsPath("local/www/notes/index.html");
    assert.equal(!!fspa, true);
    assert.equal(`${fspa}`, "local/www/notes/index.html");
    assert.equal(fspa.isAbsolute(), false);
    assert.equal(fspa.dir, "local/www/notes");
    assert.equal(fspa.base, "index.html");
    assert.equal(fspa.ext, ".html");
    assert.equal(fspa.root, "");

    const fspb = fsPath("index.html");
    expect(fspb).to.be.ok;
    expect(`${fspb}`).to.equal("index.html");
    expect(fspb.isAbsolute()).to.be.false;
    expect(fspb.dir).to.equal("");
    expect(fspb.base).to.equal("index.html");
    expect(fspb.ext).to.equal(".html");
    expect(fspb.root).to.equal("");
  });

  test("Basic usage - absolute win32 path", () => {
    const fspa = fsPath("c:\\home\\michel\\local\\bin\\node");
    expect(fspa).to.be.ok;
    expect(`${fspa}`).to.equal("c:/home/michel/local/bin/node");
    expect(fspa.isAbsolute()).to.be.true;
    expect(fspa.dir).to.equal("c:/home/michel/local/bin");
    expect(fspa.base).to.equal("node");
    expect(fspa.ext).to.equal("");
    expect(fspa.root).to.equal("c:/");
  });

  test("Basic usage - relative win32 path", () => {
    const fspa = fsPath("local\\www\\alpha\\home.html");
    expect(fspa).to.be.ok;
    expect(`${fspa}`).to.equal("local/www/alpha/home.html");
    expect(fspa.isAbsolute()).to.be.false;
    expect(fspa.dir).to.equal("local/www/alpha");
    expect(fspa.base).to.equal("home.html");
    expect(fspa.ext).to.equal(".html");
    expect(fspa.root).to.equal("");

    const fspb = fsPath("home.html");
    expect(fspb).to.be.ok;
    expect(`${fspb}`).to.equal("home.html");
    expect(fspb.isAbsolute()).to.be.false;
    expect(fspb.dir).to.equal("");
    expect(fspb.base).to.equal("home.html");
    expect(fspb.ext).to.equal(".html");
    expect(fspb.root).to.equal("");

    const fspc = fsPath("F:local\\www\\alpha\\home.html");
    expect(fspc).to.be.ok;
    expect(`${fspc}`).to.equal("F:local/www/alpha/home.html");
    expect(fspc.isAbsolute()).to.be.false;
    expect(fspc.dir).to.equal("F:local/www/alpha");
    expect(fspc.base).to.equal("home.html");
    expect(fspc.ext).to.equal(".html");
    expect(fspc.root).to.equal("F:");
  });

  test("Basic usage - abolue mixed path", () => {
    const fspa = fsPath("c:\\home/michel\\local/bin\\node");
    expect(!!fspa).to.be.ok;
    expect(`${fspa}`).to.equal("c:/home/michel/local/bin/node");
    expect(fspa.isAbsolute()).to.be.true;
    expect(fspa.dir).to.equal("c:/home/michel/local/bin");
    expect(fspa.base).to.equal("node");
    expect(fspa.ext).to.equal("");
    expect(fspa.root).to.equal("c:/");

    const fspb = fsPath("c:/home\\michel\\local/bin/node");
    expect(fspb).to.be.ok;
    expect(`${fspb}`).to.equal("c:/home/michel/local/bin/node");
    expect(fspb.isAbsolute()).to.be.true;
    expect(fspb.dir).to.equal("c:/home/michel/local/bin");
    expect(fspb.base).to.equal("node");
    expect(fspb.ext).to.equal("");
    expect(fspb.root).to.equal("c:/");
  });

  test("Basic usage - relative mixed path", () => {
    const fspa = fsPath("local\\www/alpha/home.html");
    expect(fspa).to.be.ok;
    expect(`${fspa}`).to.equal("local/www/alpha/home.html");
    expect(fspa.isAbsolute()).to.be.false;
    expect(fspa.dir).to.equal("local/www/alpha");
    expect(fspa.base).to.equal("home.html");
    expect(fspa.ext).to.equal(".html");
    expect(fspa.root).to.equal("");

    const fspb = fsPath("local/www\\alpha\\home.html");
    expect(fspb).to.be.ok;
    expect(`${fspb}`).to.equal("local/www/alpha/home.html");
    expect(fspb.isAbsolute()).to.be.false;
    expect(fspb.dir).to.equal("local/www/alpha");
    expect(fspb.base).to.equal("home.html");
    expect(fspb.ext).to.equal(".html");
    expect(fspb.root).to.equal("");

    const fspc = fsPath("F:local/www/alpha\\home.html");
    expect(fspc).to.be.ok;
    expect(`${fspc}`).to.equal("F:local/www/alpha/home.html");
    expect(fspc.isAbsolute()).to.be.false;
    expect(fspc.dir).to.equal("F:local/www/alpha");
    expect(fspc.base).to.equal("home.html");
    expect(fspc.ext).to.equal(".html");
    expect(fspc.root).to.equal("F:");
  });

  test("exists() method", () => {
    expect(fsPath("testdata/fspath").exists()).to.be.true;
    expect(fsPath("testdata/fspath/a.txt").exists()).to.be.true;
    expect(fsPath("testdata/fspath/a.txt", false).exists()).to.be.true;
    expect(fsPath("testdata/fspath/aa.txt").exists()).to.be.true;
    expect(fsPath("testdata/fspath/aa.txt", false).exists()).to.be.true;
    expect(fsPath("testdata/fspath/aaa.txt").exists()).to.be.true;
    expect(fsPath("testdata/fspath/aaa.txt", false).exists()).to.be.true;

    expect(fsPath("testdata/fspath/notfound.txt", false).exists()).to.be.true;
    expect(fsPath("testdata/fspath/notfound.txt").exists()).to.be.false;

    expect(fsPath("testdata/fspath/nothing_here.txt").exists()).to.be.false;
    expect(fsPath("testdata/fspath/nothing_here.txt", false).exists()).to.be
      .false;
    expect(fsPath("testdata/_fspath_/a.txt").exists()).to.be.false;
    expect(fsPath("testdata/_fspath_/a.txt", false).exists()).to.be.false;
  });

  test("isFile(), isDirectory(), isSymbolicLink() methods", () => {
    expect(fsPath("testdata/fspath").isFile()).to.be.false;
    expect(fsPath("testdata/fspath").isDirectory()).to.be.true;
    expect(fsPath("testdata/fspath").isSymbolicLink()).to.be.false;
    expect(fsPath("testdata/fspath", false).isFile()).to.be.false;
    expect(fsPath("testdata/fspath", false).isDirectory()).to.be.true;
    expect(fsPath("testdata/fspath", false).isSymbolicLink()).to.be.false;

    expect(fsPath("testdata/fspath/a.txt").isFile()).to.be.true;
    expect(fsPath("testdata/fspath/a.txt").isDirectory()).to.be.false;
    expect(fsPath("testdata/fspath/a.txt").isSymbolicLink()).to.be.false;
    expect(fsPath("testdata/fspath/a.txt", false).isFile()).to.be.true;
    expect(fsPath("testdata/fspath/a.txt", false).isDirectory()).to.be.false;
    expect(fsPath("testdata/fspath/a.txt", false).isSymbolicLink()).to.be.false;

    expect(fsPath("testdata/fspath/aa.txt").isFile()).to.be.true;
    expect(fsPath("testdata/fspath/aa.txt").isDirectory()).to.be.false;
    expect(fsPath("testdata/fspath/aa.txt").isSymbolicLink()).to.be.false;
    expect(fsPath("testdata/fspath/aa.txt", false).isFile()).to.be.false;
    expect(fsPath("testdata/fspath/aa.txt", false).isDirectory()).to.be.false;
    expect(fsPath("testdata/fspath/aa.txt", false).isSymbolicLink()).to.be.true;

    expect(fsPath("testdata/fspath/notfound.txt").isFile()).to.be.false;
    expect(fsPath("testdata/fspath/notfound.txt").isDirectory()).to.be.false;
    expect(fsPath("testdata/fspath/notfound.txt").isSymbolicLink()).to.be.false;
    expect(fsPath("testdata/fspath/notfound.txt", false).isFile()).to.be.false;
    expect(fsPath("testdata/fspath/notfound.txt", false).isDirectory()).to.be
      .false;
    expect(fsPath("testdata/fspath/notfound.txt", false).isSymbolicLink()).to.be
      .true;

    expect(fsPath("testdata/fspath/__abc__.txt").isFile()).to.be.false;
    expect(fsPath("testdata/fspath/__abc__.txt").isDirectory()).to.be.false;
    expect(fsPath("testdata/fspath/__abc__.txt").isSymbolicLink()).to.be.false;
    expect(fsPath("testdata/fspath/__abc__.txt", false).isFile()).to.be.false;
    expect(fsPath("testdata/fspath/__abc__.txt", false).isDirectory()).to.be
      .false;
    expect(fsPath("testdata/fspath/__abc__.txt", false).isSymbolicLink()).to.be
      .false;
  });

  test("withSuffix() method", () => {
    expect(fsPath("www/index.md").withSuffix(".html").path).to.equal(
      "www/index.html"
    );
    expect(fsPath("www/index.md").withSuffix(".html", false).path).to.equal(
      "www/index.md.html"
    );
    expect(fsPath("www/index.md").withSuffix(".html", ".md").path).to.equal(
      "www/index.html"
    );
    expect(
      fsPath("www/index.md").withSuffix(".html", ".markdown").path
    ).to.equal("www/index.md.html");
    expect(
      fsPath("www/index_md.html").withSuffix(".html", "_md.html").path
    ).to.equal("www/index.html");
    expect(fsPath("www/index_md").withSuffix("_html", "_md").path).to.equal(
      "www/index_html"
    );
  });

  test("open() for reading", () => {
    const fd = fsPath("testdata/fspath/a.txt").open("r");
    expect(typeof fd).to.equal("number");
    const b = Buffer.alloc(1024);
    let n = fs.readSync(fd, b);
    expect(n).to.equal(6);
    expect(b.toString("utf-8", 0, n)).to.equal("a.txt\n");
  });

  test("readFile() as string", () => {
    const fsp = fsPath("testdata/fspath/a.txt");
    expect(fsp.readFile("utf-8")).to.equal("a.txt\n");

    const fsp1 = fsPath("testdata/fspath/aa.txt");
    expect(fsp1.readFile("utf-8")).to.equal("a.txt\n");
  });

  test("readFile() as buffer", () => {
    const fsp = fsPath("testdata/fspath/a.txt");
    expect(fsp.readFile()).to.be.instanceOf(Buffer);
    expect(fsp.readFile().toString("utf-8")).to.equal("a.txt\n");

    const fdLines = fsPath("testdata/fspath/lines.txt").open("r");
    let n = 0;
    let iline = 0;
    const b = Buffer.alloc(16);
    while (true) {
      const nRead = fs.readSync(fdLines, b, 0, 11, n);
      if (nRead == 0) {
        break;
      }
      const line = b.toString("utf8", 0, 11);
      expect(line.length).to.equal(11);
      expect(line.startsWith("00000000")).to.be.true;
      expect(line.endsWith("\n")).to.be.true;
      expect(parseInt(line)).to.equal(iline);
      expect(nRead).to.equal(11);
      n += nRead;
      iline += 1;
    }
    expect(n).to.equal(1100);
  });
});

describe("FSPath.join()", () => {
  test("Basic Usage", () => {
    expect(FSPath.join().path).to.equal(".");

    expect(FSPath.join("a/b/c").path).to.equal("a/b/c");
    expect(FSPath.join("./a/b/c").path).to.equal("a/b/c");
    expect(FSPath.join("/home/michel////a/b/c").path).to.equal(
      "/home/michel/a/b/c"
    );

    expect(FSPath.join("/home", "michel", "a/b", "c").path).to.equal(
      "/home/michel/a/b/c"
    );
    expect(FSPath.join("/home", "michel", "a/b", "./c").path).to.equal(
      "/home/michel/a/b/c"
    );

    expect(FSPath.join("michel", "a/b", "c").path).to.equal("michel/a/b/c");
    expect(FSPath.join("michel", "a/b", "./c").path).to.equal("michel/a/b/c");

    expect(FSPath.join("docs", "/home/www", "a////b", "./c").path).to.equal(
      "/home/www/a/b/c"
    );
    expect(
      FSPath.join("docs", "/home/www", "a////b", "/usr/bin/python3").path
    ).to.equal("/usr/bin/python3");
  });
});

describe("normalizeSeparator", () => {
  test("Basic usage", () => {
    expect(normalizeSeparator("//a////b/c/d/")).to.equal("/a/b/c/d");
    expect(normalizeSeparator("c:\\a\\b\\c\\d\\")).to.equal("c:/a/b/c/d");
    expect(normalizeSeparator("//a////b/c/d/")).to.equal("/a/b/c/d");

    expect(normalizeSeparator("C:/A\\BB\\CCC/index.html")).to.equal(
      "C:/A/BB/CCC/index.html"
    );
  });
});

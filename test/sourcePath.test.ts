import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { SourcePath, iterSourceDest } from "@src/sourcePath";

describe("SourcePath class", () => {
  test("Basic Usage", () => {
    const spa = new SourcePath("/home/michel", "www/index.html");
    assert.equal(spa.localPath.path, "www/index.html");
    assert.equal(spa.basePath.path, "/home/michel");
    assert.equal(spa.path, "/home/michel/www/index.html");

    const spb = new SourcePath(".", "docs/index.html");
    assert.equal(spb.localPath.path, "docs/index.html");
    assert.equal(spb.basePath.path, ".");
    assert.equal(spb.path, "docs/index.html");

    assert.throws(() => {
      new SourcePath("/home", "/home/michel/.bashrc");
    }, "relative");
  });

  test("One arg constructor", () => {
    const spa = new SourcePath("/home/michel/www/index.html");
    assert.equal(spa.localPath.path, "home/michel/www/index.html");
    assert.equal(spa.basePath.path, "/");
    assert.equal(spa.path, "/home/michel/www/index.html");

    const spb = new SourcePath("docs/index.html");
    assert.equal(spb.localPath.path, "docs/index.html");
    assert.equal(spb.basePath.path, ".");
    assert.equal(spb.path, "docs/index.html");
  });
});

describe("iterSourceDest", () => {
  test("Basic usage", () => {
    const bpm = iterSourceDest(
      [new SourcePath("/home", "a.md"), new SourcePath("/home", "b.md")],
      (sp: SourcePath) => new SourcePath("out", sp.localPath)
    );
    const mappings = [...bpm];
    assert.equal(mappings.length, 2);
    assert.deepEqual(
      mappings.map((sd) => sd.source.path),
      ["/home/a.md", "/home/b.md"]
    );
    assert.deepEqual(
      mappings.map((sd) => sd.dest.path),
      ["out/a.md", "out/b.md"]
    );
  });

  test("Multiple mapper", () => {
    const bpm = iterSourceDest(
      [new SourcePath("/home", "a.md"), new SourcePath("/home", "b.md")],
      [
        (sp: SourcePath) => new SourcePath("out", sp.localPath),
        (sp: SourcePath) => new SourcePath(sp.basePath, sp.localPath + ".dump"),
      ]
    );
    const mappings = [...bpm];
    assert.equal(mappings.length, 2);
    assert.deepEqual(
      mappings.map((ds) => ds.source.path),
      ["/home/a.md", "/home/b.md"]
    );
    assert.deepEqual(
      mappings.map((ds) => ds.dest.path),
      ["out/a.md.dump", "out/b.md.dump"]
    );
  });
});

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { SourcePath } from "@src/sourcePath";

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
});

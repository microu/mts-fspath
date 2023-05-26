import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { expect } from "chai";

import { SrcPath, iterSrcDst, globSources } from "@src/fsSrcDst";

describe("SrcPath class", () => {
  test("Basic Usage", () => {
    const bpa = new SrcPath("/home/michel", "www/index.html");
    expect(bpa.localPath.path).to.equal("www/index.html");
    expect(bpa.base.path).to.equal("/home/michel");
    expect(bpa.fullPath.path).to.equal("/home/michel/www/index.html");

    const bpb = new SrcPath(".", "docs/index.html");
    expect(bpb.localPath.path).to.equal("docs/index.html");
    expect(bpb.base.path).to.equal(".");
    expect(bpb.fullPath.path).to.equal("docs/index.html");

    expect(() => {
      new SrcPath("/home", "/home/michel/.bashrc");
    }).to.throw("relative");
  });
});

describe("BasedPathMappings class", () => {
  test("Basic usage", () => {
    const bpm = iterSrcDst(
      [new SrcPath("/home", "a.md"), new SrcPath("/home", "b.md")],
      (bp: SrcPath) => new SrcPath("out",  bp.localPath)
    );
    const mappings = [...bpm];
    expect(mappings.length).to.equal(2);
    expect(mappings.map((ds) => ds.src.path)).to.deep.equal([
      "/home/a.md",
      "/home/b.md",
    ]);
    expect(mappings.map((ds) => ds.dst.path)).to.deep.equal(["out/a.md", "out/b.md"]);
  });

  test ("Multiple mapper", ()=>{
    const bpm = iterSrcDst(
      [new SrcPath("/home", "a.md"), new SrcPath("/home", "b.md")],
      [
        (bp: SrcPath) => new SrcPath("out",  bp.localPath),
        (bp: SrcPath) => new SrcPath(bp.base,   bp.localPath + ".dump"),
    ]

    );
    const mappings = [...bpm];
    expect(mappings.length).to.equal(2);
    expect(mappings.map((ds) => ds.src.path)).to.deep.equal([
      "/home/a.md",
      "/home/b.md",
    ]);
    expect(mappings.map((ds) => ds.dst.path)).to.deep.equal(["out/a.md.dump", "out/b.md.dump"]);

  })
});




describe("globSources function", () => {
  test("Basic Usage", () => {
    let sources = globSources("testdata", "**/*.md");
    expect(sources.map((ds) => ds.fullPath.path).sort()).to.deep.equal([
      "testdata/docs00/one.md",
      "testdata/docs00/three.md",
      "testdata/docs00/two.md",
      "testdata/docs01/about_this.md",
      "testdata/docs01/home.md",
      "testdata/docs01/thanks.md",
    ]);

    sources = globSources("testdata", "**/notes*.json");
    expect(sources.map((ds) => ds.fullPath.path).sort()).to.deep.equal([
      "testdata/fspath/notes.json",
      "testdata/notes00.json",
      "testdata/notes01.json",
    ]);

    sources = globSources("testdata", "**/notes*.xlsx");
    expect([...sources]).to.deep.equal([])
  });
});

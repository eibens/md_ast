import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.90.0/testing/asserts.ts";
import { md, Node, parse } from "./mod.ts";

/*
Helper for running a test.
*/
function test(md: string, ...children: Node[]) {
  assertEquals(parse(md), {
    type: "document",
    children,
  });
}

Deno.test("parse nested nodes", () => {
  test(
    `foo *bar*`,
    md("paragraph", {}, ["foo ", md("em", {}, ["bar"])]),
  );
});

Deno.test("parse multiple nodes", () => {
  test(
    `foo\n\nbar`,
    md("paragraph", {}, ["foo"]),
    md("paragraph", {}, ["bar"]),
  );
});

Deno.test("parse code", () => {
  test(
    `~~~md\nsome code\n~~~`,
    md("code", { content: "some code", lang: "md" }),
  );
});

Deno.test("parse blockquote", () => {
  test(
    `> some quote`,
    md("blockquote", {}, [
      md("paragraph", {}, ["some quote"]),
    ]),
  );
});

Deno.test("parse inline html", () => {
  assertThrows(
    () => {
      parse("<span/>");
    },
    Error,
    "raw HTML",
  );
  // NOTE: Raw HTML is currently not supported.
  //test(
  //  `some <span><div>inline<br/>html</div></span>`,
  //  md("paragraph", {}, [
  //    "some ",
  //    md("html", { content: "<span>inline html</span>" }),
  //  ]),
  //);
});

Deno.test("parse heading", () => {
  test(
    "### some heading",
    md("heading", { content: "some heading", level: 3 }, [
      "some heading",
    ]),
  );
});

Deno.test("parse hr", () => {
  test(
    "text\n***\ntext",
    md("paragraph", {}, ["text"]),
    md("hr", {}),
    md("paragraph", {}, ["text"]),
  );
});

Deno.test("parse list", () => {
  test(
    "1. first\n2. second",
    md("list", { ordered: true }, [
      md("listitem", {}, ["first"]),
      md("listitem", {}, ["second"]),
    ]),
  );
});

Deno.test("parse table", () => {
  test(
    "| col1 | col2 |\n|---|---|\n|blue|green|",
    md("table", {
      head: [
        md("tablerow", {}, [
          md("tablecell", { header: true, align: "" }, ["col1"]),
          md("tablecell", { header: true, align: "" }, ["col2"]),
        ]),
      ],
    }, [
      md("tablerow", {}, [
        md("tablecell", { header: false, align: "" }, ["blue"]),
        md("tablecell", { header: false, align: "" }, ["green"]),
      ]),
    ]),
  );
});

Deno.test("parse strong", () => {
  test(
    "strong **text**",
    md("paragraph", {}, [
      "strong ",
      md("strong", {}, ["text"]),
    ]),
  );
});

Deno.test("parse codespan", () => {
  test(
    "some `code`",
    md("paragraph", {}, [
      "some ",
      md("codespan", { content: "code" }),
    ]),
  );
});

Deno.test("parse br", () => {
  assertEquals(
    parse("some\nbreak", { breaks: true }),
    md("document", {}, [
      md("paragraph", {}, [
        "some",
        md("br", {}),
        "break",
      ]),
    ]),
  );
});

Deno.test("parse del", () => {
  assertEquals(
    parse("~~xyz~~", { gfm: true }),
    md("document", {}, [
      md("paragraph", {}, [
        md("del", {}, ["xyz"]),
      ]),
    ]),
  );
});

Deno.test("parse link", () => {
  test(
    "[link](url)",
    md("paragraph", {}, [
      md("link", { href: "url", title: "" }, ["link"]),
    ]),
  );
});

Deno.test("parse image", () => {
  test(
    "![text](url)",
    md("paragraph", {}, [
      md("image", { href: "url", text: "text", title: "" }),
    ]),
  );
});

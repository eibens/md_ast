import { md, Node, parse } from "./mod.ts";

// Use the `parse` function to convert markdown source code into an AST.
const parsed: Node<"document"> = parse(`
# Title

This is **bold** text.
`);

// The markdown is just a plain old object, so you can serialize it to JSON.
const parsedJson = JSON.stringify(parsed, null, 2);
console.log(parsedJson);

// Alternatively, you can use `md` to build a markdown AST manually. It is slightly easier than just using raw definitions. For example, the `type` and `children` array are provided as positional arguments, and you raw strings are automatically wrapped into `Node<"text">` nodes.
const manual = md("document", {}, [
  md("heading", { level: 1, content: "Title" }, [
    "Title",
  ]),
  md("paragraph", {}, [
    "This is ",
    md("strong", {}, ["bold"]),
    " text.",
  ]),
]);

// Both the parsed and manual ASTs are equivalent.
const manualJson = JSON.stringify(manual, null, 2);
const equal = parsedJson === manualJson;
if (!equal) {
  console.log(manualJson);
  console.error("ERROR: The two ASTs should be equal.");
  Deno.exit(1);
}

// Please note, that inline HTML is not supported and will throw an error:
try {
  parse("<span>Hello!</span>");
  console.log(
    "ERROR: This is very unexpected. Inline HTML should not yet work.",
  );
  Deno.exit(1);
} catch (error) {
  // This is expected!
}

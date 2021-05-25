import {
  Align,
  Marked,
  Renderer,
} from "https://deno.land/x/markdown@v2.0.0/mod.ts";
export type { Align } from "https://deno.land/x/markdown@v2.0.0/mod.ts";

// FIXME: Switch to a better syntax-tree implementation for markdown. For example, [unified](https://github.com/unifiedjs/unified) would be great. Currently it is not usable with Deno, but [ESM support is on the way](https://github.com/unifiedjs/unified/issues/121).

// This is a definition of a markdown AST. Note that it is truly abstract, as syntactic details are not included (e.g. asterisk vs. hyphen for list items). Each property defines an AST node type (e.g. `code` or `blockquote`) and additional node-specific properties (e.g. `escaped`, or `level`). Common properties are included with mixing types (e.g.`Children` for the `children` property).
type Lang = {
  document: Children;
  code: Text & {
    escaped?: boolean;
    lang?: string;
  };
  blockquote: Children;
  html: Text;
  heading: Children & Text & {
    level: number;
  };
  hr: {};
  list: Children & {
    ordered?: boolean;
  };
  listitem: Children;
  paragraph: Children;
  table: Children & {
    head: Node[];
  };
  tablerow: Children;
  tablecell: Children & {
    header?: boolean;
    align?: Align;
  };
  strong: Children;
  em: Children;
  codespan: Text;
  br: {};
  del: Children;
  link: Children & {
    href: string;
    title?: string;
  };
  image: {
    text: string;
    href: string;
    title: string;
  };
  text: Text;
};

// These helper types defined properties shared by multiple AST nodes.
type Children = {
  children: Node[];
};
type Text = {
  content: string;
};

/**
 * Nominal type of a markdown AST node.
 * 
 * Examples: `"paragraph"`, `"heading"`, `"em"`
 */
export type Type = keyof Lang;

/**
 * Data carried by a markdown AST node.
 * 
 * Example: `Opts<"heading">` is the data of the `"heading"` type.
 */
export type Opts<T extends Type> = Lang[T];

/**
 * A node in the Markdown AST consists of the nominal `Type` in the `type` property and the corresponding `Opts`.
 */
export type Node<T extends Type = Type> = Opts<T> & {
  type: T;
};

/**
 * Create a markdown AST node with a convenient API.
 */
export function md<T extends Type>(
  type: T,
  opts: Omit<Opts<T>, "children">,
  children?: (Node | string)[],
): Node<T> {
  const toNode = (x: Node | string) =>
    typeof x === "string" ? { type: "text", content: x } : x;
  return {
    type,
    ...opts,
    ...(children ? { children: children.map(toNode) } : {}),
  } as Node<T>;
}

/**
 * Convert raw markdown into a JSON compatible AST. 
 * @returns 
 */
export function parse(markdown: string, options: {
  gfm?: boolean;
  breaks?: boolean;
} = {}): Node<"document"> {
  // We parse markdown into an AST by overriding the HTML renderer of the underlying markdown engine with a custom JSON renderer.
  Object.assign(Marked.options, options);
  Marked.options.renderer = new JsonRenderer();
  const body = Marked.parse(markdown).content;
  return md("document", {}, list(body));
}

/**
 * We render nodes with trailing commas, so that they can be correctly parsed by the `children` function, after being concatenated.
 */
function element<T extends Type>(type: T, opts: Opts<T>): string {
  return JSON.stringify({ type, ...opts }) + ",";
}

// The underlying markdown engine concatenates child nodes into a single *body* string. The simplest solution to work with this is to parse the body before rendering the parent.
function list(body: string): Node[] {
  // FIXME: This process is wasteful since we generate the JSON for each child, then parse it in the parent renderer, then serialize it again when generating the JSON for the parent.

  const n = body.length - 1;
  try {
    return JSON.parse("[" + body.substr(0, n) + "]");
  } catch (error) {
    // NOTE: Unfortunately, the markdown parser that is currently used does not pass raw HTML to the appropriate function of `Renderer`, but rather just concatenates it to its surrounding. This means we cannot reliably wrap the HTML in an AST node -- it just gets mangled in with the other stuff.
    // FIXME: Find a way of wrapping raw HTML in an AST node, as was the intention with the `JsonRenderer.html` method.
    throw new Error(
      "Parsing a section of the Markdown document failed. Ensure that the source document does not contain raw HTML, which is currently not supported. This is the problematic section of the serialized AST:\n\n" +
        body + "\n\nThis is the orignal error message:\n\n" + error,
    );
  }
}

// Helper function for converting a body string into `Children`.
function children(body: string): Children {
  return { children: list(body) };
}

// We define the renderer by overriding each visitor function of the original HTML renderer.
class JsonRenderer extends Renderer {
  code(content: string, lang?: string, escaped?: boolean): string {
    return element("code", { content, lang, escaped });
  }

  blockquote(body: string): string {
    return element("blockquote", children(body));
  }

  // NOTE: Raw HTML is currently not supported.
  //html(content: string): string {
  //  return `"` + content + `",`;
  //}

  heading(body: string, level: number, content: string): string {
    return element("heading", { level, content, ...children(body) });
  }

  hr(): string {
    return element("hr", {});
  }

  list(body: string, ordered?: boolean): string {
    return element("list", { ordered, ...children(body) });
  }

  listitem(body: string): string {
    return element("listitem", children(body));
  }

  paragraph(body: string): string {
    return element("paragraph", children(body));
  }

  table(head: string, body: string): string {
    return element("table", { head: list(head), ...children(body) });
  }

  tablerow(body: string): string {
    return element("tablerow", children(body));
  }

  tablecell(
    body: string,
    { header, align }: { header?: boolean; align?: Align },
  ): string {
    return element("tablecell", { align, header, ...children(body) });
  }

  strong(body: string): string {
    return element("strong", children(body));
  }

  em(body: string): string {
    return element("em", children(body));
  }

  codespan(content: string): string {
    return element("codespan", { content });
  }

  br(): string {
    return element("br", {});
  }

  del(body: string): string {
    return element("del", children(body));
  }

  link(href: string, title: string, body: string): string {
    return element("link", { href, title, ...children(body) });
  }

  image(href: string, title: string, text: string): string {
    return element("image", { href, title, text });
  }

  text(content: string): string {
    return element("text", { content });
  }
}

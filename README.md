# [md-ast]

A markdown parser for [Deno] that outputs an abstract syntax tree (AST). The
underlying markdown engine is a [Deno fork] of a [TypeScript fork] of [marked].

## Demo

The [demo.ts] file demonstrates basic usage. Run it with [Deno] and it will
output the AST of a simple markdown document as JSON.

## Why use [md-ast]?

If you want to work with a typed markdown AST, but don't care about speed and
inline HTML, this module is for you. It is currently based on this [Deno fork]
of a markdown parser, where we override the HTML rendering with a JSON renderer.
It is probably quite slow for large documents and does not support HTML. In the
long term one should switch to a better, faster, and focused syntax-tree
implementation for markdown. For example, [unified] would be great, but we have
to wait for [unified Deno support].

## Develop

```shell
# Run demo:
deno run demo.ts

# Format code and run tests with coverage:
deno fmt && deno test --unstable --coverage=.cov && deno coverage --unstable .cov
```

[md-ast]: #
[demo.ts]: demo.ts
[marked]: https://github.com/markedjs/marked/tree/39fbc8aed
[Deno fork]: https://deno.land/x/markdown@v2.0.0
[TypeScript fork]: https://github.com/ts-stack/markdown
[Deno]: https://deno.land/
[unified]: https://github.com/unifiedjs/unified
[unified Deno support]: https://github.com/unifiedjs/unified/issues/121

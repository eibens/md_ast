# [md_ast]

[md_ast] is a markdown parser that outputs an abstract syntax tree (AST). The
underlying markdown engine is a [Deno fork] of a [TypeScript fork] of [marked].

[![License][license-shield]](LICENSE)
[![Deno module][deno-land-shield]][deno-land]
[![Github
tag][github-shield]][github] [![Build][build-shield]][build]
[![Code
coverage][coverage-shield]][coverage]

# Motivation

If you want to work with a typed markdown AST in TypeScript for Deno, but don't
care about speed and inline HTML, this module is for you. It is currently based
on this [Deno fork] of a markdown parser, where we override the HTML renderer
with a JSON renderer. It is probably quite slow for large documents and does not
support HTML. A better, faster, and focused syntax-tree implementation for
markdown, such as [unified], would be great, but we have to wait for
[unified Deno support].

## [example.ts](example.ts)

This module demonstrates basic [md_ast] usage. Running it will output the AST of
a simple markdown document as JSON.

```ts
deno run example.ts
```

[md-ast]: #
[marked]: https://github.com/markedjs/marked/tree/39fbc8aed
[Deno fork]: https://deno.land/x/markdown@v2.0.0
[TypeScript fork]: https://github.com/ts-stack/markdown
[unified]: https://github.com/unifiedjs/unified
[unified Deno support]: https://github.com/unifiedjs/unified/issues/121

<!-- badges -->

[github]: https://github.com/eibens/md_ast
[github-shield]: https://img.shields.io/github/v/tag/eibens/md_ast?label&logo=github
[coverage-shield]: https://img.shields.io/codecov/c/github/eibens/md_ast?logo=codecov&label
[license-shield]: https://img.shields.io/github/license/eibens/md_ast?color=informational
[coverage]: https://codecov.io/gh/eibens/md_ast
[build]: https://github.com/eibens/md_ast/actions/workflows/ci.yml
[build-shield]: https://img.shields.io/github/workflow/status/eibens/md_ast/ci?logo=github&label
[deno-land]: https://deno.land/x/md_ast
[deno-land-shield]: https://img.shields.io/badge/x/md_ast-informational?logo=deno&label

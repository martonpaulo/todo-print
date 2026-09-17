# Contributing to Todo Print

Small personal project, light process. Issues are welcome; so is a pull request that fixes
something plainly broken.

## Report a bug

Open an [issue](https://github.com/martonpaulo/todo-print/issues) with your browser and version,
what you did, what you expected and what happened.

For a **printing** problem, the print settings are part of the report: paper, orientation, margins,
scale, and whether headers and footers were on. The app defines `@page { size: A4 landscape;
margin: 0; }` and physical millimetre dimensions, but a web page cannot force printer-driver
settings, so a hardware margin or a scale other than 100% explains most wrong output. A PDF saved
through the browser's print dialog is the most useful attachment.

For a **Markdown** problem, paste the exact source, including anything the parser rejected —
**Export Markdown** gives you that source verbatim.

## Propose a change

Open an issue before writing code. The Markdown subset, the panel geometry and the browser-only
storage model are deliberate limits rather than gaps; [`AGENTS.md`](AGENTS.md) records the printed-page
contract and the patterns the code repeats, and [`CONTEXT.md`](CONTEXT.md) the domain vocabulary.
Note that `pnpm test:print` parses the contract in `AGENTS.md` rather than repeating it, so
changing a physical dimension means changing that record.

## Branches, commits and pull requests

- The owner commits validated work directly to `main`. Outside contributors branch and open a pull
  request.
- Branch as `<type>/<issue numbers>-<short-description>` ([Conventional Branch](https://conventionalbranch.org/), e.g. `feature/70-pane-menu-actions`; `<type>/<short-description>` when no issue exists).
- Use [Conventional Commits](https://www.conventionalcommits.org/) in English, one commit per
  concern. A commit or pull request title that closes issues ends with their numbers:
  `fix: normalize carriage returns (#54, #61)`.
- Start the pull request body with one `Closes #<n>` line per resolved issue, then the problem, the
  implementation, the tests with their results, and the residual risk.
- The `validate` check must pass. Pull requests are squash-merged.
- Never force-push.

## Run the validation gate

```bash
pnpm install
pnpm validate
```

That is `lint`, `test`, `test:print` and `build`, in that order. `pnpm check` is an alias of it.

`pnpm test:print` needs a real browser: it serves the app, drives it in headless Chrome and
measures the rendered sheet and its panels in millimetres. The first run downloads Chrome into
Puppeteer's cache if `pnpm install` did not already provision it; `.puppeteerrc.cjs` pins that build
so every machine and CI measure the same Chromium. It is kept out of `pnpm test` for that reason —
use `pnpm test` for the fast loop.

## Code of conduct

Be respectful and assume good faith. Behaviour that makes the project unpleasant for others is not
welcome, whatever its technical merit.

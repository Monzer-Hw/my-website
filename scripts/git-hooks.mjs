// Checks run by the local git hooks (lefthook.yml). No dependencies.
// Rules come from .claude/rules/git-conventions.md.
//
//   node scripts/git-hooks.mjs commit-msg <file>   check a commit message
//   node scripts/git-hooks.mjs pre-commit          check branch and staged files
//
// Prints each problem with how to fix it; exits 1 on problems, 0 otherwise.

import { execFileSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const COMMIT_TYPES = [
  "feat",
  "fix",
  "docs",
  "style",
  "refactor",
  "perf",
  "test",
  "build",
  "ci",
  "chore",
];

export const MAX_FIRST_LINE = 72;

const RULES = ".claude/rules/git-conventions.md";

// Messages git writes itself (merges, reverts, autosquash commits).
const GIT_MESSAGE = /^(Merge |Revert "|fixup! |squash! |amend! )/;

// `git commit -v` appends the diff below this line; git drops it.
const SCISSORS = "# ------------------------ >8 ------------------------";

const HEADER = /^(?<type>[A-Za-z]+)(?:\((?<scope>[^()\s]+)\))?!?: (?<summary>\S.*)$/;

/**
 * Problems with a commit message, as git will store it: comment lines
 * and everything below the `git commit -v` scissors line are ignored.
 * @param {string} text
 * @returns {string[]}
 */
export function checkCommitMessage(text) {
  const lines = [];
  for (const line of text.split(/\r?\n/)) {
    if (line === SCISSORS) break;
    if (line.startsWith("#")) continue;
    lines.push(line.trimEnd());
  }
  const first = lines.find((line) => line !== "");

  if (first === undefined) {
    return ["The commit message is empty. Write a first line like \"feat(contact): add the form\"."];
  }
  if (GIT_MESSAGE.test(first)) return [];

  const match = HEADER.exec(first);
  if (!match?.groups) {
    return [
      `The first line must be "<type>(<scope>): <summary>" (scope optional, "!" before ":" for a breaking change), e.g. "feat(contact): add the form". Got: "${first}".`,
    ];
  }

  const problems = [];
  const { type, summary } = match.groups;
  if (!COMMIT_TYPES.includes(type)) {
    problems.push(`Unknown type "${type}". Use one of: ${COMMIT_TYPES.join(", ")}.`);
  }
  if (/^\p{Lu}/u.test(summary)) {
    problems.push(`Start the summary with a lowercase letter: "${summary}".`);
  }
  if (summary.endsWith(".")) {
    problems.push("Remove the period at the end of the summary.");
  }
  const length = [...first].length;
  if (length > MAX_FIRST_LINE) {
    problems.push(
      `The first line is ${length} characters; shorten it to ${MAX_FIRST_LINE} or fewer.`,
    );
  }
  return problems;
}

/**
 * Problems with committing on the given branch ("" when HEAD is detached).
 * @param {string} name
 * @returns {string[]}
 */
export function checkBranch(name) {
  if (name !== "main") return [];
  return [
    "Commits on main are not allowed. Move your changes to a new branch and commit there: git switch -c <type>/<short-description>",
  ];
}

/**
 * Problems with the staged file paths: env files hold secrets, so only
 * `.env.example` may be committed, in any directory.
 * @param {string[]} paths
 * @returns {string[]}
 */
export function checkStagedFiles(paths) {
  return paths
    .filter((path) => {
      const name = path.split(/[\\/]/).pop() ?? "";
      return /^\.env(\..*)?$/.test(name) && name !== ".env.example";
    })
    .map(
      (path) =>
        `"${path}" is an env file and may hold secrets; only .env.example is committed. Unstage it: git restore --staged -- "${path}"`,
    );
}

/** @param {string[]} args */
function git(args) {
  return execFileSync("git", args, { encoding: "utf8" });
}

/**
 * Runs one hook check and returns the exit code. Git and file access are
 * passed in so tests can run it without a repository.
 * @param {string[]} args command-line arguments after the script path
 * @param {{
 *   readGit?: (args: string[]) => string,
 *   readFile?: (path: string) => string,
 *   log?: (line: string) => void,
 * }} [io]
 * @returns {number}
 */
export function run(args, io = {}) {
  const {
    readGit = git,
    readFile = (path) => readFileSync(path, "utf8"),
    log = (line) => console.error(line),
  } = io;
  const [command, file] = args;

  /** @type {string[]} */
  let problems;
  let heading;
  if (command === "commit-msg" && file) {
    heading = `Commit message refused (rules: ${RULES}):`;
    problems = checkCommitMessage(readFile(file));
  } else if (command === "pre-commit") {
    heading = "Commit refused:";
    const branch = readGit(["branch", "--show-current"]).trim();
    // Added, copied, modified and renamed files; deleting a file is fine.
    const staged = readGit(["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"])
      .split("\0")
      .filter(Boolean);
    problems = [...checkBranch(branch), ...checkStagedFiles(staged)];
  } else {
    log("Usage: node scripts/git-hooks.mjs commit-msg <file> | pre-commit");
    return 1;
  }

  if (problems.length === 0) return 0;
  log(heading);
  for (const problem of problems) log(`  - ${problem}`);
  return 1;
}

function isEntryPoint() {
  if (!process.argv[1]) return false;
  try {
    return pathToFileURL(realpathSync(process.argv[1])).href === import.meta.url;
  } catch {
    return false;
  }
}

if (isEntryPoint()) process.exitCode = run(process.argv.slice(2));

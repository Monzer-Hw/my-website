import { describe, expect, it } from "vitest";
import {
  checkBranch,
  checkCommitMessage,
  checkStagedFiles,
  MAX_FIRST_LINE,
  run,
} from "@/scripts/git-hooks.mjs";

describe("checkCommitMessage", () => {
  it.each([
    "feat(contact): add the form",
    "fix: handle a missing status",
    "docs(plan): describe the local hooks",
    "refactor(ui)!: rename the button props\n\nBREAKING CHANGE: Button takes `tone`",
    "test(hooks): cover the commit rules\n\n- valid and invalid messages",
    "chore: bump `next` to 16.4.2",
  ])("accepts %j", (message) => {
    expect(checkCommitMessage(message)).toEqual([]);
  });

  it.each([
    "Merge branch 'main' into feat/contact-form",
    "Merge branch 'x' into y",
    "Merge pull request #1 from a/b",
    "Merge remote-tracking branch 'origin/main'",
    'Reapply "feat: x"',
    'Revert "feat(contact): add the form"\n\nThis reverts commit 0c74d68.',
    "fixup! feat(contact): add the form",
    "squash! feat(contact): add the form",
    "amend! feat(contact): add the form",
  ])("accepts git's own message %j", (message) => {
    expect(checkCommitMessage(message)).toEqual([]);
  });

  it("ignores comment lines and the diff below the scissors line", () => {
    const message = [
      "# Please enter the commit message for your changes.",
      "",
      "feat(contact): add the form",
      "# On branch feat/contact-form",
      "# ------------------------ >8 ------------------------",
      "Bad first line. That would fail.",
    ].join("\n");
    expect(checkCommitMessage(message)).toEqual([]);
  });

  it("refuses a message that only starts like a merge", () => {
    const problems = checkCommitMessage("Merge the new layout.");
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^The first line must be "<type>\(<scope>\): <summary>"/);
  });

  it("ignores a leading byte order mark", () => {
    expect(checkCommitMessage("﻿feat(contact): add the form\n")).toEqual([]);
  });

  it("accepts Windows line endings", () => {
    expect(checkCommitMessage("fix: handle a missing status\r\n\r\n- body\r\n")).toEqual([]);
  });

  it(`accepts a first line of exactly ${MAX_FIRST_LINE} characters`, () => {
    const line = "feat: " + "a".repeat(MAX_FIRST_LINE - "feat: ".length);
    expect(line).toHaveLength(MAX_FIRST_LINE);
    expect(checkCommitMessage(line)).toEqual([]);
  });

  it(`refuses a first line of ${MAX_FIRST_LINE + 1} characters`, () => {
    const line = "feat: " + "a".repeat(MAX_FIRST_LINE + 1 - "feat: ".length);
    expect(checkCommitMessage(line)).toEqual([
      `The first line is ${MAX_FIRST_LINE + 1} characters; shorten it to ${MAX_FIRST_LINE} or fewer.`,
    ]);
  });

  it("refuses an uppercase summary", () => {
    expect(checkCommitMessage("feat(contact): Add the form")).toEqual([
      'Start the summary with a lowercase letter: "Add the form".',
    ]);
  });

  it("refuses a trailing period", () => {
    expect(checkCommitMessage("feat(contact): add the form.")).toEqual([
      "Remove the period at the end of the summary.",
    ]);
  });

  it("refuses an unknown type", () => {
    expect(checkCommitMessage("feature(contact): add the form")).toEqual([
      'Unknown type "feature". Use one of: feat, fix, docs, style, refactor, perf, test, build, ci, chore.',
    ]);
  });

  it("reports every problem with a valid header at once", () => {
    expect(checkCommitMessage("Feat: Add the form.")).toHaveLength(3);
  });

  it.each([
    "add the form",
    "feat add the form",
    "feat(): add the form",
    "feat(contact):add the form",
    "feat(contact): ",
  ])("refuses %j, which is not <type>(<scope>): <summary>", (message) => {
    const problems = checkCommitMessage(message);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^The first line must be "<type>\(<scope>\): <summary>"/);
  });

  it("refuses an empty message", () => {
    expect(checkCommitMessage("\n# only comments\n")).toEqual([
      'The commit message is empty. Write a first line like "feat(contact): add the form".',
    ]);
  });
});

describe("checkBranch", () => {
  it("refuses commits on main and says how to move them", () => {
    const problems = checkBranch("main");
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain("git switch -c <type>/<short-description>");
  });

  it.each(["feat/contact-form", "test/local-checks", "main-fix", ""])(
    "allows %j",
    (name) => {
      expect(checkBranch(name)).toEqual([]);
    },
  );
});

describe("checkStagedFiles", () => {
  it.each([".env", ".env.local", "sub/.env.production", "a\\b\\.env.test"])(
    "refuses %j",
    (path) => {
      expect(checkStagedFiles([path])).toEqual([
        `"${path}" is an env file and may hold secrets; only .env.example is committed. Unstage it: git restore --staged -- "${path}"`,
      ]);
    },
  );

  it("allows .env.example and other files", () => {
    expect(
      checkStagedFiles([".env.example", "sub/.env.example", ".envrc", "lib/env.ts", "app/.environment"]),
    ).toEqual([]);
  });

  it("reports each env file once", () => {
    expect(checkStagedFiles(["README.md", ".env", "lib/cn.ts", ".env.local"])).toHaveLength(2);
  });
});

describe("run", () => {
  const BRANCH_ARGS = ["branch", "--show-current"];
  const STAGED_ARGS = ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"];

  function setup(
    git: { branch?: string; staged?: string },
    files: Record<string, string> = {},
  ) {
    const lines: string[] = [];
    const calls: string[][] = [];
    const io = {
      readGit: (args: string[]) => {
        calls.push(args);
        if (JSON.stringify(args) === JSON.stringify(BRANCH_ARGS)) return git.branch ?? "";
        if (JSON.stringify(args) === JSON.stringify(STAGED_ARGS)) return git.staged ?? "";
        throw new Error(`unexpected git call: ${args.join(" ")}`);
      },
      readFile: (path: string) => files[path] ?? "",
      log: (line: string) => lines.push(line),
    };
    return { io, lines, calls };
  }

  it("commit-msg exits 0 for a valid message on a topic branch", () => {
    const { io, lines, calls } = setup(
      { branch: "test/local-checks\n" },
      { MSG: "feat(hooks): add lefthook\n" },
    );
    expect(run(["commit-msg", "MSG"], io)).toBe(0);
    expect(calls).toEqual([BRANCH_ARGS]);
    expect(lines).toEqual([]);
  });

  it("commit-msg reports a commit on main even with a valid message", () => {
    const { io, lines } = setup({ branch: "main\n" }, { MSG: "feat(hooks): add lefthook\n" });
    expect(run(["commit-msg", "MSG"], io)).toBe(1);
    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe("Commit message refused (rules: .claude/rules/git-conventions.md):");
    expect(lines[1]).toContain("Commits on main are not allowed");
  });

  it("commit-msg accepts a message with a byte order mark", () => {
    const { io } = setup({ branch: "feat/x\n" }, { MSG: "﻿feat(hooks): add lefthook\n" });
    expect(run(["commit-msg", "MSG"], io)).toBe(0);
  });

  it("commit-msg exits 1 and prints each problem", () => {
    const { io, lines } = setup({ branch: "feat/x\n" }, { MSG: "feat(hooks): Add lefthook.\n" });
    expect(run(["commit-msg", "MSG"], io)).toBe(1);
    expect(lines[0]).toBe("Commit message refused (rules: .claude/rules/git-conventions.md):");
    expect(lines.slice(1)).toEqual([
      '  - Start the summary with a lowercase letter: "Add lefthook.".',
      "  - Remove the period at the end of the summary.",
    ]);
  });

  it("pre-commit reads the branch and staged files from git", () => {
    const { io, lines } = setup({
      branch: "main\n",
      staged: "README.md\0.env.local\0",
    });
    expect(run(["pre-commit"], io)).toBe(1);
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe("Commit refused:");
    expect(lines[1]).toContain("Commits on main are not allowed");
    expect(lines[2]).toContain('".env.local" is an env file');
  });

  it("pre-commit exits 0 on a topic branch with clean staged files", () => {
    const { io, lines } = setup({ branch: "test/local-checks\n", staged: "README.md\0" });
    expect(run(["pre-commit"], io)).toBe(0);
    expect(lines).toEqual([]);
  });

  it.each([[[]], [["commit-msg"]], [["pre-push"]]])("prints usage for %j", (args) => {
    const { io, lines } = setup({});
    expect(run(args, io)).toBe(1);
    expect(lines).toEqual(["Usage: node scripts/git-hooks.mjs commit-msg <file> | pre-commit"]);
  });
});

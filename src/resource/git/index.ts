import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Git repository management tools
 */

export const gitCloneTool = {
  name: "git_clone",
  description: "Clone a git repository",
  inputSchema: z.object({
    url: z.string().describe("URL of the repository to clone"),
    destination: z.string().describe("Destination directory for the clone"),
    branch: z.string().optional().describe("Specific branch to clone"),
    depth: z.number().optional().describe("Depth for shallow clone"),
  }),
};

export const gitStatusTool = {
  name: "git_status",
  description: "Get git repository status",
  inputSchema: z.object({
    repoPath: z.string().describe("Path to git repository"),
    showAll: z.boolean().default(false).describe("Show all files including untracked"),
  }),
};

export const gitCommitTool = {
  name: "git_commit",
  description: "Commit changes to git repository",
  inputSchema: z.object({
    repoPath: z.string().describe("Path to git repository"),
    message: z.string().describe("Commit message"),
    addAll: z.boolean().default(false).describe("Add all changes before committing"),
  }),
};

export const gitPushTool = {
  name: "git_push",
  description: "Push commits to remote repository",
  inputSchema: z.object({
    repoPath: z.string().describe("Path to git repository"),
    remote: z.string().default("origin").describe("Remote name"),
    branch: z.string().optional().describe("Branch to push (defaults to current branch)"),
    force: z.boolean().default(false).describe("Force push"),
  }),
};

export const gitPullTool = {
  name: "git_pull",
  description: "Pull changes from remote repository",
  inputSchema: z.object({
    repoPath: z.string().describe("Path to git repository"),
    remote: z.string().default("origin").describe("Remote name"),
    branch: z.string().optional().describe("Branch to pull (defaults to current branch)"),
  }),
};

export const gitBranchTool = {
  name: "git_branch",
  description: "Manage git branches",
  inputSchema: z.object({
    repoPath: z.string().describe("Path to git repository"),
    operation: z.enum(["list", "create", "delete", "switch"]).describe("Branch operation"),
    branchName: z.string().optional().describe("Branch name (required for create/delete/switch)"),
  }),
};

export const gitLogTool = {
  name: "git_log",
  description: "View git commit history",
  inputSchema: z.object({
    repoPath: z.string().describe("Path to git repository"),
    maxCount: z.number().default(10).describe("Maximum number of commits to show"),
    format: z.enum(["oneline", "full", "short"]).default("oneline").describe("Log format"),
  }),
};

export const gitDiffTool = {
  name: "git_diff",
  description: "Show changes in git repository",
  inputSchema: z.object({
    repoPath: z.string().describe("Path to git repository"),
    staged: z.boolean().default(false).describe("Show staged changes only"),
    file: z.string().optional().describe("Specific file to diff"),
  }),
};

export const gitAddTool = {
  name: "git_add",
  description: "Stage files for commit",
  inputSchema: z.object({
    repoPath: z.string().describe("Path to git repository"),
    files: z.array(z.string()).describe("Files to stage"),
    all: z.boolean().default(false).describe("Stage all changes"),
  }),
};

export const gitInitTool = {
  name: "git_init",
  description: "Initialize a new git repository",
  inputSchema: z.object({
    repoPath: z.string().describe("Path where repository should be initialized"),
    bare: z.boolean().default(false).describe("Create a bare repository"),
  }),
};

// Tool handlers
export async function handleGitClone(args: z.infer<typeof gitCloneTool.inputSchema>) {
  try {
    let command = `git clone ${args.url} ${args.destination}`;
    if (args.branch) {
      command += ` -b ${args.branch}`;
    }
    if (args.depth) {
      command += ` --depth ${args.depth}`;
    }
    
    const { stdout, stderr } = await execAsync(command);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            url: args.url,
            destination: args.destination,
            output: stdout || stderr,
          }, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: false,
            error: error.message,
            stderr: error.stderr,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleGitStatus(args: z.infer<typeof gitStatusTool.inputSchema>) {
  try {
    const command = args.showAll 
      ? `cd ${args.repoPath} && git status -u`
      : `cd ${args.repoPath} && git status`;
    
    const { stdout } = await execAsync(command);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            repoPath: args.repoPath,
            status: stdout,
          }, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: false,
            error: error.message,
            repoPath: args.repoPath,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleGitCommit(args: z.infer<typeof gitCommitTool.inputSchema>) {
  try {
    let command = `cd ${args.repoPath}`;
    if (args.addAll) {
      command += ` && git add -A`;
    }
    command += ` && git commit -m "${args.message.replace(/"/g, '\\"')}"`;
    
    const { stdout } = await execAsync(command);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            repoPath: args.repoPath,
            message: args.message,
            output: stdout,
          }, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: false,
            error: error.message,
            repoPath: args.repoPath,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleGitPush(args: z.infer<typeof gitPushTool.inputSchema>) {
  try {
    let command = `cd ${args.repoPath} && git push ${args.remote}`;
    if (args.branch) {
      command += ` ${args.branch}`;
    }
    if (args.force) {
      command += ` --force`;
    }
    
    const { stdout, stderr } = await execAsync(command);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            repoPath: args.repoPath,
            remote: args.remote,
            output: stdout || stderr,
          }, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: false,
            error: error.message,
            repoPath: args.repoPath,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleGitPull(args: z.infer<typeof gitPullTool.inputSchema>) {
  try {
    let command = `cd ${args.repoPath} && git pull ${args.remote}`;
    if (args.branch) {
      command += ` ${args.branch}`;
    }
    
    const { stdout } = await execAsync(command);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            repoPath: args.repoPath,
            remote: args.remote,
            output: stdout,
          }, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: false,
            error: error.message,
            repoPath: args.repoPath,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleGitBranch(args: z.infer<typeof gitBranchTool.inputSchema>) {
  try {
    let command = `cd ${args.repoPath} && `;
    
    switch (args.operation) {
      case "list":
        command += "git branch -a";
        break;
      case "create":
        if (!args.branchName) throw new Error("branchName required for create operation");
        command += `git branch ${args.branchName}`;
        break;
      case "delete":
        if (!args.branchName) throw new Error("branchName required for delete operation");
        command += `git branch -d ${args.branchName}`;
        break;
      case "switch":
        if (!args.branchName) throw new Error("branchName required for switch operation");
        command += `git checkout ${args.branchName}`;
        break;
    }
    
    const { stdout } = await execAsync(command);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            repoPath: args.repoPath,
            operation: args.operation,
            output: stdout,
          }, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: false,
            error: error.message,
            repoPath: args.repoPath,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleGitLog(args: z.infer<typeof gitLogTool.inputSchema>) {
  try {
    const formatMap = {
      oneline: "--oneline",
      full: "--format=fuller",
      short: "--format=short",
    };
    
    const command = `cd ${args.repoPath} && git log ${formatMap[args.format]} -n ${args.maxCount}`;
    const { stdout } = await execAsync(command);
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            repoPath: args.repoPath,
            log: stdout,
          }, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: false,
            error: error.message,
            repoPath: args.repoPath,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleGitDiff(args: z.infer<typeof gitDiffTool.inputSchema>) {
  try {
    let command = `cd ${args.repoPath} && git diff`;
    if (args.staged) {
      command += " --staged";
    }
    if (args.file) {
      command += ` ${args.file}`;
    }
    
    const { stdout } = await execAsync(command);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            repoPath: args.repoPath,
            diff: stdout || "No changes",
          }, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: false,
            error: error.message,
            repoPath: args.repoPath,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleGitAdd(args: z.infer<typeof gitAddTool.inputSchema>) {
  try {
    let command = `cd ${args.repoPath} && git add`;
    if (args.all) {
      command += " -A";
    } else {
      command += ` ${args.files.join(" ")}`;
    }
    
    const { stdout } = await execAsync(command);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            repoPath: args.repoPath,
            output: stdout || "Files staged successfully",
          }, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: false,
            error: error.message,
            repoPath: args.repoPath,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleGitInit(args: z.infer<typeof gitInitTool.inputSchema>) {
  try {
    let command = `git init ${args.repoPath}`;
    if (args.bare) {
      command += " --bare";
    }
    
    const { stdout } = await execAsync(command);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            repoPath: args.repoPath,
            output: stdout,
          }, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: false,
            error: error.message,
            repoPath: args.repoPath,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

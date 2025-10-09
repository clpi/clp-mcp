import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

/**
 * Project management and profile tools
 */

export const ProjectProfileSchema = z.object({
  name: z.string().describe("Project name"),
  description: z.string().optional().describe("Project description"),
  type: z.enum(["nodejs", "python", "java", "go", "rust", "docker", "terraform", "ansible", "mixed"]).describe("Project type"),
  paths: z.object({
    root: z.string().describe("Root directory of the project"),
    source: z.string().optional().describe("Source code directory"),
    tests: z.string().optional().describe("Tests directory"),
    docs: z.string().optional().describe("Documentation directory"),
  }).describe("Project paths"),
  git: z.object({
    repository: z.string().optional().describe("Git repository URL"),
    branch: z.string().default("main").describe("Default branch"),
  }).optional().describe("Git configuration"),
  devops: z.object({
    ci: z.array(z.string()).optional().describe("CI/CD tools used"),
    infrastructure: z.array(z.string()).optional().describe("Infrastructure tools"),
    containerization: z.array(z.string()).optional().describe("Container tools"),
  }).optional().describe("DevOps configuration"),
  metadata: z.record(z.any()).optional().describe("Additional metadata"),
  created: z.string().optional().describe("Creation timestamp"),
  updated: z.string().optional().describe("Last updated timestamp"),
});

export type ProjectProfile = z.infer<typeof ProjectProfileSchema>;

export const createProjectTool = {
  name: "project_create",
  description: "Create a new project with initial structure",
  inputSchema: z.object({
    name: z.string().describe("Project name"),
    type: z.enum(["nodejs", "python", "java", "go", "rust", "docker", "terraform", "ansible", "mixed"]).describe("Project type"),
    path: z.string().describe("Path where project should be created"),
    includeGit: z.boolean().default(true).describe("Initialize git repository"),
    template: z.string().optional().describe("Template to use for project structure"),
  }),
};

export const saveProjectProfileTool = {
  name: "project_save_profile",
  description: "Save a project profile configuration",
  inputSchema: z.object({
    profile: ProjectProfileSchema,
    profilePath: z.string().optional().describe("Custom path to save profile (defaults to project root/.clp-project.json)"),
  }),
};

export const loadProjectProfileTool = {
  name: "project_load_profile",
  description: "Load a project profile configuration",
  inputSchema: z.object({
    profilePath: z.string().describe("Path to project profile or project root directory"),
  }),
};

export const listProjectProfilesTool = {
  name: "project_list_profiles",
  description: "List all project profiles in a directory",
  inputSchema: z.object({
    searchPath: z.string().describe("Path to search for project profiles"),
    recursive: z.boolean().default(true).describe("Search recursively"),
  }),
};

export const updateProjectProfileTool = {
  name: "project_update_profile",
  description: "Update an existing project profile",
  inputSchema: z.object({
    profilePath: z.string().describe("Path to project profile"),
    updates: z.record(z.any()).describe("Fields to update"),
  }),
};

export const analyzeProjectTool = {
  name: "project_analyze",
  description: "Analyze project structure and generate insights",
  inputSchema: z.object({
    projectPath: z.string().describe("Path to project root"),
    depth: z.enum(["shallow", "medium", "deep"]).default("medium").describe("Analysis depth"),
  }),
};

// Tool handlers
export async function handleCreateProject(args: z.infer<typeof createProjectTool.inputSchema>) {
  try {
    const projectPath = path.join(args.path, args.name);
    await fs.mkdir(projectPath, { recursive: true });
    
    // Create basic structure based on type
    const structure: Record<string, string[]> = {
      nodejs: ["src", "tests", "docs", "node_modules"],
      python: ["src", "tests", "docs", "venv"],
      java: ["src/main/java", "src/test/java", "target"],
      go: ["cmd", "pkg", "internal", "test"],
      rust: ["src", "tests", "target"],
      docker: ["dockerfiles", "compose"],
      terraform: ["modules", "environments"],
      ansible: ["playbooks", "roles", "inventory"],
      mixed: ["src", "tests", "docs"],
    };
    
    const dirs = structure[args.type] || [];
    for (const dir of dirs) {
      await fs.mkdir(path.join(projectPath, dir), { recursive: true });
    }
    
    // Initialize git if requested
    if (args.includeGit) {
      const { exec } = require("child_process");
      const { promisify } = require("util");
      const execAsync = promisify(exec);
      await execAsync(`git init ${projectPath}`);
    }
    
    // Create initial profile
    const profile: ProjectProfile = {
      name: args.name,
      type: args.type,
      paths: {
        root: projectPath,
      },
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
    
    const profilePath = path.join(projectPath, ".clp-project.json");
    await fs.writeFile(profilePath, JSON.stringify(profile, null, 2));
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            projectPath,
            profile,
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
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleSaveProjectProfile(args: z.infer<typeof saveProjectProfileTool.inputSchema>) {
  try {
    const profilePath = args.profilePath || path.join(args.profile.paths.root, ".clp-project.json");
    
    const profile = {
      ...args.profile,
      updated: new Date().toISOString(),
    };
    
    await fs.writeFile(profilePath, JSON.stringify(profile, null, 2));
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            profilePath,
            profile,
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
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleLoadProjectProfile(args: z.infer<typeof loadProjectProfileTool.inputSchema>) {
  try {
    let profilePath = args.profilePath;
    
    // Check if it's a directory, then look for .clp-project.json
    const stats = await fs.stat(profilePath);
    if (stats.isDirectory()) {
      profilePath = path.join(profilePath, ".clp-project.json");
    }
    
    const content = await fs.readFile(profilePath, "utf8");
    const profile = JSON.parse(content);
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            profilePath,
            profile,
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
            profilePath: args.profilePath,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleListProjectProfiles(args: z.infer<typeof listProjectProfilesTool.inputSchema>) {
  try {
    const profiles: Array<{ path: string; profile: any }> = [];
    
    async function searchProfiles(dir: string) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && args.recursive) {
          if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
            await searchProfiles(fullPath);
          }
        } else if (entry.name === ".clp-project.json") {
          try {
            const content = await fs.readFile(fullPath, "utf8");
            const profile = JSON.parse(content);
            profiles.push({ path: fullPath, profile });
          } catch (e) {
            // Skip invalid profiles
          }
        }
      }
    }
    
    await searchProfiles(args.searchPath);
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            searchPath: args.searchPath,
            profiles,
            count: profiles.length,
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
            searchPath: args.searchPath,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleUpdateProjectProfile(args: z.infer<typeof updateProjectProfileTool.inputSchema>) {
  try {
    const content = await fs.readFile(args.profilePath, "utf8");
    const profile = JSON.parse(content);
    
    const updatedProfile = {
      ...profile,
      ...args.updates,
      updated: new Date().toISOString(),
    };
    
    await fs.writeFile(args.profilePath, JSON.stringify(updatedProfile, null, 2));
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            profilePath: args.profilePath,
            profile: updatedProfile,
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
            profilePath: args.profilePath,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleAnalyzeProject(args: z.infer<typeof analyzeProjectTool.inputSchema>) {
  try {
    const analysis: any = {
      projectPath: args.projectPath,
      depth: args.depth,
      timestamp: new Date().toISOString(),
    };
    
    // Check for project profile
    try {
      const profilePath = path.join(args.projectPath, ".clp-project.json");
      const content = await fs.readFile(profilePath, "utf8");
      analysis.profile = JSON.parse(content);
    } catch {
      analysis.profile = null;
    }
    
    // Analyze project structure
    const entries = await fs.readdir(args.projectPath, { withFileTypes: true });
    analysis.structure = {
      files: entries.filter(e => e.isFile()).length,
      directories: entries.filter(e => e.isDirectory()).length,
      items: entries.map(e => ({
        name: e.name,
        type: e.isDirectory() ? "directory" : "file",
      })),
    };
    
    // Detect project type
    const indicators: Record<string, string[]> = {
      nodejs: ["package.json", "node_modules"],
      python: ["requirements.txt", "setup.py", "pyproject.toml"],
      java: ["pom.xml", "build.gradle"],
      go: ["go.mod", "go.sum"],
      rust: ["Cargo.toml", "Cargo.lock"],
      docker: ["Dockerfile", "docker-compose.yml"],
      terraform: ["main.tf", "variables.tf"],
      ansible: ["playbook.yml", "ansible.cfg"],
    };
    
    analysis.detectedTypes = [];
    for (const [type, files] of Object.entries(indicators)) {
      for (const file of files) {
        if (entries.some(e => e.name === file)) {
          analysis.detectedTypes.push(type);
          break;
        }
      }
    }
    
    // Check for git
    analysis.git = entries.some(e => e.name === ".git" && e.isDirectory());
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            analysis,
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
            projectPath: args.projectPath,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

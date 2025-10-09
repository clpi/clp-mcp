import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

/**
 * Filesystem tools for file and directory operations
 */

export const readFileTool = {
  name: "fs_read_file",
  description: "Read contents of a file",
  inputSchema: z.object({
    path: z.string().describe("Path to the file to read"),
    encoding: z.enum(["utf8", "base64", "hex"]).default("utf8").describe("File encoding"),
  }),
};

export const writeFileTool = {
  name: "fs_write_file",
  description: "Write content to a file",
  inputSchema: z.object({
    path: z.string().describe("Path to the file to write"),
    content: z.string().describe("Content to write to the file"),
    encoding: z.enum(["utf8", "base64", "hex"]).default("utf8").describe("File encoding"),
    createDirs: z.boolean().default(true).describe("Create parent directories if they don't exist"),
  }),
};

export const listDirectoryTool = {
  name: "fs_list_directory",
  description: "List contents of a directory",
  inputSchema: z.object({
    path: z.string().describe("Path to the directory to list"),
    recursive: z.boolean().default(false).describe("List directory contents recursively"),
    includeHidden: z.boolean().default(false).describe("Include hidden files"),
  }),
};

export const createDirectoryTool = {
  name: "fs_create_directory",
  description: "Create a new directory",
  inputSchema: z.object({
    path: z.string().describe("Path to the directory to create"),
    recursive: z.boolean().default(true).describe("Create parent directories if they don't exist"),
  }),
};

export const deleteFileTool = {
  name: "fs_delete_file",
  description: "Delete a file or directory",
  inputSchema: z.object({
    path: z.string().describe("Path to the file or directory to delete"),
    recursive: z.boolean().default(false).describe("Delete directory recursively"),
  }),
};

export const moveFileTool = {
  name: "fs_move_file",
  description: "Move or rename a file or directory",
  inputSchema: z.object({
    source: z.string().describe("Source path"),
    destination: z.string().describe("Destination path"),
  }),
};

export const copyFileTool = {
  name: "fs_copy_file",
  description: "Copy a file or directory",
  inputSchema: z.object({
    source: z.string().describe("Source path"),
    destination: z.string().describe("Destination path"),
    recursive: z.boolean().default(false).describe("Copy directory recursively"),
  }),
};

export const fileStatsTool = {
  name: "fs_file_stats",
  description: "Get file or directory statistics",
  inputSchema: z.object({
    path: z.string().describe("Path to the file or directory"),
  }),
};

// Tool handlers
export async function handleReadFile(args: z.infer<typeof readFileTool.inputSchema>) {
  try {
    const content = await fs.readFile(args.path, args.encoding as BufferEncoding);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            path: args.path,
            content: content,
            encoding: args.encoding,
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
            path: args.path,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleWriteFile(args: z.infer<typeof writeFileTool.inputSchema>) {
  try {
    if (args.createDirs) {
      const dir = path.dirname(args.path);
      await fs.mkdir(dir, { recursive: true });
    }
    await fs.writeFile(args.path, args.content, args.encoding as BufferEncoding);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            path: args.path,
            bytesWritten: args.content.length,
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
            path: args.path,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleListDirectory(args: z.infer<typeof listDirectoryTool.inputSchema>) {
  try {
    async function listDir(dirPath: string, recursive: boolean): Promise<string[]> {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const filtered = args.includeHidden 
        ? entries 
        : entries.filter(e => !e.name.startsWith('.'));
      
      const files: string[] = [];
      
      for (const entry of filtered) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.relative(args.path, fullPath);
        
        if (entry.isDirectory()) {
          files.push(`${relativePath}/`);
          if (recursive) {
            const subFiles = await listDir(fullPath, true);
            files.push(...subFiles);
          }
        } else {
          files.push(relativePath);
        }
      }
      
      return files;
    }
    
    const files = await listDir(args.path, args.recursive);
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            path: args.path,
            files: files,
            count: files.length,
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
            path: args.path,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleCreateDirectory(args: z.infer<typeof createDirectoryTool.inputSchema>) {
  try {
    await fs.mkdir(args.path, { recursive: args.recursive });
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            path: args.path,
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
            path: args.path,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleDeleteFile(args: z.infer<typeof deleteFileTool.inputSchema>) {
  try {
    const stats = await fs.stat(args.path);
    if (stats.isDirectory() && args.recursive) {
      await fs.rm(args.path, { recursive: true, force: true });
    } else if (stats.isDirectory()) {
      await fs.rmdir(args.path);
    } else {
      await fs.unlink(args.path);
    }
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            path: args.path,
            type: stats.isDirectory() ? "directory" : "file",
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
            path: args.path,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleMoveFile(args: z.infer<typeof moveFileTool.inputSchema>) {
  try {
    await fs.rename(args.source, args.destination);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            source: args.source,
            destination: args.destination,
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
            source: args.source,
            destination: args.destination,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleCopyFile(args: z.infer<typeof copyFileTool.inputSchema>) {
  try {
    async function copyRecursive(src: string, dest: string) {
      const stats = await fs.stat(src);
      if (stats.isDirectory()) {
        await fs.mkdir(dest, { recursive: true });
        const entries = await fs.readdir(src, { withFileTypes: true });
        for (const entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);
          if (entry.isDirectory()) {
            await copyRecursive(srcPath, destPath);
          } else {
            await fs.copyFile(srcPath, destPath);
          }
        }
      } else {
        await fs.copyFile(src, dest);
      }
    }
    
    if (args.recursive) {
      await copyRecursive(args.source, args.destination);
    } else {
      await fs.copyFile(args.source, args.destination);
    }
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            source: args.source,
            destination: args.destination,
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
            source: args.source,
            destination: args.destination,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

export async function handleFileStats(args: z.infer<typeof fileStatsTool.inputSchema>) {
  try {
    const stats = await fs.stat(args.path);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            path: args.path,
            stats: {
              size: stats.size,
              isFile: stats.isFile(),
              isDirectory: stats.isDirectory(),
              isSymbolicLink: stats.isSymbolicLink(),
              created: stats.birthtime,
              modified: stats.mtime,
              accessed: stats.atime,
              mode: stats.mode,
            },
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
            path: args.path,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

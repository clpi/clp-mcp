import { type Server } from "@modelcontextprotocol/sdk/server/index.js"
import { type Transport } from "@modelcontextprotocol/sdk/shared/transport.js"
import { } from "@smithery/sdk"
import { createStatefulServer, type CreateServerFn} from "@smithery/sdk/server/stateful.js"
import clpMcpConfig from "./config"
import console from "node:console"
import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { KnowledgeGraph, Entity, Relationship } from "./knowledge-graph.js"

export interface MemoryEntry {
  key: string;
  value: any;
  metadata?: {
    created: Date;
    updated: Date;
    tags?: string[];
    category?: string;
    entityId?: string; // Link to knowledge graph entity
  };
}

export class ClpMcpServer {
  private _memory: Map<string, MemoryEntry> = new Map();
  private _contexts: Map<string, any> = new Map();
  private _reasoning: Array<{ timestamp: Date; context: string; decision: string }> = [];
  private _knowledgeGraph: KnowledgeGraph = new KnowledgeGraph();

  public store(key: string, value: any, tags?: string[], category?: string): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    const now = new Date();
    const entry: MemoryEntry = {
      key,
      value,
      metadata: {
        created: this._memory.has(key) ? this._memory.get(key)!.metadata!.created : now,
        updated: now,
        tags,
        category,
      },
    };
    
    this._memory.set(key, entry);
    
    return {
      content: [
        {
          type: "text" as const,
          text: `Stored: ${key} = ${JSON.stringify(value)}`,
        }
      ]
    };
  }

  public recall(key?: string): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    if (key) {
      const entry = this._memory.get(key);
      if (!entry) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Key not found: ${key}`,
            }
          ],
          isError: true,
        };
      }
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(entry, null, 2),
          }
        ]
      };
    }
    
    // Return all memory
    const allMemory = Array.from(this._memory.entries()).map(([k, v]) => ({
      key: k,
      value: v.value,
      metadata: v.metadata,
    }));
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(allMemory, null, 2),
        }
      ]
    };
  }

  public delete(key: string): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    const deleted = this._memory.delete(key);
    return {
      content: [
        {
          type: "text" as const,
          text: deleted ? `Deleted: ${key}` : `Key not found: ${key}`,
        }
      ],
      isError: !deleted,
    };
  }

  public search(query: string, category?: string): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    const results = Array.from(this._memory.entries())
      .filter(([key, entry]) => {
        const matchesQuery = key.includes(query) || 
                            JSON.stringify(entry.value).includes(query) ||
                            (entry.metadata?.tags?.some(tag => tag.includes(query)) ?? false);
        const matchesCategory = !category || entry.metadata?.category === category;
        return matchesQuery && matchesCategory;
      })
      .map(([k, v]) => ({ key: k, value: v.value, metadata: v.metadata }));
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(results, null, 2),
        }
      ]
    };
  }

  public addReasoning(context: string, decision: string): void {
    this._reasoning.push({
      timestamp: new Date(),
      context,
      decision,
    });
  }

  public getReasoningHistory(limit: number = 10): {
    content: Array<{ type: string; text: string }>;
  } {
    const recent = this._reasoning.slice(-limit);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(recent, null, 2),
        }
      ]
    };
  }

  public storeContext(contextId: string, context: any): void {
    this._contexts.set(contextId, {
      ...context,
      timestamp: new Date(),
    });
  }

  public getContext(contextId: string): any {
    return this._contexts.get(contextId);
  }

  // Knowledge Graph Methods

  public addEntity(
    type: string,
    properties: Record<string, any>,
    tags?: string[]
  ): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    const entity = this._knowledgeGraph.addEntity(type, properties, undefined, tags);
    
    return {
      content: [
        {
          type: "text" as const,
          text: `Entity created: ${entity.id}\nType: ${entity.type}\nProperties: ${JSON.stringify(entity.properties, null, 2)}`,
        }
      ]
    };
  }

  public getEntity(entityId: string): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    const entity = this._knowledgeGraph.getEntity(entityId);
    
    if (!entity) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Entity not found: ${entityId}`,
          }
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(entity, null, 2),
        }
      ]
    };
  }

  public addRelationship(
    sourceId: string,
    targetId: string,
    relationshipType: string,
    properties?: Record<string, any>,
    weight?: number
  ): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    const relationship = this._knowledgeGraph.addRelationship(
      sourceId,
      targetId,
      relationshipType,
      properties,
      weight
    );

    if (!relationship) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to create relationship: source or target entity not found`,
          }
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: `Relationship created: ${relationship.id}\nType: ${relationship.type}\nFrom: ${relationship.sourceId}\nTo: ${relationship.targetId}`,
        }
      ]
    };
  }

  public queryEntities(
    query?: string,
    type?: string,
    tags?: string[]
  ): {
    content: Array<{ type: string; text: string }>;
  } {
    let entities: Entity[];

    if (query) {
      entities = this._knowledgeGraph.searchEntities(query, type, tags);
    } else if (type) {
      entities = this._knowledgeGraph.getEntitiesByType(type);
    } else {
      // Return all entities (limited for performance)
      const stats = this._knowledgeGraph.getStats();
      return {
        content: [
          {
            type: "text" as const,
            text: `Total entities: ${stats.entityCount}\nType distribution: ${JSON.stringify(stats.typeDistribution, null, 2)}\n\nProvide a query or type to search for specific entities.`,
          }
        ]
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: `Found ${entities.length} entities:\n\n${JSON.stringify(entities, null, 2)}`,
        }
      ]
    };
  }

  public queryRelationships(entityId: string, relationshipType?: string): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    const entity = this._knowledgeGraph.getEntity(entityId);
    
    if (!entity) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Entity not found: ${entityId}`,
          }
        ],
        isError: true,
      };
    }

    const related = this._knowledgeGraph.getRelatedEntities(entityId, relationshipType);
    const relationships = this._knowledgeGraph.getEntityRelationships(entityId);

    return {
      content: [
        {
          type: "text" as const,
          text: `Entity: ${entity.type} (${entity.id})\n\nRelationships: ${relationships.length}\n\nRelated Entities:\n${JSON.stringify(related.map(r => ({
            entity: {
              id: r.entity.id,
              type: r.entity.type,
              properties: r.entity.properties
            },
            relationship: {
              type: r.relationship.type,
              properties: r.relationship.properties
            }
          })), null, 2)}`,
        }
      ]
    };
  }

  public traverseGraph(
    sourceId: string,
    targetId: string,
    maxDepth?: number
  ): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    const result = this._knowledgeGraph.findPaths(sourceId, targetId, maxDepth || 5);

    if (result.entities.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: `No path found between ${sourceId} and ${targetId}`,
          }
        ],
        isError: false,
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: `Found ${result.paths?.length || 0} paths between entities:\n\nEntities involved: ${result.entities.length}\nRelationships: ${result.relationships.length}\n\nPaths:\n${JSON.stringify(result.paths?.map((path, i) => ({
            path: i + 1,
            length: path.entities.length,
            entities: path.entities.map(e => `${e.type}:${e.id}`),
            relationships: path.relationships.map(r => r.type)
          })), null, 2)}`,
        }
      ]
    };
  }

  public getGraphStats(): {
    content: Array<{ type: string; text: string }>;
  } {
    const stats = this._knowledgeGraph.getStats();
    
    return {
      content: [
        {
          type: "text" as const,
          text: `Knowledge Graph Statistics:\n\nTotal Entities: ${stats.entityCount}\nTotal Relationships: ${stats.relationshipCount}\n\nEntity Types:\n${JSON.stringify(stats.typeDistribution, null, 2)}`,
        }
      ]
    };
  }

  public exportGraph(): {
    content: Array<{ type: string; text: string }>;
  } {
    const graph = this._knowledgeGraph.exportGraph();
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(graph, null, 2),
        }
      ]
    };
  }

  public linkMemoryToEntity(key: string, entityId: string): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    const memoryEntry = this._memory.get(key);
    const entity = this._knowledgeGraph.getEntity(entityId);

    if (!memoryEntry) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Memory key not found: ${key}`,
          }
        ],
        isError: true,
      };
    }

    if (!entity) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Entity not found: ${entityId}`,
          }
        ],
        isError: true,
      };
    }

    // Update memory entry to link to entity
    if (memoryEntry.metadata) {
      memoryEntry.metadata.entityId = entityId;
    } else {
      memoryEntry.metadata = {
        created: new Date(),
        updated: new Date(),
        entityId,
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: `Linked memory key "${key}" to entity ${entityId} (${entity.type})`,
        }
      ]
    };
  }

  public getMemoryByEntity(entityId: string): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    const entity = this._knowledgeGraph.getEntity(entityId);
    
    if (!entity) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Entity not found: ${entityId}`,
          }
        ],
        isError: true,
      };
    }

    const linkedMemory = Array.from(this._memory.entries())
      .filter(([_, entry]) => entry.metadata?.entityId === entityId)
      .map(([key, entry]) => ({ key, value: entry.value, metadata: entry.metadata }));

    return {
      content: [
        {
          type: "text" as const,
          text: `Memory entries linked to entity ${entityId} (${entity.type}):\n\n${JSON.stringify(linkedMemory, null, 2)}`,
        }
      ]
    };
  }
}
export default function createStatelessServer({
  config,
}: {
  config: z.infer<typeof clpMcpConfig>
}) {
  const server = new McpServer({
    name: "clp-mcp",
    title: "CLP MCP",
    websiteUrl: "https://clp.im",
    version: "0.0.1",
  })
  const mem = new ClpMcpServer()
  server.tool("init", "Initialize a workspace", () => {
    return {
      isError: false,
      structuredContent: {

      },
      content: [
        {
          data: "Workspace initialized",
          name: "init",
          type: "text",
          text: "Workspace initialized",
          _meta: {}
        }
      ]

    }
  })
  return server.server
}
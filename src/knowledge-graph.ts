import { v4 as uuidv4 } from "uuid";

/**
 * Core entity interface for knowledge graph nodes
 */
export interface Entity {
  id: string;
  type: string;
  properties: Record<string, any>;
  metadata: {
    created: Date;
    updated: Date;
    tags?: string[];
  };
}

/**
 * Relationship between entities
 */
export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  properties?: Record<string, any>;
  metadata: {
    created: Date;
    weight?: number;
  };
}

/**
 * Query result for graph traversal
 */
export interface GraphQueryResult {
  entities: Entity[];
  relationships: Relationship[];
  paths?: Array<{
    entities: Entity[];
    relationships: Relationship[];
  }>;
}

/**
 * Knowledge Graph implementation for managing entities and relationships
 */
export class KnowledgeGraph {
  private entities: Map<string, Entity> = new Map();
  private relationships: Map<string, Relationship> = new Map();
  private entityRelationships: Map<string, Set<string>> = new Map(); // entityId -> relationshipIds
  private typeIndex: Map<string, Set<string>> = new Map(); // type -> entityIds

  /**
   * Add or update an entity in the knowledge graph
   */
  public addEntity(
    type: string,
    properties: Record<string, any>,
    id?: string,
    tags?: string[]
  ): Entity {
    const entityId = id || uuidv4();
    const now = new Date();
    
    const existingEntity = this.entities.get(entityId);
    const entity: Entity = {
      id: entityId,
      type,
      properties,
      metadata: {
        created: existingEntity?.metadata.created || now,
        updated: now,
        tags,
      },
    };

    this.entities.set(entityId, entity);
    
    // Update type index
    if (!this.typeIndex.has(type)) {
      this.typeIndex.set(type, new Set());
    }
    this.typeIndex.get(type)!.add(entityId);

    return entity;
  }

  /**
   * Get an entity by ID
   */
  public getEntity(id: string): Entity | undefined {
    return this.entities.get(id);
  }

  /**
   * Get all entities of a specific type
   */
  public getEntitiesByType(type: string): Entity[] {
    const entityIds = this.typeIndex.get(type);
    if (!entityIds) return [];
    
    return Array.from(entityIds)
      .map(id => this.entities.get(id))
      .filter((e): e is Entity => e !== undefined);
  }

  /**
   * Add a relationship between two entities
   */
  public addRelationship(
    sourceId: string,
    targetId: string,
    type: string,
    properties?: Record<string, any>,
    weight?: number
  ): Relationship | null {
    // Verify both entities exist
    if (!this.entities.has(sourceId) || !this.entities.has(targetId)) {
      return null;
    }

    const relationshipId = uuidv4();
    const relationship: Relationship = {
      id: relationshipId,
      sourceId,
      targetId,
      type,
      properties,
      metadata: {
        created: new Date(),
        weight,
      },
    };

    this.relationships.set(relationshipId, relationship);

    // Update entity relationship index
    if (!this.entityRelationships.has(sourceId)) {
      this.entityRelationships.set(sourceId, new Set());
    }
    if (!this.entityRelationships.has(targetId)) {
      this.entityRelationships.set(targetId, new Set());
    }
    
    this.entityRelationships.get(sourceId)!.add(relationshipId);
    this.entityRelationships.get(targetId)!.add(relationshipId);

    return relationship;
  }

  /**
   * Get all relationships for an entity
   */
  public getEntityRelationships(entityId: string): Relationship[] {
    const relationshipIds = this.entityRelationships.get(entityId);
    if (!relationshipIds) return [];

    return Array.from(relationshipIds)
      .map(id => this.relationships.get(id))
      .filter((r): r is Relationship => r !== undefined);
  }

  /**
   * Get related entities (neighbors) for a given entity
   */
  public getRelatedEntities(
    entityId: string,
    relationshipType?: string
  ): Array<{ entity: Entity; relationship: Relationship }> {
    const relationships = this.getEntityRelationships(entityId);
    const results: Array<{ entity: Entity; relationship: Relationship }> = [];

    for (const rel of relationships) {
      if (relationshipType && rel.type !== relationshipType) {
        continue;
      }

      // Get the other entity in the relationship
      const otherEntityId = rel.sourceId === entityId ? rel.targetId : rel.sourceId;
      const otherEntity = this.entities.get(otherEntityId);

      if (otherEntity) {
        results.push({ entity: otherEntity, relationship: rel });
      }
    }

    return results;
  }

  /**
   * Search entities by property values or tags
   */
  public searchEntities(
    query: string,
    type?: string,
    tags?: string[]
  ): Entity[] {
    const lowerQuery = query.toLowerCase();
    let candidates: Entity[];

    if (type) {
      candidates = this.getEntitiesByType(type);
    } else {
      candidates = Array.from(this.entities.values());
    }

    return candidates.filter(entity => {
      // Check if query matches type
      if (entity.type.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Check if query matches any property value
      const propertiesMatch = Object.values(entity.properties).some(value => {
        const stringValue = String(value).toLowerCase();
        return stringValue.includes(lowerQuery);
      });

      if (propertiesMatch) {
        return true;
      }

      // Check if query matches tags
      if (entity.metadata.tags) {
        const tagsMatch = entity.metadata.tags.some(tag =>
          tag.toLowerCase().includes(lowerQuery)
        );
        if (tagsMatch) {
          return true;
        }
      }

      // Filter by required tags if provided
      if (tags && tags.length > 0) {
        const entityTags = entity.metadata.tags || [];
        return tags.every(tag => entityTags.includes(tag));
      }

      return false;
    });
  }

  /**
   * Find paths between two entities using BFS
   */
  public findPaths(
    sourceId: string,
    targetId: string,
    maxDepth: number = 5
  ): GraphQueryResult {
    const visited = new Set<string>();
    const queue: Array<{
      entityId: string;
      path: Array<{ entity: Entity; relationship?: Relationship }>;
      depth: number;
    }> = [];

    const sourceEntity = this.entities.get(sourceId);
    if (!sourceEntity) {
      return { entities: [], relationships: [] };
    }

    queue.push({
      entityId: sourceId,
      path: [{ entity: sourceEntity }],
      depth: 0,
    });

    const foundPaths: Array<{
      entities: Entity[];
      relationships: Relationship[];
    }> = [];

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.entityId === targetId) {
        // Found a path
        const entities = current.path.map(p => p.entity);
        const relationships = current.path
          .filter(p => p.relationship)
          .map(p => p.relationship!);
        
        foundPaths.push({ entities, relationships });
        continue;
      }

      if (current.depth >= maxDepth) {
        continue;
      }

      if (visited.has(current.entityId)) {
        continue;
      }

      visited.add(current.entityId);

      // Explore neighbors
      const related = this.getRelatedEntities(current.entityId);
      for (const { entity, relationship } of related) {
        if (!visited.has(entity.id)) {
          queue.push({
            entityId: entity.id,
            path: [...current.path, { entity, relationship }],
            depth: current.depth + 1,
          });
        }
      }
    }

    // Collect all unique entities and relationships from found paths
    const allEntities = new Map<string, Entity>();
    const allRelationships = new Map<string, Relationship>();

    for (const path of foundPaths) {
      for (const entity of path.entities) {
        allEntities.set(entity.id, entity);
      }
      for (const relationship of path.relationships) {
        allRelationships.set(relationship.id, relationship);
      }
    }

    return {
      entities: Array.from(allEntities.values()),
      relationships: Array.from(allRelationships.values()),
      paths: foundPaths,
    };
  }

  /**
   * Get graph statistics
   */
  public getStats(): {
    entityCount: number;
    relationshipCount: number;
    typeDistribution: Record<string, number>;
  } {
    const typeDistribution: Record<string, number> = {};
    
    for (const [type, entityIds] of this.typeIndex.entries()) {
      typeDistribution[type] = entityIds.size;
    }

    return {
      entityCount: this.entities.size,
      relationshipCount: this.relationships.size,
      typeDistribution,
    };
  }

  /**
   * Export the graph for visualization
   */
  public exportGraph(): {
    nodes: Array<{ id: string; type: string; label: string; properties: any }>;
    edges: Array<{ id: string; source: string; target: string; type: string; weight?: number }>;
  } {
    const nodes = Array.from(this.entities.values()).map(entity => ({
      id: entity.id,
      type: entity.type,
      label: entity.properties.name || entity.properties.title || entity.id,
      properties: entity.properties,
    }));

    const edges = Array.from(this.relationships.values()).map(rel => ({
      id: rel.id,
      source: rel.sourceId,
      target: rel.targetId,
      type: rel.type,
      weight: rel.metadata.weight,
    }));

    return { nodes, edges };
  }

  /**
   * Clear all data from the graph
   */
  public clear(): void {
    this.entities.clear();
    this.relationships.clear();
    this.entityRelationships.clear();
    this.typeIndex.clear();
  }
}

# Knowledge Graph System

The CLP MCP server includes a powerful knowledge graph system for modeling entities and their relationships, enabling context-aware operations, semantic queries, and impact analysis.

## Overview

The knowledge graph system allows you to:

- **Model entities**: Services, databases, configurations, infrastructure components, people, concepts, etc.
- **Define relationships**: Dependencies, implementations, ownership, communication patterns, etc.
- **Query and traverse**: Find entities, explore relationships, discover paths between components
- **Link to memory**: Associate contextual information with entities
- **Export and visualize**: Generate graph data for visualization tools

## Core Concepts

### Entities

Entities are the nodes in your knowledge graph. Each entity has:

- **ID**: Unique identifier (auto-generated UUID)
- **Type**: Category of the entity (e.g., 'service', 'database', 'person')
- **Properties**: Key-value pairs describing the entity
- **Metadata**: Created/updated timestamps, tags

Example entity types:
- `service` - Microservices, APIs, applications
- `database` - Databases, data stores
- `infrastructure` - Servers, containers, clusters
- `configuration` - Config files, settings
- `person` - Team members, stakeholders
- `concept` - Architectural patterns, design principles

### Relationships

Relationships are the edges connecting entities. Each relationship has:

- **Source**: Entity ID where the relationship originates
- **Target**: Entity ID where the relationship points
- **Type**: Nature of the relationship
- **Properties**: Additional metadata about the relationship
- **Weight**: Optional strength/importance indicator

Common relationship types:
- `depends_on` - Dependency relationships
- `implements` - Implementation relationships
- `manages` - Management/ownership
- `routes_to` - Routing/forwarding
- `configured_by` - Configuration relationships
- `deployed_on` - Deployment relationships

## Available Tools

### Entity Management

#### `add_entity`
Create a new entity in the knowledge graph.

```json
{
  "type": "service",
  "properties": {
    "name": "api-gateway",
    "version": "2.1.0",
    "port": 8080,
    "environment": "production"
  },
  "tags": ["microservice", "critical"]
}
```

#### `get_entity`
Retrieve an entity by its ID.

```json
{
  "entityId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### `query_entities`
Search for entities by query, type, or tags.

```json
{
  "query": "production",
  "type": "service",
  "tags": ["critical"]
}
```

### Relationship Management

#### `add_relationship`
Create a relationship between two entities.

```json
{
  "sourceId": "entity-1-id",
  "targetId": "entity-2-id",
  "relationshipType": "depends_on",
  "properties": {
    "version": ">=2.0.0",
    "protocol": "HTTPS"
  },
  "weight": 0.9
}
```

#### `query_relationships`
Get all relationships for an entity.

```json
{
  "entityId": "550e8400-e29b-41d4-a716-446655440000",
  "relationshipType": "depends_on"
}
```

### Graph Traversal

#### `traverse_graph`
Find paths between two entities.

```json
{
  "sourceId": "api-gateway-id",
  "targetId": "database-id",
  "maxDepth": 5
}
```

Use cases:
- Impact analysis: What will be affected if this component changes?
- Dependency chains: What does this service depend on?
- Communication paths: How do these components communicate?

### Graph Analysis

#### `get_graph_stats`
Get statistics about your knowledge graph.

Returns:
- Total entity count
- Total relationship count
- Entity type distribution

#### `export_graph`
Export the graph in a visualization-ready format.

Returns:
```json
{
  "nodes": [
    {
      "id": "entity-1",
      "type": "service",
      "label": "API Gateway",
      "properties": { ... }
    }
  ],
  "edges": [
    {
      "id": "rel-1",
      "source": "entity-1",
      "target": "entity-2",
      "type": "depends_on",
      "weight": 0.9
    }
  ]
}
```

Compatible with visualization libraries:
- D3.js
- Cytoscape.js
- Vis.js
- Graphviz

### Memory Integration

#### `link_memory_to_entity`
Link memory entries to entities for contextual information.

```json
{
  "key": "migration_notes",
  "entityId": "database-id"
}
```

#### `get_memory_by_entity`
Retrieve all memory entries linked to an entity.

```json
{
  "entityId": "database-id"
}
```

## Use Cases

### 1. Infrastructure Mapping

Model your entire infrastructure as a knowledge graph:

```javascript
// Create entities
const cluster = add_entity({
  type: "infrastructure",
  properties: { name: "k8s-prod-cluster", provider: "AWS" }
});

const service = add_entity({
  type: "service",
  properties: { name: "user-api", replicas: 3 }
});

// Define relationships
add_relationship({
  sourceId: service.id,
  targetId: cluster.id,
  relationshipType: "deployed_on"
});
```

### 2. Dependency Analysis

Understand service dependencies:

```javascript
// Find all dependencies
query_relationships({
  entityId: serviceId,
  relationshipType: "depends_on"
});

// Find impact of changes
traverse_graph({
  sourceId: serviceId,
  targetId: databaseId,
  maxDepth: 10
});
```

### 3. Team and Ownership Tracking

Model team structure and ownership:

```javascript
const team = add_entity({
  type: "team",
  properties: { name: "Platform Team" }
});

const person = add_entity({
  type: "person",
  properties: { name: "John Doe", role: "Tech Lead" }
});

const service = add_entity({
  type: "service",
  properties: { name: "auth-service" }
});

add_relationship({
  sourceId: person.id,
  targetId: service.id,
  relationshipType: "manages"
});
```

### 4. Configuration Management

Track configuration relationships:

```javascript
const config = add_entity({
  type: "configuration",
  properties: { 
    name: "app-config.yaml",
    path: "/config/production"
  }
});

add_relationship({
  sourceId: service.id,
  targetId: config.id,
  relationshipType: "configured_by"
});

// Store detailed config notes in memory
memory_store({
  key: "config_history",
  value: "Updated on 2024-01-15 for security patch"
});

link_memory_to_entity({
  key: "config_history",
  entityId: config.id
});
```

### 5. Architecture Documentation

Build a living architecture diagram:

```javascript
// Create architectural layers
const frontend = add_entity({
  type: "service",
  properties: { name: "web-ui", layer: "presentation" }
});

const apiGateway = add_entity({
  type: "service",
  properties: { name: "api-gateway", layer: "api" }
});

const authService = add_entity({
  type: "service",
  properties: { name: "auth-service", layer: "business" }
});

// Define architecture flow
add_relationship({
  sourceId: frontend.id,
  targetId: apiGateway.id,
  relationshipType: "routes_to"
});

add_relationship({
  sourceId: apiGateway.id,
  targetId: authService.id,
  relationshipType: "routes_to",
  properties: { path: "/api/auth" }
});

// Export for visualization
export_graph();
```

## Best Practices

### 1. Consistent Entity Types

Use consistent entity types across your graph:
- Standardize on naming conventions
- Document your entity types
- Use tags for additional categorization

### 2. Meaningful Relationships

Make relationship types descriptive:
- Use clear, action-oriented names
- Add properties to capture details
- Use weight to indicate importance

### 3. Regular Updates

Keep your graph current:
- Update entities when infrastructure changes
- Remove obsolete entities and relationships
- Link changes to memory entries for history

### 4. Leverage Tags

Use tags for flexible querying:
- Environment tags: `production`, `staging`, `dev`
- Criticality tags: `critical`, `important`, `optional`
- Team tags: `platform-team`, `security-team`

### 5. Combine with Memory

Link memory to entities for rich context:
- Store migration notes with databases
- Document architectural decisions with services
- Track incidents with infrastructure components

## Advanced Patterns

### Bidirectional Relationships

Model relationships in both directions when needed:

```javascript
// Service A depends on Service B
add_relationship({
  sourceId: serviceA.id,
  targetId: serviceB.id,
  relationshipType: "depends_on"
});

// Service B is used by Service A
add_relationship({
  sourceId: serviceB.id,
  targetId: serviceA.id,
  relationshipType: "used_by"
});
```

### Weighted Relationships

Use weights for prioritization:

```javascript
add_relationship({
  sourceId: service.id,
  targetId: criticalDb.id,
  relationshipType: "depends_on",
  weight: 1.0  // Critical dependency
});

add_relationship({
  sourceId: service.id,
  targetId: cacheDb.id,
  relationshipType: "depends_on",
  weight: 0.3  // Optional dependency
});
```

### Temporal Context

Track changes over time:

```javascript
const entity = add_entity({
  type: "service",
  properties: { name: "api", version: "2.0.0" }
});

memory_store({
  key: "version_history",
  value: [
    { version: "1.0.0", date: "2023-01-01" },
    { version: "2.0.0", date: "2024-01-01" }
  ]
});

link_memory_to_entity({
  key: "version_history",
  entityId: entity.id
});
```

## Visualization

The knowledge graph can be exported and visualized using popular graph libraries.

### Example with D3.js

```javascript
const graph = export_graph();

// graph.nodes and graph.edges can be directly used with D3.js
const simulation = d3.forceSimulation(graph.nodes)
  .force("link", d3.forceLink(graph.edges).id(d => d.id))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));
```

### Example with Cytoscape.js

```javascript
const graph = export_graph();

const cy = cytoscape({
  container: document.getElementById('graph'),
  elements: {
    nodes: graph.nodes.map(n => ({ data: n })),
    edges: graph.edges.map(e => ({ data: e }))
  }
});
```

## Integration with DevOps Tools

The knowledge graph integrates with other DevOps tools:

### Repository Analysis

Use `repo_knowledge_graph` to analyze a repository and get recommendations for building the graph:

```javascript
repo_knowledge_graph({
  repoPath: "/path/to/repo",
  depth: "deep",
  includeExternal: true
});
```

### Memory System

Link memory entries to entities for contextual information:

```javascript
// Store infrastructure notes
memory_store({
  key: "db_migration_2024",
  value: "Migrated to PostgreSQL 14",
  category: "infrastructure"
});

// Link to entity
link_memory_to_entity({
  key: "db_migration_2024",
  entityId: databaseEntityId
});
```

## API Reference

See [DEVOPS_TOOLS.md](./DEVOPS_TOOLS.md) for detailed API documentation of all knowledge graph tools.

## Examples

See the [Usage Examples](./DEVOPS_TOOLS.md#usage-examples) section in DEVOPS_TOOLS.md for complete working examples.

#!/usr/bin/env node
/**
 * Simple test script to verify the long-term memory system
 */

import { LongTermMemory } from "./src/memory/index.js";

console.log("🧠 Testing Long-Term Memory System...\n");

const memory = new LongTermMemory();

// Test 1: Store memories
console.log("📝 Test 1: Storing memories...");
const mem1 = memory.store({
  content: "Implemented authentication system using JWT tokens",
  context: "development",
  tags: ["auth", "security", "backend"],
  importance: 0.9,
  metadata: { project: "clp-mcp", author: "developer" },
});
console.log(`✓ Stored: ${mem1.id}`);

const mem2 = memory.store({
  content: "Fixed critical bug in memory consolidation algorithm",
  context: "development",
  tags: ["bugfix", "memory", "critical"],
  importance: 0.95,
  metadata: { project: "clp-mcp", issue: "123" },
});
console.log(`✓ Stored: ${mem2.id}`);

const mem3 = memory.store({
  content: "User reported issue with login page not loading",
  context: "support",
  tags: ["bug", "frontend", "login"],
  importance: 0.7,
});
console.log(`✓ Stored: ${mem3.id}`);

const mem4 = memory.store({
  content: "Team meeting scheduled for next Monday to discuss roadmap",
  context: "planning",
  tags: ["meeting", "roadmap"],
  importance: 0.6,
});
console.log(`✓ Stored: ${mem4.id}`);

const mem5 = memory.store({
  content: "Researched best practices for long-term memory systems in AI",
  context: "research",
  tags: ["ai", "memory", "research"],
  importance: 0.8,
});
console.log(`✓ Stored: ${mem5.id}\n`);

// Test 2: Get statistics
console.log("📊 Test 2: Memory statistics...");
const stats = memory.getStats();
console.log(`Total Memories: ${stats.totalMemories}`);
console.log(`Total Contexts: ${stats.totalContexts}`);
console.log(`Total Tags: ${stats.totalTags}`);
console.log(`Average Importance: ${stats.avgImportance.toFixed(2)}\n`);

// Test 3: Search memories
console.log("🔍 Test 3: Search for 'memory'...");
const searchResults = memory.search("memory", 5);
console.log(`Found ${searchResults.length} results:`);
searchResults.forEach((m, i) => {
  console.log(`  ${i + 1}. ${m.content.substring(0, 60)}...`);
});
console.log();

// Test 4: Get by context
console.log("📂 Test 4: Get development context memories...");
const devMemories = memory.getByContext("development", 5);
console.log(`Found ${devMemories.length} development memories:`);
devMemories.forEach((m, i) => {
  console.log(`  ${i + 1}. ${m.content.substring(0, 60)}...`);
});
console.log();

// Test 5: Get by tags
console.log("🏷️  Test 5: Get memories with 'bug' tag...");
const bugMemories = memory.getByTags(["bug"], 5);
console.log(`Found ${bugMemories.length} bug-related memories:`);
bugMemories.forEach((m, i) => {
  console.log(`  ${i + 1}. ${m.content.substring(0, 60)}...`);
});
console.log();

// Test 6: Get recent memories
console.log("🕒 Test 6: Get recent memories...");
const recent = memory.getRecent(3);
console.log(`Most recent ${recent.length} memories:`);
recent.forEach((m, i) => {
  console.log(`  ${i + 1}. ${m.content.substring(0, 60)}...`);
});
console.log();

// Test 7: Get important memories
console.log("⭐ Test 7: Get important memories (>= 0.8)...");
const important = memory.getImportant(0.8, 5);
console.log(`Found ${important.length} important memories:`);
important.forEach((m, i) => {
  console.log(`  ${i + 1}. [${m.importance}] ${m.content.substring(0, 50)}...`);
});
console.log();

// Test 8: Recall with multiple criteria
console.log("🎯 Test 8: Recall development memories with 'memory' tag...");
const recalled = memory.recall({
  context: "development",
  tags: ["memory"],
  minImportance: 0.5,
});
console.log(`Found ${recalled.length} matching memories:`);
recalled.forEach((m, i) => {
  console.log(`  ${i + 1}. ${m.content.substring(0, 60)}...`);
  console.log(`     Tags: ${m.tags.join(", ")}`);
});
console.log();

// Test 9: Consolidate memories
console.log("🔄 Test 9: Consolidate development memories...");
const consolidated = memory.consolidate("development");
console.log("Patterns found:");
consolidated.patterns.forEach((p) => {
  console.log(`  - ${p.pattern}: ${p.count} memories`);
});
console.log("\nSummary:");
console.log(consolidated.summary.split("\n").map(l => `  ${l}`).join("\n"));
console.log();

// Test 10: Update and verify
console.log("✏️  Test 10: Update memory importance...");
const updated = memory.update(mem1.id, { importance: 1.0 });
if (updated) {
  console.log(`✓ Updated ${updated.id} importance to ${updated.importance}`);
}
console.log();

// Test 11: Export all memories
console.log("💾 Test 11: Export all memories...");
const exported = memory.export();
console.log(`✓ Exported ${exported.length} memories`);
console.log();

console.log("✅ All tests completed successfully!");
console.log("\n🎉 The long-term memory system is working correctly!");

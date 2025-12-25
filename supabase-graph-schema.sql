-- Knowledge Graph Schema Extensions for LoopMemory

-- Graph Nodes (Entities, Concepts, People, etc.)
CREATE TABLE IF NOT EXISTS graph_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'PERSON', 'TOPIC', 'PROJECT', 'ORGANIZATION', etc.
  metadata JSONB DEFAULT '{}'::jsonb, -- Store extra info like 'role', 'aliases'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_node_name_type UNIQUE (name, type)
);

-- Graph Edges (Relationships between Nodes)
CREATE TABLE IF NOT EXISTS graph_edges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_node_id UUID NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
  target_node_id UUID NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL, -- 'RELATED_TO', 'WORKS_ON', etc.
  weight FLOAT DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_edge UNIQUE (source_node_id, target_node_id, relation_type)
);

-- Memory to Node Relations (Linking Memories to Knowledge Graph)
-- This acts as the bridge between the Vector World (Memories) and the Graph World (Entities)
CREATE TABLE IF NOT EXISTS memory_relations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  node_id UUID NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL, -- 'MENTIONS', 'ABOUT', 'CREATED_BY'
  confidence FLOAT DEFAULT 1.0, -- Confidence score from extraction
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_memory_relation UNIQUE (memory_id, node_id, relation_type)
);

-- Indexes for fast traversal
CREATE INDEX IF NOT EXISTS idx_graph_edges_source ON graph_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_target ON graph_edges(target_node_id);
CREATE INDEX IF NOT EXISTS idx_memory_relations_memory ON memory_relations(memory_id);
CREATE INDEX IF NOT EXISTS idx_memory_relations_node ON memory_relations(node_id);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_type ON graph_nodes(type);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_name ON graph_nodes(name);

-- RLS Policies
ALTER TABLE graph_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE graph_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_relations ENABLE ROW LEVEL SECURITY;

-- For now, allow all interactions (tighten later based on user ownership if nodes are private)
-- Assuming a shared knowledge graph for the User
CREATE POLICY "Enable all access for graph_nodes" ON graph_nodes FOR ALL USING (true);
CREATE POLICY "Enable all access for graph_edges" ON graph_edges FOR ALL USING (true);
CREATE POLICY "Enable all access for memory_relations" ON memory_relations FOR ALL USING (true);

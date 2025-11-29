// Database Models
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  memory_count?: number;
}

export interface Memory {
  id: string;
  user_id: string;
  project_id?: string;
  content: string;
  source?: string;
  metadata?: Record<string, any>;
  vector_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  project_id?: string;
  title?: string;
  content: string;
  url?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// API Request/Response Types
export interface CreateMemoryRequest {
  text: string;
  source?: string;
  projectId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface CreateMemoryResponse {
  success: boolean;
  memory: Memory;
}

export interface SearchMemoriesRequest {
  query: string;
  projectId?: string;
  limit?: number;
  minScore?: number;
}

export interface SearchMemoriesResponse {
  success: boolean;
  results: Array<{
    memory: Memory;
    score: number;
  }>;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface CreateProjectResponse {
  success: boolean;
  project: Project;
}

// MCP Tool Types
export interface MCPAddMemoryArgs {
  text: string;
  source?: string;
  projectId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface MCPSearchMemoriesArgs {
  query: string;
  projectId?: string;
  limit?: number;
  minScore?: number;
}

// Vector Store Types
export interface VectorMetadata {
  userId: string;
  projectId?: string;
  memoryId: string;
  text: string;
}

export interface VectorMatch {
  id: string;
  score: number;
  metadata: VectorMetadata;
}

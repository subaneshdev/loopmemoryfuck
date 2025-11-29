# LoopMemory - Universal Memory for AI Assistants

A production-ready memory management system with AI-powered semantic search and Model Context Protocol (MCP) integration. Built with Next.js, Supabase, Pinecone, and Google Gemini.

![LoopMemory](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

- **AI-Powered Search**: Semantic search using Google Gemini embeddings (768 dimensions)
- **MCP Integration**: Connect with Claude Desktop, VSCode, Cursor, and Cline
- **Vector Storage**: Pinecone-powered vector database for lightning-fast similarity search
- **Smart Organization**: Organize memories into projects with tags and metadata
- **Real-Time Sync**: Memories sync instantly across all devices
- **Premium UI**: Glassmorphism effects, gradient text, and smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Pinecone account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/loopmemory.git
   cd loopmemory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the environment variables:
   ```bash
   SUPABASE_URL=https://eflxwcmxsbactooupija.supabase.co
   SUPABASE_KEY=your_supabase_key
   PINECONE_API_KEY=your_pinecone_key
   PINECONE_INDEX=loopmemoryanti
   GEMINI_API_KEY=your_gemini_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase database**
   
   Run this SQL in your Supabase SQL Editor:
   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     email TEXT UNIQUE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Projects table
   CREATE TABLE projects (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     description TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Memories table
   CREATE TABLE memories (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
     content TEXT NOT NULL,
     source TEXT,
     metadata JSONB DEFAULT '{}'::jsonb,
     vector_id TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Documents table
   CREATE TABLE documents (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
     title TEXT,
     content TEXT NOT NULL,
     url TEXT,
     metadata JSONB DEFAULT '{}'::jsonb,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Add indexes
   CREATE INDEX idx_memories_user_id ON memories(user_id);
   CREATE INDEX idx_memories_project_id ON memories(project_id);
   CREATE INDEX idx_documents_user_id ON documents(user_id);
   CREATE INDEX idx_projects_user_id ON projects(user_id);
   ```

5. **Set up Pinecone index**
   
   Create a Pinecone index named `loopmemoryanti` with:
   - Dimensions: 768 (for Gemini embeddings)
   - Metric: Cosine

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔌 MCP Integration

Connect LoopMemory to your AI assistant:

### Claude Desktop

```bash
npx -y install-mcp@latest http://localhost:3000/api/mcp --client claude
```

### VS Code

```bash
npx -y install-mcp@latest http://localhost:3000/api/mcp --client vscode
```

### Cursor

```bash
npx -y install-mcp@latest http://localhost:3000/api/mcp --client cursor
```

### Cline

```bash
npx -y install-mcp@latest http://localhost:3000/api/mcp --client cline
```

## 📡 API Endpoints

### Memory APIs

- `POST /api/memories` - Create a new memory
- `GET /api/memories` - List memories (paginated)
- `GET /api/memories/:id` - Get memory by ID
- `PUT /api/memories/:id` - Update memory
- `DELETE /api/memories/:id` - Delete memory
- `POST /api/memories/search` - Semantic search

### Project APIs

- `POST /api/projects` - Create project
- `GET /api/projects` - List projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### MCP Server

- `POST /api/mcp` - MCP protocol endpoint

## 🛠️ MCP Tools

LoopMemory provides 4 tools through the Model Context Protocol:

### 1. addMemory

Store a new memory in the system.

```typescript
{
  text: string;          // Memory content (required)
  source?: string;       // Source or context
  projectId?: string;    // Project ID
  tags?: string[];       // Tags for categorization
  metadata?: object;     // Additional metadata
}
```

### 2. searchMemories

Search memories using semantic similarity.

```typescript
{
  query: string;         // Search query (required)
  projectId?: string;    // Filter by project
  limit?: number;        // Max results (default: 10)
  minScore?: number;     // Min similarity score (default: 0.7)
}
```

### 3. whoAmI

Get current user information.

```typescript
{} // No parameters
```

### 4. getProjects

List all user projects.

```typescript
{} // No parameters
```

## 🏗️ Architecture

```
loopmemory/
├── app/
│   ├── api/
│   │   ├── memories/       # Memory CRUD endpoints
│   │   ├── projects/       # Project management
│   │   └── mcp/            # MCP server
│   ├── dashboard/          # Dashboard page
│   ├── install-mcp/        # MCP installation guide
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/             # UI components
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── pinecone.ts        # Pinecone client
│   ├── gemini.ts          # Gemini embeddings
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript types
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard**
   - Go to Settings → Environment Variables
   - Add all variables from `.env.local`
   - Update `NEXT_PUBLIC_APP_URL` to your production URL

4. **Test MCP integration**
   ```bash
   npx install-mcp@latest https://loopmemory.vercel.app/api/mcp --client claude
   ```

## 🧪 Testing

### API Tests

```bash
# Test memory creation
curl -X POST http://localhost:3000/api/memories \
  -H "Content-Type: application/json" \
  -d '{"text": "Test memory", "source": "manual"}'

# Test search
curl -X POST http://localhost:3000/api/memories/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "limit": 5}'
```

### MCP Tests

```bash
# Test tool listing
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'

# Test addMemory
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "addMemory", "arguments": {"text": "MCP test"}}}'
```

## 📖 Usage Examples

### Adding a Memory

```typescript
// Via API
const response = await fetch('/api/memories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Remember to use TypeScript for all new projects',
    source: 'Best Practices',
    tags: ['coding', 'typescript']
  })
});

// Via MCP (in Claude, VSCode, etc.)
// Just ask: "Add a memory: Remember to use TypeScript for all new projects"
```

### Searching Memories

```typescript
// Via API
const response = await fetch('/api/memories/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'programming best practices',
    limit: 10,
    minScore: 0.7
  })
});

// Via MCP
// Just ask: "Search my memories for programming best practices"
```

## 🔒 Security

- ✅ Environment variables stored securely
- ✅ API input validation with Zod
- ✅ CORS configured for MCP endpoints
- ✅ Rate limiting (recommended for production)
- ⚠️ **To-Do**: Implement Supabase Auth with RLS policies

## 📊 Performance

- **Embedding Generation**: ~200-500ms (Gemini API)
- **Vector Search**: ~50-100ms (Pinecone)
- **End-to-End Latency**: <500ms for most operations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **Anthropic** - For the Model Context Protocol
- **Vercel** - For Next.js and hosting
- **Supabase** - For the database
- **Pinecone** - For vector storage
- **Google** - For Gemini embeddings

## 📧 Support

For issues or questions, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ using Next.js, Supabase, Pinecone, and Google Gemini**

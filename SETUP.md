# LoopMemory Setup Guide

## ✅ Completed Steps

1. ✅ Next.js project created
2. ✅ Dependencies installed
3. ✅ Environment variables configured
4. ✅ Code pushed to GitHub: https://github.com/subaneshdev/loopmemoryfuck

## 🔧 Next Steps

### Step 1: Initialize Supabase Database

Your Supabase project is ready:
- **Project ID**: `ztzjgddyyypbegobzuuz`
- **URL**: https://ztzjgddyyypbegobzuuz.supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/ztzjgddyyypbegobzuuz

**To set up the database:**

1. **Go to SQL Editor**:
   - Visit: https://supabase.com/dashboard/project/ztzjgddyyypbegobzuuz/sql/new
   
2. **Copy and paste this SQL**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memories table
CREATE TABLE IF NOT EXISTS memories (
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
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_memories_user_id ON memories(user_id);
CREATE INDEX IF NOT EXISTS idx_memories_project_id ON memories(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies (permissive for testing)
CREATE POLICY "Enable all access for users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all access for projects" ON projects FOR ALL USING (true);
CREATE POLICY "Enable all access for memories" ON memories FOR ALL USING (true);
CREATE POLICY "Enable all access for documents" ON documents FOR ALL USING (true);

-- Insert default user
INSERT INTO users (id, email)
VALUES ('00000000-0000-0000-0000-000000000000', 'default-user@loopmemory.app')
ON CONFLICT (email) DO NOTHING;
```

3. **Click "Run"** to execute the SQL

4. **Verify tables created**:
   - Go to Table Editor: https://supabase.com/dashboard/project/ztzjgddyyypbegobzuuz/editor
   - You should see: `users`, `projects`, `memories`, `documents`

---

### Step 2: Set Up Pinecone Index

1. **Go to Pinecone**: https://app.pinecone.io/

2. **Create a new index**:
   - Name: `loopmemoryanti`
   - Dimensions: **768** (for Gemini embeddings)
   - Metric: **Cosine**
   - Cloud: AWS (recommended)
   - Region: us-east-1 (or closest to you)

3. **Wait for index to be ready** (usually 1-2 minutes)

---

### Step 3: Test Locally

Restart your dev server to pick up the new Supabase credentials:

```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

Then test:

1. **Visit**: http://localhost:3000
2. **Go to Dashboard**: http://localhost:3000/dashboard
3. **Add a memory**: Click "Add Memory" button
4. **Search**: Try searching for the memory you just added

**Test API directly**:
```bash
# Create a memory
curl -X POST http://localhost:3000/api/memories \
  -H "Content-Type: application/json" \
  -d '{"text": "I love building with Next.js and TypeScript", "source": "preference"}'

# Search memories
curl -X POST http://localhost:3000/api/memories/search \
  -H "Content-Type: application/json" \
  -d '{"query": "what do I like to build with", "limit": 5}'
```

---

### Step 4: Deploy to Vercel

#### Option A: Vercel Dashboard (Easiest)

1. **Go to Vercel**: https://vercel.com/new
2. **Import Git Repository**:
   - Select: `subaneshdev/loopmemoryfuck`
3. **Configure Environment Variables**:
   ```
   SUPABASE_URL=https://ztzjgddyyypbegobzuuz.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0empnZGR5eXlwYmVnb2J6dXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzOTU1NDksImV4cCI6MjA3OTk3MTU0OX0.hzqzEYs1GUEpIlyd1Z4wP8_t78GSuF5McZLNOopBKQI
   PINECONE_API_KEY=91eb8dc21104ff104e2fa9da58b15bcf
   PINECONE_INDEX=loopmemoryanti
   GEMINI_API_KEY=AIzaSyAc_tLpmsrxPnYgd2gN__J-zHYNGIQXZGw
   NEXT_PUBLIC_APP_URL=https://loopmemory.vercel.app
   ```
4. **Click Deploy**

#### Option B: Vercel CLI

```bash
vercel --prod
```

When prompted, configure the environment variables.

---

### Step 5: Test MCP Integration

Once deployed, install the MCP integration:

```bash
# For Claude Desktop
npx -y install-mcp@latest https://loopmemory.vercel.app/api/mcp --client claude
```

**Test in Claude**:
- "Add a memory: I successfully deployed LoopMemory to production"
- "Search my memories for deployment"
- "What projects do I have?"

---

## 🎯 Quick Checklist

- [ ] Run SQL in Supabase SQL Editor
- [ ] Create Pinecone index `loopmemoryanti` (768 dimensions, Cosine)
- [ ] Test locally at http://localhost:3000
- [ ] Deploy to Vercel
- [ ] Add environment variables in Vercel
- [ ] Test production at https://loopmemory.vercel.app
- [ ] Install MCP integration with Claude

---

## 📚 Resources

- **Your Supabase Dashboard**: https://supabase.com/dashboard/project/ztzjgddyyypbegobzuuz
- **Your GitHub Repo**: https://github.com/subaneshdev/loopmemoryfuck
- **Pinecone Dashboard**: https://app.pinecone.io/
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## 🆘 Troubleshooting

### Dev server not connecting to Supabase
```bash
# Restart dev server
npm run dev
```

### Memories not saving
- Check Supabase tables are created
- Verify Pinecone index exists
- Check browser console for errors

### MCP not working
- Ensure production URL is live
- Check `/api/mcp` endpoint returns tools list
- Verify CORS headers are configured

---

## ✨ You're Almost There!

Just need to:
1. Run the SQL in Supabase (2 minutes)
2. Create Pinecone index (2 minutes)
3. Deploy to Vercel (5 minutes)

Total time: **~10 minutes** and your LoopMemory will be live! 🚀

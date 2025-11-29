# Deployment Instructions for LoopMemory

This guide will help you deploy LoopMemory to Vercel in minutes.

## Prerequisites

- GitHub account
- Vercel account (free tier is fine)
- All environment variables ready (Supabase, Pinecone, Gemini)

## Quick Deploy

### Option 1: Vercel CLI (Fastest)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Add Environment Variables**
   
   After deployment, go to your Vercel dashboard:
   - Navigate to your project → Settings → Environment Variables
   - Add these variables:
     - `SUPABASE_URL` = `https://eflxwcmxsbactooupija.supabase.co`
     - `SUPABASE_KEY` = `your_supabase_anon_key`
     - `PINECONE_API_KEY` = `your_pinecone_api_key`
     - `PINECONE_INDEX` = `loopmemoryanti`
     - `GEMINI_API_KEY` = `your_gemini_api_key`
     - `NEXT_PUBLIC_APP_URL` = `https://loopmemory.vercel.app`

5. **Redeploy**
   ```bash
   vercel --prod
   ```

### Option 2: GitHub + Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables (same as above)
   - Click "Deploy"

## Post-Deployment Setup

### 1. Verify Deployment

Visit `https://loopmemory.vercel.app` and check:
- ✅ Landing page loads
- ✅ Dashboard is accessible
- ✅ No console errors

### 2. Test API Endpoints

```bash
# Test memory creation
curl -X POST https://loopmemory.vercel.app/api/memories \
  -H "Content-Type: application/json" \
  -d '{"text": "Production test memory"}'

# Test MCP tools list
curl -X POST https://loopmemory.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'
```

### 3. Install MCP Integration

```bash
# For Claude Desktop
npx -y install-mcp@latest https://loopmemory.vercel.app/api/mcp --client claude

# For VSCode
npx -y install-mcp@latest https://loopmemory.vercel.app/api/mcp --client vscode

# For Cursor
npx -y install-mcp@latest https://loopmemory.vercel.app/api/mcp --client cursor

# For Cline
npx -y install-mcp@latest https://loopmemory.vercel.app/api/mcp --client cline
```

### 4. Test MCP in Claude

Open Claude Desktop and try:
- "Add a memory: I deployed LoopMemory to production successfully"
- "Search my memories for deployment"

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Ensure all dependencies are in `package.json`
- Check build logs in Vercel dashboard

### API Errors
- Verify Supabase database schema is created
- Confirm Pinecone index exists with correct dimensions (768)
- Check API keys are valid

### MCP Connection Issues
- Ensure `/api/mcp` endpoint returns tools list
- Check CORS headers are configured
- Verify URL is correct (https, not http)

## Environment Variables Reference

| Variable | Value | Notes |
|----------|-------|-------|
| `SUPABASE_URL` | `https://your-project.supabase.co` | From Supabase dashboard |
| `SUPABASE_KEY` | `eyJhbG...` | Anon/public key |
| `PINECONE_API_KEY` | `91eb8d...` | From Pinecone dashboard |
| `PINECONE_INDEX` | `loopmemoryanti` | Must be created first |
| `GEMINI_API_KEY` | `AIzaSy...` | From Google AI Studio |
| `NEXT_PUBLIC_APP_URL` | `https://loopmemory.vercel.app` | Your Vercel domain |

## Custom Domain (Optional)

1. Go to Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update `NEXT_PUBLIC_APP_URL` to your custom domain
4. Redeploy

## Monitoring

- **Vercel Analytics**: Enable in project settings for traffic insights
- **Error Logs**: View in Vercel dashboard → Logs
- **API Usage**: Monitor Pinecone and Gemini usage in their dashboards

## Security Checklist

Before going to production:
- [ ] Environment variables are set (not hardcoded)
- [ ] Supabase RLS policies are configured
- [ ] Rate limiting is enabled (recommended)
- [ ] CORS is properly configured
- [ ] API keys are rotated regularly

## Success!

Your LoopMemory instance is now live at `https://loopmemory.vercel.app`! 🎉

Visit the installation page to connect it to your AI assistants:
https://loopmemory.vercel.app/install-mcp

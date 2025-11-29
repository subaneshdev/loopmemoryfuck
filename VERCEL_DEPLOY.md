# Deploy LoopMemory to Vercel - Quick Guide

## ✅ Your Code is Ready!

- ✅ Code pushed to GitHub: https://github.com/subaneshdev/loopmemoryfuck
- ✅ Latest commit includes all fixes
- ✅ Application builds successfully locally

---

## 🚀 Deploy to Vercel (2 Options)

### Option 1: Vercel Dashboard (Recommended - Easiest)

**Step 1: Go to Vercel**
Visit: https://vercel.com/new

**Step 2: Import Your Repository**
1. Click "Add New Project"
2. Select "Import Git Repository"
3. Choose: `subaneshdev/loopmemoryfuck`
4. Click "Import"

**Step 3: Configure Project**
- Framework Preset: Next.js (auto-detected)
- Root Directory: `./` (default)
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)

**Step 4: Add Environment Variables**

Click "Environment Variables" and add these **one by one**:

```
SUPABASE_URL
https://ztzjgddyyypbegobzuuz.supabase.co

SUPABASE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0empnZGR5eXlwYmVnb2J6dXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzOTU1NDksImV4cCI6MjA3OTk3MTU0OX0.hzqzEYs1GUEpIlyd1Z4wP8_t78GSuF5McZLNOopBKQI

PINECONE_API_KEY
91eb8dc21104ff104e2fa9da58b15bcf

PINECONE_INDEX
loopmemoryanti

GEMINI_API_KEY
AIzaSyAc_tLpmsrxPnYgd2gN__J-zHYNGIQXZGw

NEXT_PUBLIC_APP_URL
https://loopmemory.vercel.app
```

> **Note**: Make sure to set all variables for "Production", "Preview", and "Development" environments

**Step 5: Deploy**
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://loopmemoryfuck.vercel.app`

**Step 6: Set Custom Domain (Optional)**
1. Go to Project Settings → Domains
2. Add domain: `loopmemory.vercel.app`
3. Vercel will configure it automatically

---

### Option 2: Vercel CLI

**Install Vercel CLI:**
```bash
npm i -g vercel
```

**Login:**
```bash
vercel login
```

**Deploy:**
```bash
vercel --prod
```

When prompted, add the environment variables listed above.

---

## 📋 Post-Deployment Checklist

After deployment succeeds:

### 1. Verify Deployment
- [ ] Visit your Vercel URL
- [ ] Check landing page loads
- [ ] Navigate to `/dashboard`
- [ ] Check for console errors (F12)

### 2. Test API Endpoints

```bash
# Replace with your actual Vercel URL
VERCEL_URL="https://loopmemoryfuck.vercel.app"

# Test memory creation
curl -X POST $VERCEL_URL/api/memories \
  -H "Content-Type: application/json" \
  -d '{"text": "Production deployment test", "source": "vercel"}'

# Test MCP tools
curl -X POST $VERCEL_URL/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'
```

### 3. Install MCP Integration

```bash
# For Claude Desktop
npx -y install-mcp@latest https://YOUR-VERCEL-URL.vercel.app/api/mcp --client claude

# For VSCode
npx -y install-mcp@latest https://YOUR-VERCEL-URL.vercel.app/api/mcp --client vscode
```

### 4. Update URLs (if using custom domain)

If you set up `loopmemory.vercel.app`, update in Vercel:
- Go to Settings → Environment Variables
- Update `NEXT_PUBLIC_APP_URL` to `https://loopmemory.vercel.app`
- Redeploy (Deployments → ... → Redeploy)

---

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify no syntax errors in code

### API Errors
- Ensure Supabase SQL schema has been run
- Verify Pinecone index exists (name: `loopmemoryanti`, dimension: 768)
- Check environment variables are correct

### MCP Not Working
- Verify `/api/mcp` endpoint returns tool list
- Check CORS headers are configured
- Ensure production URL is used in installation command

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Vercel build completes successfully
- ✅ Landing page loads at your domain
- ✅ Dashboard is accessible
- ✅ You can add and search memories
- ✅ MCP tools show up in Claude Desktop
- ✅ Claude can add/search your memories

---

## 📞 Next Steps

1. **Deploy using Option 1** (Vercel Dashboard)
2. **Run Supabase SQL** if you haven't already
3. **Create Pinecone index** if needed
4. **Test the app** at your Vercel URL
5. **Install MCP** with Claude Desktop

---

## 🔗 Important Links

- **GitHub**: https://github.com/subaneshdev/loopmemoryfuck
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase**: https://supabase.com/dashboard/project/ztzjgddyyypbegobzuuz
- **Pinecone**: https://app.pinecone.io/

---

**Ready to deploy! Follow Option 1 above - it's the easiest method.** 🚀

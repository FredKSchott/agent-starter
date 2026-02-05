# Wrangler static assets deployment setup

**Session ID:** ses_3d33f7450ffe935iUZeyr1P5jy
**Created:** 2/4/2026, 11:42:22 PM
**Updated:** 2/4/2026, 11:50:30 PM

---

## User

I'm currently in a wrangler cloudflare project. I see a @wrangler.jsonc file, but it only defines a @src/server.ts entrypoint. How are the static assets built by vite included in the final deployment, alongside the server? I don't ese any logic connecting the Vite-built SPA into the deployment.

---

## Assistant

Looking at your Cloudflare Wrangler project configuration, I can see how the static assets are connected to the deployment. Let me explain:

## How Static Assets Are Integrated

The key is in **wrangler.jsonc:11-13**:

```jsonc
"assets": {
  "directory": "public"
}
```

This configuration tells Wrangler to serve static files from the `public` directory automatically. Here's how it works:

### The Architecture

1. **Wrangler's Assets feature** (introduced in Workers) automatically serves static files from the specified directory
2. Your `server.ts` handles dynamic routes (like the agent API endpoints)
3. For any request that doesn't match your Worker's routes, Wrangler automatically serves files from `public/` if they exist

### The Flow

```
Incoming Request
    ↓
server.ts Worker (src/server.ts:112-133)
    ↓
routeAgentRequest() checks if it's an agent API call
    ↓
    ├─ Match → Handle via Chat Durable Object
    │
    └─ No match → Return null (line 129)
              ↓
         404 response OR...
              ↓
    Wrangler Assets takes over (automatic)
              ↓
    Serves file from public/ directory
```

### Where Vite Fits In

To verify this setup, let me check if there's a build script that outputs to `public/`:

**Tool: read**

**Tool: glob**

---

## Assistant

**Tool: read**

---

## Assistant

Perfect! Now I can give you the complete picture:

## Complete Integration Flow

### 1. **Build Process** (package.json:10)
```bash
vite build && wrangler deploy
```

### 2. **Vite + Cloudflare Plugin** (vite.config.ts:8)
The `@cloudflare/vite-plugin` is the magic connector! This plugin:
- Builds your React/Vite SPA and outputs it to the `public/` directory
- Bundles your Worker code (`src/server.ts`)
- Configures everything to work together seamlessly

### 3. **Asset Serving** (wrangler.jsonc:11-13)
```jsonc
"assets": {
  "directory": "public"
}
```
Wrangler serves the Vite-built files from `public/`

### 4. **Request Routing**
```
User Request
    ↓
┌─────────────────────────────────┐
│  Cloudflare Worker              │
│  (src/server.ts)                │
├─────────────────────────────────┤
│  /api/agents/* → Chat DO        │
│  /check-open-ai-key → JSON      │
│  /* (everything else)           │
└──────────┬──────────────────────┘
           ↓
    ┌──────────────┐
    │ Assets       │
    │ (public/)    │
    │              │
    │ index.html   │
    │ *.js, *.css  │
    └──────────────┘
```

## The Key Insight

The **`@cloudflare/vite-plugin`** handles the integration automatically:
- It knows to build the client-side code to `public/`
- It knows to bundle the Worker separately
- It coordinates with Wrangler's asset serving

You don't see explicit logic connecting them because the Vite plugin abstracts all of that away! The combination of:
1. `@cloudflare/vite-plugin` in vite.config.ts
2. `assets.directory` in wrangler.jsonc
3. `main` pointing to your Worker in wrangler.jsonc

...is all you need for a unified deployment where:
- Static assets (SPA) are served via Cloudflare's asset serving
- Dynamic routes are handled by your Worker
- Both deploy together as a single application

---


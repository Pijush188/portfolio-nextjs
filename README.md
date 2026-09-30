# Pijush Das — Portfolio

Interactive portfolio built with Next.js (App Router, TypeScript) and three.js.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
npm run typecheck
```

## Layout

```
app/                layout (fonts, metadata), page (composition), globals.css
styles/             the original stylesheet split by concern, imported in order
components/
  PortfolioProvider shared UI state: ready, menu, hovered project, detail panel
  layout/           Loader, Topbar, MenuOverlay, SectionDots, Cursor, Backdrop
  sections/         Hero, About, Work, Contact, Footer
  work/             ProjectItem, Peek (hover preview), ProjectDetail (panel)
  scene/            Scene (canvas) + createScene (three.js, lazy-loaded chunk) + sun shader
  ui/               BrowserWindow, icons, ExternalLink
lib/                project data, site links, pointer store, scroller, media/reveal hooks
public/projects/    project screenshots (previously inlined as base64)
```

Edit projects in `lib/projects.ts`; the contact email lives in `lib/site.ts`
(still the `your.email@example.com` placeholder from the original).

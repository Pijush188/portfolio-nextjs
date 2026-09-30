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
  sections/         Hero, About, Experience, Projects, Skills, Education, Contact, Footer
  skills/           SkillRow, SkillPeek (hover card)
  experience/       CaseItem, CasePeek, CaseDetail, Pipeline, CaseVisual
    visuals/        canvas simulations: topology (RCA), pid (tile scan), chat (sessions)
  work/             ProjectItem, Peek (hover preview), ProjectDetail (panel)
  scene/            Scene + createScene (three.js, lazy chunk): hero galaxy → sun → planets join per section (solarSystem.ts)
  ui/               BrowserWindow, icons, ExternalLink
lib/                cases, projects, profile (skills/education), site links, hooks
public/projects/    project screenshots (previously inlined as base64)
```

Content lives in `lib/`: case studies in `cases.ts`, side projects in `projects.ts`,
roles/skills/education in `profile.ts`, links in `site.ts`.

Planet textures: [Solar System Scope](https://www.solarsystemscope.com/textures/), CC BY 4.0 (resized, in `public/textures/`).

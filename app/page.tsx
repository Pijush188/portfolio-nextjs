import { PortfolioProvider } from "@/components/PortfolioProvider";
import { CaseDetail } from "@/components/experience/CaseDetail";
import { CasePeek } from "@/components/experience/CasePeek";
import { Backdrop } from "@/components/layout/Backdrop";
import { Cursor } from "@/components/layout/Cursor";
import { Legibility } from "@/components/layout/Legibility";
import { Loader } from "@/components/layout/Loader";
import { MenuOverlay } from "@/components/layout/MenuOverlay";
import { SectionDots } from "@/components/layout/SectionDots";
import { Topbar } from "@/components/layout/Topbar";
import { Scene } from "@/components/scene/Scene";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { SkillPeek } from "@/components/skills/SkillPeek";
import { Peek } from "@/components/work/Peek";
import { ProjectDetail } from "@/components/work/ProjectDetail";

export default function Home() {
  return (
    <PortfolioProvider>
      <Scene />
      <Backdrop />
      <Loader />
      <Topbar />
      <SectionDots />
      <MenuOverlay />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Peek />
      <CasePeek />
      <SkillPeek />
      <ProjectDetail />
      <CaseDetail />
      <Cursor />
      <Legibility />
    </PortfolioProvider>
  );
}

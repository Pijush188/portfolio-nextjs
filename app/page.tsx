import { PortfolioProvider } from "@/components/PortfolioProvider";
import { Backdrop } from "@/components/layout/Backdrop";
import { Cursor } from "@/components/layout/Cursor";
import { Loader } from "@/components/layout/Loader";
import { MenuOverlay } from "@/components/layout/MenuOverlay";
import { SectionDots } from "@/components/layout/SectionDots";
import { Topbar } from "@/components/layout/Topbar";
import { Scene } from "@/components/scene/Scene";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
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
        <Work />
        <Contact />
      </main>
      <Peek />
      <ProjectDetail />
      <Cursor />
    </PortfolioProvider>
  );
}

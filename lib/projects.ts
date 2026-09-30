export type Project = {
  id: string;
  name: string;
  sub: string;
  host: string;
  url: string;
  repo: string | null;
  kind: string;
  desc: string;
  note?: string;
  tags: string[];
  img: string;
  /** Auto-scroll speed of the screenshot, in px/s at an 800px-wide viewport. */
  speed: number;
};

export const PROJECTS: Project[] = [
  {
    id: "vision",
    name: "Vision Pro UI",
    sub: "Scroll animation clone",
    host: "apple-vision-ui.vercel.app",
    url: "https://apple-vision-ui.vercel.app/",
    repo: "https://github.com/Pijush188/apple-vision-ui",
    kind: "Frontend clone / Open source",
    desc: "A recreation of Apple's Vision Pro launch page. Scrolling drives everything: pinned sections, video scrubbing and product reveals, all timed to match the original.",
    tags: ["JavaScript", "GSAP", "ScrollTrigger", "Locomotive Scroll"],
    img: "/projects/vision.jpg",
    speed: 120,
  },
  {
    id: "cassava",
    name: "Cassava Leaf Detection",
    sub: "Deep learning web app",
    host: "cassava-leaf-lfqk.vercel.app",
    url: "https://cassava-leaf-lfqk.vercel.app/",
    repo: null,
    kind: "Machine learning / Web app",
    desc: "Upload a photo of a cassava leaf and a trained image classifier identifies the disease, then suggests how to treat it. Built so a farmer can check a plant from a phone.",
    note: "The analysis server was offline when this preview was captured, so the demo currently stops at the upload step.",
    tags: ["Python", "Image classification", "CNN", "Vercel"],
    img: "/projects/cassava.jpg",
    speed: 40,
  },
  {
    id: "youtube",
    name: "VidTube",
    sub: "YouTube clone in React",
    host: "you-tube-clone-iota-six.vercel.app",
    url: "https://you-tube-clone-iota-six.vercel.app/",
    repo: "https://github.com/Pijush188/YouTube-Clone",
    kind: "React app / Open source",
    desc: "A YouTube-style video browser built with React. Category sidebar, a live feed of trending videos with view counts and upload times, and a responsive grid.",
    tags: ["React", "JavaScript", "REST API", "Responsive"],
    img: "/projects/youtube.jpg",
    speed: 90,
  },
];

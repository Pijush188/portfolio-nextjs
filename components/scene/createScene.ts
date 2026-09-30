import * as THREE from "three";
import { ease } from "@/lib/ease";
import { pointer } from "@/lib/pointer";
import { SECTIONS } from "@/lib/site";
import { sunFragment, sunVertex } from "./sunShader";

// Match the original three r128 output: no colour management, linear output.
THREE.ColorManagement.enabled = false;

/** Scene keyframes indexed by section progress 0..3 (hero, about, work, contact). */
const KF = [
  { tilt: 1.08, gx: 0, gy: 0, gz: 0, gs: 1, go: 1, sx: 6, sy: -3, sz: -10, ss: 0 },
  { tilt: 0.6, gx: 3.1, gy: 0.1, gz: -1.5, gs: 1.05, go: 0.85, sx: 6, sy: -3, sz: -10, ss: 0 },
  { tilt: 0.9, gx: 3.6, gy: 0.6, gz: -7, gs: 0.9, go: 0.45, sx: 2.6, sy: -0.6, sz: -2, ss: 0.35 },
  { tilt: 1.1, gx: 5, gy: 1.2, gz: -12, gs: 0.8, go: 0.25, sx: 2.2, sy: -0.3, sz: 0.2, ss: 0.95 },
];
type Frame = (typeof KF)[number];

function lerpKF(p: number): Frame {
  const i = Math.min(Math.floor(p), KF.length - 2);
  const t = ease(Math.min(Math.max(p - i, 0), 1));
  const a = KF[i],
    b = KF[i + 1];
  const o = {} as Frame;
  for (const k in a) {
    const key = k as keyof Frame;
    o[key] = a[key] + (b[key] - a[key]) * t;
  }
  return o;
}

function glowTexture(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, inner);
  gr.addColorStop(0.25, inner);
  gr.addColorStop(1, outer);
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

/** Continuous 0..3 progress through the sections, measured at the viewport centre. */
function sectionProgress(secs: HTMLElement[]) {
  const c = scrollY + innerHeight * 0.5;
  const centers = secs.map((el, i) =>
    i === 0 ? innerHeight * 0.5 : el.offsetTop + Math.min(el.offsetHeight, innerHeight) * 0.5,
  );
  if (c <= centers[0]) return 0;
  for (let i = 0; i < centers.length - 1; i++) {
    if (c < centers[i + 1]) return i + (c - centers[i]) / (centers[i + 1] - centers[i]);
  }
  return centers.length - 1;
}

export type SceneHandle = { startIntro(): void; dispose(): void };

export function createScene(canvas: HTMLCanvasElement, reduce: boolean): SceneHandle | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 200);
  camera.position.set(0, 0, 7);
  let t0 = performance.now();
  const dot = glowTexture("rgba(255,255,255,1)", "rgba(255,255,255,0)");
  const disposables: { dispose(): void }[] = [dot];

  // galaxy
  const N = innerWidth < 700 ? 26000 : 60000,
    arms = 3,
    R = 5.2;
  const pos = new Float32Array(N * 3),
    col = new Float32Array(N * 3);
  const cIn = new THREE.Color("#ffd7a3"),
    cMid = new THREE.Color("#d98cb8"),
    cOut = new THREE.Color("#5a63d8");
  for (let i = 0; i < N; i++) {
    const r = Math.pow(Math.random(), 1.6) * R;
    const branch = ((i % arms) / arms) * Math.PI * 2,
      spin = r * 1.15;
    const rnd = (p: number) => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * p * (r * 0.5 + 0.25);
    pos[i * 3] = Math.cos(branch + spin) * r + rnd(0.9);
    pos[i * 3 + 1] = rnd(0.35) * 0.6;
    pos[i * 3 + 2] = Math.sin(branch + spin) * r + rnd(0.9);
    const t = r / R,
      c = t < 0.4 ? cIn.clone().lerp(cMid, t / 0.4) : cMid.clone().lerp(cOut, (t - 0.4) / 0.6);
    const dim = 0.55 + Math.random() * 0.45;
    col[i * 3] = c.r * dim;
    col[i * 3 + 1] = c.g * dim;
    col[i * 3 + 2] = c.b * dim;
  }
  const gg = new THREE.BufferGeometry();
  gg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  gg.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const galaxyMat = new THREE.PointsMaterial({
    size: 0.045,
    map: dot,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 1,
  });
  const galaxy = new THREE.Group();
  galaxy.add(new THREE.Points(gg, galaxyMat));
  const coreTex = glowTexture("rgba(255,220,170,.95)", "rgba(255,150,80,0)");
  const coreMat = new THREE.SpriteMaterial({
    map: coreTex,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  });
  const core = new THREE.Sprite(coreMat);
  core.scale.set(2.1, 2.1, 1);
  galaxy.add(core);
  scene.add(galaxy);
  disposables.push(gg, galaxyMat, coreTex, coreMat);

  // background stars
  const SN = 3500,
    sp = new Float32Array(SN * 3);
  for (let i = 0; i < SN; i++) {
    const r = 30 + Math.random() * 60,
      th = Math.random() * Math.PI * 2,
      ph = Math.acos(2 * Math.random() - 1);
    sp[i * 3] = r * Math.sin(ph) * Math.cos(th);
    sp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    sp[i * 3 + 2] = r * Math.cos(ph);
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const starMat = new THREE.PointsMaterial({
    size: 0.22,
    map: dot,
    color: 0xcfd6ff,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const stars = new THREE.Points(sg, starMat);
  scene.add(stars);
  disposables.push(sg, starMat);

  // sun
  const sunMat = new THREE.ShaderMaterial({
    uniforms: { uT: { value: 0 } },
    vertexShader: sunVertex,
    fragmentShader: sunFragment,
  });
  const sunGeo = new THREE.SphereGeometry(1, 64, 64);
  const sun = new THREE.Mesh(sunGeo, sunMat);
  const glowTex = glowTexture("rgba(255,170,70,.55)", "rgba(255,120,40,0)");
  const glowMat = new THREE.SpriteMaterial({
    map: glowTex,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const sunGlow = new THREE.Sprite(glowMat);
  sun.add(sunGlow);
  sunGlow.scale.set(5.2, 5.2, 1);
  scene.add(sun);
  disposables.push(sunMat, sunGeo, glowTex, glowMat);

  let mob = innerWidth < 720;
  const onResize = () => {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    mob = innerWidth < 720;
  };
  addEventListener("resize", onResize);

  const secs = SECTIONS.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
  let sceneProgress = 0,
    raf = 0;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    sceneProgress += (sectionProgress(secs) - sceneProgress) * 0.06;
    const k = lerpKF(sceneProgress),
      t = Math.max(now - t0, 0) / 1000;
    const intro = Math.min(t / 3.2, 1);
    galaxy.rotation.x = k.tilt + (1 - ease(intro)) * 0.46;
    galaxy.rotation.y = t * (reduce ? 0.004 : 0.035);
    galaxy.rotation.z = 0.18;
    const mxN = pointer.x / innerWidth - 0.5,
      myN = pointer.y / innerHeight - 0.5;
    galaxy.position.set(mob ? k.gx * 0.35 : k.gx, k.gy, k.gz);
    const gs = k.gs * (0.35 + 0.65 * ease(intro)) * (mob ? 0.78 : 1);
    galaxy.scale.set(gs, gs, gs);
    galaxyMat.opacity = k.go;
    sun.position.set(mob ? k.sx * 0.4 : k.sx, mob ? k.sy - 1.2 : k.sy, k.sz);
    sun.scale.setScalar(Math.max(k.ss, 0.0001));
    sun.visible = k.ss > 0.01;
    sun.rotation.y = t * 0.05;
    sunMat.uniforms.uT.value = t;
    stars.rotation.y = t * 0.004 + mxN * 0.05;
    stars.rotation.x = myN * 0.04;
    camera.position.x += (mxN * 0.5 - camera.position.x) * 0.04;
    camera.position.y += (-myN * 0.35 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return {
    // Restart the clock when the loader lifts so the galaxy's intro zoom is seen.
    startIntro: () => {
      t0 = performance.now();
    },
    dispose() {
      cancelAnimationFrame(raf);
      removeEventListener("resize", onResize);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}

import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ease } from "@/lib/ease";
import { lights } from "@/lib/lightField";
import { pointer } from "@/lib/pointer";
import { SECTIONS } from "@/lib/site";
import { glowTexture } from "./glow";
import { createSolarSystem } from "./solarSystem";

// Match the original three r128 output: no colour management, linear output.
THREE.ColorManagement.enabled = false;

/**
 * One keyframe per section (hero, about, experience, projects, skills, education, contact).
 *   hero        the galaxy
 *   about       the galaxy steps back; the sun rises on the right, close up
 *   experience… the view pulls back as the planets join, one by one, in orbit order
 *   education   the last planet arrives: the whole system is built
 *   contact     a slow swing round to a higher angle on the finished system
 * g* galaxy; tilt/roll orient the orbital plane; ax is how much of the right half the
 * system may fill; cx/cy place its centre (fractions of the half-width/height);
 * pc is how many planets are in orbit; bloom is the glow strength.
 */
const KF = [
  { gt: 1.08, gx: 0, gy: 0, gz: 0, gs: 1, go: 1, co: 1, tilt: 0.22, roll: 0.05, ax: 0.4, cx: 0.55, cy: 0, pc: 0, bloom: 0 },
  { gt: 0.7, gx: -4.5, gy: 1.6, gz: -14, gs: 0.95, go: 0.35, co: 0.4, tilt: 0.22, roll: 0.05, ax: 0.4, cx: 0.55, cy: 0, pc: 0, bloom: 0.55 },
  { gt: 0.8, gx: -5.5, gy: 2.4, gz: -20, gs: 0.9, go: 0.18, co: 0.1, tilt: 0.36, roll: 0.12, ax: 0.42, cx: 0.54, cy: -0.04, pc: 3, bloom: 0.5 },
  { gt: 0.9, gx: -6, gy: 2.8, gz: -22, gs: 0.9, go: 0.16, co: 0.06, tilt: 0.48, roll: -0.08, ax: 0.43, cx: 0.54, cy: 0.05, pc: 5, bloom: 0.5 },
  { gt: 1, gx: -6.2, gy: 3.1, gz: -23, gs: 0.9, go: 0.14, co: 0.05, tilt: 0.42, roll: 0.14, ax: 0.44, cx: 0.54, cy: -0.05, pc: 7, bloom: 0.5 },
  { gt: 1.1, gx: -6.4, gy: 3.3, gz: -24, gs: 0.9, go: 0.14, co: 0.05, tilt: 0.56, roll: -0.06, ax: 0.52, cx: 0.5, cy: 0.03, pc: 8, bloom: 0.5 },
  { gt: 1.15, gx: -6.6, gy: 3.5, gz: -25, gs: 0.85, go: 0.14, co: 0.05, tilt: 0.78, roll: 0.16, ax: 0.56, cx: 0.46, cy: 0, pc: 8, bloom: 0.55 },
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

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

/** Continuous 0..N-1 progress through the sections, measured at the viewport centre. */
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

  // the solar system
  const solar = createSolarSystem(renderer);
  scene.add(solar.system);
  disposables.push(...solar.disposables);

  // bloom for the sun; skipped entirely while it is off (hero) and on phones
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), 0.6, 0.5, 0.88);
  composer.addPass(bloom);
  disposables.push(composer, bloom);

  let mob = innerWidth < 720;
  const onResize = () => {
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);
    bloom.resolution.set(innerWidth / 2, innerHeight / 2);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    mob = innerWidth < 720;
  };
  addEventListener("resize", onResize);

  // Project the bright objects to screen space so page text can adapt its halo.
  const tmp = new THREE.Vector3(),
    right = new THREE.Vector3();
  const toScreen = (world: THREE.Vector3, worldR: number, i: number) => {
    tmp.copy(world).project(camera);
    if (tmp.z > 1) return; // behind the camera
    const x = ((tmp.x + 1) / 2) * innerWidth,
      y = ((1 - tmp.y) / 2) * innerHeight;
    tmp.copy(world).addScaledVector(right, worldR).project(camera);
    const r = Math.abs(((tmp.x + 1) / 2) * innerWidth - x);
    if (r > 1 && i > 0.01) lights.push({ x, y, r, i });
  };

  const secs = SECTIONS.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
  const Z = -3; // depth of the system's centre
  let sceneProgress = 0,
    raf = 0,
    last = 0,
    view = 2.1; // radius being framed, eased as planets arrive

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    sceneProgress += (sectionProgress(secs) - sceneProgress) * 0.06;
    const p = sceneProgress;
    const k = lerpKF(p),
      t = Math.max(now - t0, 0) / 1000,
      dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    const intro = Math.min(t / 3.2, 1);

    galaxy.rotation.x = k.gt + (1 - ease(intro)) * 0.46;
    galaxy.rotation.y = t * (reduce ? 0.004 : 0.035);
    galaxy.rotation.z = 0.18;
    const mxN = pointer.x / innerWidth - 0.5,
      myN = pointer.y / innerHeight - 0.5;
    galaxy.position.set(mob ? k.gx * 0.35 : k.gx, k.gy, k.gz);
    const gs = k.gs * (0.35 + 0.65 * ease(intro)) * (mob ? 0.78 : 1);
    galaxy.scale.set(gs, gs, gs);
    galaxyMat.opacity = k.go;
    coreMat.opacity = k.co;

    // solar system: the sun rises in as the hero ends, then planets join per section
    const sunIn = smooth(0.25, 0.95, p);
    const target = solar.update(reduce ? 0 : t, dt, sunIn, k.pc, reduce);
    view = reduce ? target : view + (target - view) * Math.min(dt * 1.1, 1);

    const halfH = (camera.position.z - Z) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const halfW = halfH * camera.aspect;
    const avail = mob
      ? halfW * 0.92
      : Math.min(k.ax * halfW, (halfH * 0.9) / Math.max(Math.sin(k.tilt) + 0.18, 0.4));
    const cx = mob ? 0 : Math.min(k.cx * halfW, halfW * 0.97 - avail);
    const cy = mob ? -halfH * 0.12 : k.cy * halfH;
    const scale = avail / (view * 1.18); // margin: the near side of a tilted orbit projects wider
    solar.system.position.set(cx, cy, Z);
    solar.system.scale.setScalar(scale);
    solar.system.rotation.set(k.tilt, 0, k.roll);

    lights.length = 0;
    right.setFromMatrixColumn(camera.matrixWorld, 0);
    toScreen(galaxy.position, 5.2 * gs * 0.95, 0.6 * k.go);
    toScreen(galaxy.position, 2.1 * gs * 0.6, 0.95 * k.co);
    if (solar.system.visible) {
      const sunR = scale * smooth(0, 1, sunIn);
      toScreen(solar.system.position, sunR * 1.05, 0.95);
      toScreen(solar.system.position, sunR * 3, 0.4);
    }

    stars.rotation.y = t * 0.004 + mxN * 0.05;
    stars.rotation.x = myN * 0.04;
    camera.position.x += (mxN * 0.5 - camera.position.x) * 0.04;
    camera.position.y += (-myN * 0.35 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    const glow = mob ? 0 : k.bloom * sunIn;
    if (glow > 0.02) {
      bloom.strength = glow;
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
  };
  raf = requestAnimationFrame(frame);

  return {
    // Restart the clock when the loader lifts so the galaxy's intro zoom is seen.
    startIntro: () => {
      t0 = performance.now();
    },
    dispose() {
      cancelAnimationFrame(raf);
      lights.length = 0;
      removeEventListener("resize", onResize);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}

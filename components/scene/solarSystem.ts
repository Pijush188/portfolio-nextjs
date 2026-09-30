import * as THREE from "three";
import { glowTexture } from "./glow";

/**
 * The solar system, built up over the page: the sun first, then the planets join one
 * by one in orbit order. Sizes and distances are stylised (not to scale) so the whole
 * system reads on one screen. Textures: Solar System Scope (CC BY 4.0), NASA-based.
 */
type BodySpec = {
  name: string;
  tex: string;
  size: number;
  orbit: number;
  /** Axial tilt, radians. */
  tilt: number;
  spin: number;
  atmo?: { color: string; scale: number; power: number };
  clouds?: string;
  ring?: { tex: string; inner: number; outer: number };
  moon?: { tex: string; size: number; orbit: number };
};

export const BODIES: BodySpec[] = [
  { name: "Mercury", tex: "mercury.jpg", size: 0.2, orbit: 1.85, tilt: 0.01, spin: 0.2 },
  { name: "Venus", tex: "venus_atmosphere.jpg", size: 0.32, orbit: 2.65, tilt: 0.05, spin: 0.1, atmo: { color: "#ffd9a0", scale: 1.06, power: 3 } },
  {
    name: "Earth",
    tex: "earth_daymap.jpg",
    size: 0.34,
    orbit: 3.55,
    tilt: 0.41,
    spin: 0.5,
    clouds: "earth_clouds.jpg",
    atmo: { color: "#6fa8ff", scale: 1.08, power: 2.6 },
    moon: { tex: "moon.jpg", size: 0.27, orbit: 1.9 },
  },
  { name: "Mars", tex: "mars.jpg", size: 0.25, orbit: 4.4, tilt: 0.44, spin: 0.48, atmo: { color: "#ff9a6a", scale: 1.05, power: 4 } },
  { name: "Jupiter", tex: "jupiter.jpg", size: 0.72, orbit: 5.8, tilt: 0.05, spin: 0.9 },
  { name: "Saturn", tex: "saturn.jpg", size: 0.6, orbit: 7.3, tilt: 0.47, spin: 0.85, ring: { tex: "saturn_ring.png", inner: 1.25, outer: 2.3 } },
  { name: "Uranus", tex: "uranus.jpg", size: 0.44, orbit: 8.6, tilt: 1.71, spin: 0.6, atmo: { color: "#a8f0ff", scale: 1.07, power: 3 } },
  { name: "Neptune", tex: "neptune.jpg", size: 0.42, orbit: 9.7, tilt: 0.49, spin: 0.62, atmo: { color: "#6f8dff", scale: 1.07, power: 3 } },
];

const NOISE = /* glsl */ `
float h(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float n(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h(i), h(i + vec3(1,0,0)), f.x), mix(h(i + vec3(0,1,0)), h(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h(i + vec3(0,0,1)), h(i + vec3(1,0,1)), f.x), mix(h(i + vec3(0,1,1)), h(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fbm(vec3 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++){ v += a * n(p); p *= 2.03; a *= .5; } return v; }
`;

const sunVertex = /* glsl */ `
varying vec2 vUv; varying vec3 vN; varying vec3 vP;
void main(){ vUv = uv; vP = position; vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`;
const sunFragment = /* glsl */ `
uniform sampler2D uMap; uniform float uT; varying vec2 vUv; varying vec3 vN; varying vec3 vP;
${NOISE}
void main(){
  vec3 tex = texture2D(uMap, vUv + vec2(uT * 0.003, 0.)).rgb;
  float boil = fbm(vP * 6.0 + vec3(0., uT * 0.25, uT * 0.15));
  vec3 c = tex * (0.8 + 0.45 * boil);
  float mu = max(dot(normalize(vN), vec3(0., 0., 1.)), 0.);
  c *= 0.45 + 0.55 * pow(mu, 0.5);                       // limb darkening
  c += vec3(1., 0.45, 0.12) * pow(1. - mu, 2.4) * 0.55;  // hot rim
  gl_FragColor = vec4(c * 1.05, 1.);
}`;

const atmoVertex = /* glsl */ `
varying vec3 vN; varying vec3 vV;
void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`;
const atmoFragment = /* glsl */ `
uniform vec3 uColor; uniform float uPower; uniform float uO; varying vec3 vN; varying vec3 vV;
void main(){ float f = pow(1. - abs(dot(normalize(vN), normalize(vV))), uPower); gl_FragColor = vec4(uColor * f * 1.4, f * uO); }`;

const smoothstep = (x: number) => x * x * (3 - 2 * x);

export function createSolarSystem(renderer: THREE.WebGLRenderer) {
  const loader = new THREE.TextureLoader();
  const aniso = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  const disposables: { dispose(): void }[] = [];
  const load = (file: string, onLoad?: () => void) => {
    const t = loader.load(`/textures/${file}`, onLoad);
    t.anisotropy = aniso;
    disposables.push(t);
    return t;
  };

  const system = new THREE.Group();
  const sphere = new THREE.SphereGeometry(1, 72, 48);
  disposables.push(sphere);

  // --- sun
  const sunGroup = new THREE.Group();
  system.add(sunGroup);
  let sunReady = false;
  const sunMat = new THREE.ShaderMaterial({
    uniforms: { uMap: { value: load("sun.jpg", () => (sunReady = true)) }, uT: { value: 0 } },
    vertexShader: sunVertex,
    fragmentShader: sunFragment,
  });
  const sunGeo = new THREE.SphereGeometry(1, 96, 64);
  const sun = new THREE.Mesh(sunGeo, sunMat);
  sunGroup.add(sun);
  const coronaInner = glowTexture("rgba(255,200,120,.75)", "rgba(255,120,40,0)");
  const coronaOuter = glowTexture("rgba(255,150,70,.35)", "rgba(255,90,30,0)");
  const corona = [
    { tex: coronaInner, scale: 2.9, o: 0.55 },
    { tex: coronaOuter, scale: 6, o: 0.45 },
  ].map(({ tex, scale, o }) => {
    const m = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const s = new THREE.Sprite(m);
    s.scale.setScalar(scale);
    sunGroup.add(s);
    disposables.push(m);
    return { s, m, o };
  });
  disposables.push(sunMat, sunGeo, coronaInner, coronaOuter);

  const light = new THREE.PointLight(0xfff1dd, 3.6, 0, 0);
  system.add(light);
  const ambient = new THREE.AmbientLight(0xffffff, 0.9);
  system.add(ambient);

  // --- planets
  const bodies = BODIES.map((b, i) => {
    const pivot = new THREE.Group();
    system.add(pivot);
    const holder = new THREE.Group();
    pivot.add(holder);
    const tiltG = new THREE.Group();
    tiltG.rotation.z = b.tilt;
    holder.add(tiltG);

    let ready = false;
    const mat = new THREE.MeshStandardMaterial({ map: load(b.tex, () => (ready = true)), roughness: 1, metalness: 0 });
    const mesh = new THREE.Mesh(sphere, mat);
    tiltG.add(mesh);
    disposables.push(mat);

    let clouds: THREE.Mesh | null = null;
    if (b.clouds) {
      const cm = new THREE.MeshStandardMaterial({ alphaMap: load(b.clouds), color: 0xffffff, transparent: true, depthWrite: false, roughness: 1 });
      clouds = new THREE.Mesh(sphere, cm);
      clouds.scale.setScalar(1.015);
      tiltG.add(clouds);
      disposables.push(cm);
    }

    let atmoMat: THREE.ShaderMaterial | null = null;
    if (b.atmo) {
      atmoMat = new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Color(b.atmo.color) }, uPower: { value: b.atmo.power }, uO: { value: 1 } },
        vertexShader: atmoVertex,
        fragmentShader: atmoFragment,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      });
      const atmo = new THREE.Mesh(sphere, atmoMat);
      atmo.scale.setScalar(b.atmo.scale);
      tiltG.add(atmo);
      disposables.push(atmoMat);
    }

    let ringMat: THREE.MeshBasicMaterial | null = null;
    if (b.ring) {
      const ringGeo = new THREE.RingGeometry(b.ring.inner, b.ring.outer, 160, 1);
      // map u across the ring's width so the strip texture runs from inner to outer edge
      const pos = ringGeo.attributes.position,
        uv = ringGeo.attributes.uv;
      for (let k = 0; k < pos.count; k++) {
        const r = Math.hypot(pos.getX(k), pos.getY(k));
        uv.setXY(k, (r - b.ring.inner) / (b.ring.outer - b.ring.inner), 0.5);
      }
      ringMat = new THREE.MeshBasicMaterial({ map: load(b.ring.tex), transparent: true, side: THREE.DoubleSide, depthWrite: false, color: 0xd8d0c0 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      tiltG.add(ring);
      disposables.push(ringGeo, ringMat);
    }

    let moonPivot: THREE.Group | null = null;
    if (b.moon) {
      moonPivot = new THREE.Group();
      const mm = new THREE.MeshStandardMaterial({ map: load(b.moon.tex), roughness: 1 });
      const moon = new THREE.Mesh(sphere, mm);
      moon.scale.setScalar(b.moon.size);
      moon.position.x = b.moon.orbit;
      moonPivot.add(moon);
      holder.add(moonPivot);
      disposables.push(mm);
    }

    const orbitPts = Array.from({ length: 257 }, (_, k) => {
      const a = (k / 256) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * b.orbit, 0, Math.sin(a) * b.orbit);
    });
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
    const orbitMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
    system.add(new THREE.Line(orbitGeo, orbitMat));
    disposables.push(orbitGeo, orbitMat);

    return {
      spec: b,
      pivot,
      holder,
      mesh,
      clouds,
      atmoMat,
      ringMat,
      moonPivot,
      orbitMat,
      ready: () => ready,
      a: 0,
      angle: 1.3 + i * 2.1,
      speed: 0.9 * Math.pow(b.orbit, -1.5),
    };
  });

  return {
    system,
    bodies,
    /**
     * sunIn 0..1 fades the sun in; count (continuous, 0..8) is how many planets should be
     * in orbit. Planets chase that over time and each waits for the previous one to be well
     * on its way, so they always arrive one at a time, spiralling in from outside.
     * Returns the radius the camera should frame to show everything present.
     */
    update(t: number, dt: number, sunIn: number, count: number, instant: boolean) {
      const s = smoothstep(Math.min(Math.max(sunIn, 0), 1));
      system.visible = s > 0.001;
      sun.visible = sunReady;
      sunGroup.scale.setScalar(Math.max(s, 0.0001));
      sun.rotation.y = t * 0.03;
      sunMat.uniforms.uT.value = t;
      corona.forEach(({ s: sp, m, o }, k) => {
        m.opacity = o * s * (0.9 + 0.1 * Math.sin(t * (1.3 + k)));
        sp.material.rotation = t * (k ? -0.02 : 0.03);
      });

      let prev = 1,
        frame = 2.1;
      bodies.forEach((b, i) => {
        const want = Math.min(Math.max(count - i, 0), 1) >= 0.5 && prev > 0.4 ? 1 : 0;
        if (instant) b.a = want;
        else b.a += Math.sign(want - b.a) * Math.min(Math.abs(want - b.a), dt * 0.6);
        prev = b.a;
        const e = smoothstep(b.a);
        const visible = e > 0.001 && b.ready();
        b.pivot.visible = visible;
        b.orbitMat.opacity = 0.09 * e;
        if (!visible) return;
        b.angle += dt * b.speed;
        b.pivot.rotation.y = b.angle - (1 - e) * 1.6;
        b.holder.position.x = b.spec.orbit * (1 + 1.1 * (1 - e) * (1 - e));
        b.holder.scale.setScalar(Math.max(b.spec.size * e, 0.0001));
        b.mesh.rotation.y = t * b.spec.spin;
        if (b.clouds) b.clouds.rotation.y = t * b.spec.spin * 1.15;
        if (b.moonPivot) b.moonPivot.rotation.y = t * 0.8;
        if (b.atmoMat) b.atmoMat.uniforms.uO.value = e;
        if (b.ringMat) b.ringMat.opacity = e;
        frame = Math.max(frame, b.spec.orbit * (0.55 + 0.45 * e) + b.spec.size * (b.spec.ring ? 2.3 : 1.5));
      });
      return frame;
    },
    disposables,
  };
}

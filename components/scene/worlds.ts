import * as THREE from "three";

/** Shared noise for the planet surfaces. */
const NOISE = /* glsl */ `
float h(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float n(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h(i), h(i + vec3(1,0,0)), f.x), mix(h(i + vec3(0,1,0)), h(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h(i + vec3(0,0,1)), h(i + vec3(1,0,1)), f.x), mix(h(i + vec3(0,1,1)), h(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fbm(vec3 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a * n(p); p *= 2.03; a *= .5; } return v; }
`;

const vertex = /* glsl */ `
varying vec3 vP; varying vec3 vN; varying vec3 vW;
void main(){
  vP = position;
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const fragment = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; uniform vec3 uAtmo; uniform vec3 uLight; uniform float uType; uniform float uT; uniform float uDim;
varying vec3 vP; varying vec3 vN; varying vec3 vW;
${NOISE}
void main(){
  vec3 p = normalize(vP);
  vec3 c;
  if (uType < 0.5) {
    // gas giant: turbulent latitude bands
    float warp = fbm(p * 3.0 + vec3(uT * 0.02, 0.0, 0.0));
    float bands = sin(p.y * 14.0 + warp * 5.0) * 0.5 + 0.5;
    c = mix(uA, uB, smoothstep(0.2, 0.8, bands));
    c = mix(c, uA * 1.25, smoothstep(0.62, 0.9, fbm(p * 7.0)) * 0.35);
  } else if (uType < 1.5) {
    // rocky: mottled plains and dark basins
    float f = fbm(p * 4.0);
    c = mix(uB, uA, smoothstep(0.35, 0.7, f));
    c *= 0.75 + 0.35 * fbm(p * 14.0);
  } else {
    // ocean world: seas, continents, drifting clouds
    float land = smoothstep(0.52, 0.56, fbm(p * 2.6));
    c = mix(uA, uB, land);
    float cloud = smoothstep(0.55, 0.75, fbm(p * 4.0 + vec3(uT * 0.03, 0.0, uT * 0.02)));
    c = mix(c, vec3(0.92), cloud * 0.8);
  }
  vec3 nrm = normalize(vN);
  vec3 v = normalize(cameraPosition - vW);
  float d = dot(nrm, normalize(uLight));
  float lit = smoothstep(-0.2, 0.7, d);
  float rim = pow(1.0 - max(dot(nrm, v), 0.0), 2.6);
  vec3 col = c * (0.05 + 1.05 * lit) + uAtmo * rim * (0.25 + 0.9 * lit);
  gl_FragColor = vec4(col * uDim, 1.0);
}`;

const ringFragment = /* glsl */ `
uniform vec3 uA; uniform float uDim; varying vec2 vUv2; varying float vR;
void main(){
  float b = 0.55 + 0.45 * sin(vR * 60.0) * sin(vR * 17.0);
  float edge = smoothstep(0.0, 0.08, vR) * smoothstep(1.0, 0.85, vR);
  gl_FragColor = vec4(uA * b * uDim, 0.55 * edge * b);
}`;
const ringVertex = /* glsl */ `
uniform float uInner; uniform float uOuter; varying vec2 vUv2; varying float vR;
void main(){
  vUv2 = uv;
  vR = (length(position.xy) - uInner) / (uOuter - uInner);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export type WorldSpec = {
  a: string;
  b: string;
  atmo: string;
  type: 0 | 1 | 2;
  ring?: boolean;
  /** Axial tilt (radians). */
  tilt: number;
};

const LIGHT = new THREE.Vector3(-0.65, 0.45, 0.6).normalize();

export function createWorld(spec: WorldSpec, dot: THREE.Texture) {
  const group = new THREE.Group();
  const geo = new THREE.SphereGeometry(1, 96, 64);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uA: { value: new THREE.Color(spec.a) },
      uB: { value: new THREE.Color(spec.b) },
      uAtmo: { value: new THREE.Color(spec.atmo) },
      uLight: { value: LIGHT },
      uType: { value: spec.type },
      uT: { value: 0 },
      uDim: { value: 1 },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
  });
  const body = new THREE.Mesh(geo, mat);
  const spin = new THREE.Group();
  spin.rotation.z = spec.tilt;
  spin.add(body);
  group.add(spin);

  // soft atmosphere halo behind the disc
  const haloMat = new THREE.SpriteMaterial({
    map: dot,
    color: new THREE.Color(spec.atmo),
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const halo = new THREE.Sprite(haloMat);
  halo.scale.setScalar(3.1);
  halo.position.z = -0.4;
  group.add(halo);

  const disposables: { dispose(): void }[] = [geo, mat, haloMat];
  let ringMat: THREE.ShaderMaterial | null = null;
  if (spec.ring) {
    const inner = 1.35,
      outer = 2.25;
    const ringGeo = new THREE.RingGeometry(inner, outer, 128, 1);
    ringMat = new THREE.ShaderMaterial({
      uniforms: { uA: { value: new THREE.Color(spec.atmo) }, uInner: { value: inner }, uOuter: { value: outer }, uDim: { value: 1 } },
      vertexShader: ringVertex,
      fragmentShader: ringFragment,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2 + 0.32;
    spin.add(ring);
    disposables.push(ringGeo, ringMat);
  }

  return {
    group,
    update(t: number, dim: number) {
      body.rotation.y = t * 0.06;
      mat.uniforms.uT.value = t;
      mat.uniforms.uDim.value = dim;
      haloMat.opacity = 0.22 * dim;
      if (ringMat) ringMat.uniforms.uDim.value = dim;
    },
    disposables,
  };
}

export const sunVertex = /* glsl */ `
varying vec3 vN; varying vec3 vP;
void main(){ vN=normalize(normalMatrix*normal); vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;

/** Domain-warped fbm surface with a hot rim. */
export const sunFragment = /* glsl */ `
uniform float uT; varying vec3 vN; varying vec3 vP;
float h(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float n(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm(vec3 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*n(p); p*=2.03; a*=.5; } return v; }
void main(){ vec3 p=vP*3.2+vec3(uT*.12,uT*.05,0.); float f=fbm(p+fbm(p*1.5+uT*.1));
  vec3 c=mix(vec3(.55,.12,.02),vec3(1.,.55,.12),f); c=mix(c,vec3(1.,.9,.55),pow(f,3.)*1.6);
  float rim=pow(1.-max(dot(vN,vec3(0,0,1)),0.),2.); c+=vec3(1.,.5,.15)*rim*.9;
  gl_FragColor=vec4(c,1.); }`;

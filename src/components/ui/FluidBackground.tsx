import React, { useRef, useEffect } from "react";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface FluidBackgroundProps {
  style?: React.CSSProperties;
  /** 0 = Chrome, 1 = Ribs, 2 = Fins, 3 = Abyss, 4 = Halftone */
  patternStyle?: 0 | 1 | 2 | 3 | 4;
  // Chrome colors
  colorDark?: string;
  colorMid?: string;
  colorLight?: string;
  // Ribs colors
  ribBase?: string;
  ribHigh1?: string;
  ribHigh2?: string;
  // Fins colors
  finBase?: string;
  finMid?: string;
  finHigh?: string;
  // Abyss colors
  abyssBase?: string;
  abyssMid?: string;
  abyssHigh?: string;
  // Web / Halftone colors
  webBase?: string;
  webMid?: string;
  webHigh?: string;
  // Behavior
  speed?: number;
  scale?: number;
  distortion?: number;
  brightness?: number;
  refraction?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a CSS hex color string to a normalised THREE.Color (linear). */
function hexToColor(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

// ---------------------------------------------------------------------------
// Shaders
// ---------------------------------------------------------------------------

const VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = /* glsl */ `
uniform int uStyle;
uniform float uTime;
uniform vec2 uResolution;

// Style Colors
uniform vec3 uChromeDark;  uniform vec3 uChromeMid;   uniform vec3 uChromeLight;
uniform vec3 uRibBase;     uniform vec3 uRibHigh1;    uniform vec3 uRibHigh2;
uniform vec3 uFinBase;     uniform vec3 uFinMid;      uniform vec3 uFinHigh;
uniform vec3 uAbyssBase;   uniform vec3 uAbyssMid;    uniform vec3 uAbyssHigh;
uniform vec3 uWebBase;     uniform vec3 uWebMid;      uniform vec3 uWebHigh;

uniform float uSpeed;
uniform float uScale;
uniform float uDistortion;
uniform float uBrightness;
uniform float uRefraction;

varying vec2 vUv;

float skewedTri(float x, float s) {
    float f = fract(x);
    float val = f < s ? (f / s) : (1.0 - (f - s) / (1.0 - s));
    return smoothstep(0.0, 1.0, val);
}

float mapChrome(vec2 p, float t) {
    float a = 0.6; mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
    p = rot * p; p.x *= 0.35; p.y *= 1.4;
    float h = 0.0, amp = 1.0, freq = 1.8;
    vec2 q = p;
    for(int i = 0; i < 5; i++) {
        q += vec2(sin(q.y * 1.2 + t * 0.6), cos(q.x * 1.4 - t * 0.5)) * uDistortion * 0.15;
        h += sin(q.y * freq + t * 0.8) * amp;
        q *= 1.4;
        mat2 rot2 = mat2(cos(0.35), -sin(0.35), sin(0.35), cos(0.35));
        q = rot2 * q; amp *= 0.45;
    }
    return h;
}

float mapRibs(vec2 p, float t) {
    float a = -0.55; mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
    vec2 q = rot * p;
    q.x += sin(q.y * 1.5 + t * 0.3) * 0.1 * uDistortion;
    q.x += sin(q.y * 3.0 - t * 0.2) * 0.05 * uDistortion;
    return sin(q.x * 25.0 * uScale) * 0.15;
}

float mapFins(vec2 p, float t) {
    float a = -0.6; mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
    vec2 q = rot * p;
    q.x += sin(q.y * 1.2 + t * 0.25) * 0.2 * uDistortion;
    q.y += cos(q.x * 1.0 - t * 0.2) * 0.2 * uDistortion;
    float phase = q.x * 3.5 * uScale + sin(q.y * 2.0 * uScale) * 1.5;
    float fin = skewedTri(phase, 0.85);
    float pocketPhase = q.y * 4.0 * uScale + q.x * 2.0;
    float pocket = smoothstep(0.1, 0.9, sin(pocketPhase - t * 1.0) * 0.5 + 0.5);
    return (fin * mix(0.15, 1.0, pocket) + sin(q.x * 1.5) * 0.15) * 0.35;
}

float mapAbyss(vec2 p, float t) {
    vec2 q = p; float h = 0.0, amp = 1.0;
    q.x += sin(t * 0.2) * 0.5; q.y += cos(t * 0.15) * 0.5;
    for(int i = 0; i < 5; i++) {
        float angle = h * 2.5 + t * 0.4;
        q += vec2(cos(angle), sin(angle)) * 0.2 * uDistortion;
        h += sin(q.x * 1.4 + t * 0.3) * cos(q.y * 1.4 - t * 0.2) * amp;
        q *= 1.5; q = mat2(cos(0.6), -sin(0.6), sin(0.6), cos(0.6)) * q;
        amp *= 0.55;
    }
    return h;
}

float mapWeb(vec2 p, float t) {
    vec2 q = p;
    q += vec2(t * 0.15, -t * 0.1);
    float h = 0.0;
    float amp = 1.0;
    for(int i = 0; i < 3; i++) {
        float warpX = sin(q.y * 1.2 + t * 0.8) * uDistortion * 0.3;
        float warpY = cos(q.x * 1.1 - t * 0.6) * uDistortion * 0.3;
        q += vec2(warpX, warpY);
        h += sin(q.x * 1.5) * cos(q.y * 1.5) * amp;
        q = mat2(cos(0.6), -sin(0.6), sin(0.6), cos(0.6)) * q * 1.4;
        amp *= 0.5;
    }
    return h;
}

void main() {
    vec2 p = vUv * 2.0 - 1.0;
    p.x *= uResolution.x / uResolution.y;
    p *= uScale;
    float t = uTime * uSpeed * 0.5;
    vec3 finalColor = vec3(0.0);

    if (uStyle == 0) {
        // Chrome
        float h = mapChrome(p, t);
        vec2 eps = vec2(0.01, 0.0);
        float nx = mapChrome(p + eps.xy, t) - h;
        float ny = mapChrome(p + eps.yx, t) - h;
        vec3 normal = normalize(vec3(nx, ny, 0.008));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 ref = reflect(-viewDir, normal);
        ref.xy += normal.xy * uRefraction * 0.05;
        float topLight = smoothstep(0.1, 0.7, ref.y);
        float bottomLight = smoothstep(-0.2, -0.6, ref.y) * 0.2;
        float sideLight1 = smoothstep(0.6, 0.9, ref.x) * 0.4;
        float sideLight2 = smoothstep(0.6, 0.9, -ref.x) * 0.2;
        float lightTube = smoothstep(0.9, 0.98, sin(ref.y * 12.0)) * 0.5;
        float totalReflection = topLight + bottomLight + sideLight1 + sideLight2 + lightTube;
        vec3 color = mix(uChromeDark, uChromeMid, smoothstep(-0.8, 0.8, h));
        color = mix(color, uChromeLight, smoothstep(0.3, 1.1, totalReflection));
        vec3 halfDir = normalize(normalize(vec3(0.5, 1.5, 1.0)) + viewDir);
        color += uChromeLight * pow(max(dot(normal, halfDir), 0.0), 80.0) * uBrightness;
        color *= mix(0.15, 1.0, smoothstep(-1.2, 1.0, h));
        color *= smoothstep(1.0, 0.2, length(vUv - 0.5) * 0.7);
        finalColor = color;
    } else if (uStyle == 1) {
        // Ribs
        float h = mapRibs(p, t);
        vec2 eps = vec2(0.01, 0.0);
        float nx = mapRibs(p + eps.xy, t) - h;
        float ny = mapRibs(p + eps.yx, t) - h;
        vec3 normal = normalize(vec3(nx, ny, 0.03));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 color = uRibBase;
        float areaOrange = smoothstep(1.5, -0.5, p.x + p.y);
        float areaBlue = smoothstep(-1.5, 0.5, p.x + p.y);
        color += uRibHigh2 * smoothstep(0.0, 0.8, -normal.x) * areaOrange * 2.0;
        color += uRibHigh1 * smoothstep(0.0, 0.8, normal.x) * areaBlue * 2.0;
        vec3 halfDir = normalize(normalize(vec3(0.5, 0.5, 1.0)) + viewDir);
        color += vec3(1.0) * pow(max(dot(normal, halfDir), 0.0), 50.0) * uBrightness * 0.5;
        color *= mix(0.1, 1.0, smoothstep(-0.15, 0.15, h));
        color *= smoothstep(1.2, 0.2, length(vUv - 0.5) * 0.8);
        finalColor = color;
    } else if (uStyle == 2) {
        // Fins
        float h = mapFins(p, t);
        vec2 eps = vec2(0.01, 0.0);
        float nx = mapFins(p + eps.xy, t) - h;
        float ny = mapFins(p + eps.yx, t) - h;
        vec3 normal = normalize(vec3(nx, ny, 0.05));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 lightDir1 = normalize(vec3(-0.8, 1.0, 0.8));
        float diff1 = max(dot(normal, lightDir1), 0.0);
        vec3 color = mix(uFinBase, uFinMid, smoothstep(-0.05, 0.35, h + diff1 * 0.3));
        color = mix(color, uFinHigh, smoothstep(0.5, 0.95, diff1));
        color += uFinHigh * pow(max(dot(normal, normalize(lightDir1 + viewDir)), 0.0), 40.0) * uBrightness * 0.8;
        color += mix(uFinMid, vec3(1.0), 0.5) * pow(max(dot(normal, normalize(normalize(vec3(1.0, -1.0, 0.4)) + viewDir)), 0.0), 20.0) * uBrightness * 0.3;
        color *= mix(0.15, 1.0, smoothstep(0.0, 0.12, h));
        color *= smoothstep(1.3, 0.2, length(vUv - 0.5) * 0.8);
        finalColor = color;
    } else if (uStyle == 3) {
        // Abyss
        float h = mapAbyss(p, t);
        vec2 eps = vec2(0.01, 0.0);
        float nx = mapAbyss(p + eps.xy, t) - h;
        float ny = mapAbyss(p + eps.yx, t) - h;
        vec3 normal = normalize(vec3(nx, ny, 0.2));
        vec2 rUV = p + normal.xy * uRefraction * 0.1;
        vec2 gUV = p + normal.xy * uRefraction * 0.05;
        vec2 bUV = p;
        float hR = mapAbyss(rUV, t);
        float hG = mapAbyss(gUV, t);
        float hB = mapAbyss(bUV, t);
        vec3 color = uAbyssBase;
        float avgH = (hR + hG + hB) / 3.0;
        color = mix(color, uAbyssMid, smoothstep(-0.5, 0.5, avgH));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 halfDir = normalize(normalize(vec3(0.5, 0.8, 1.0)) + viewDir);
        float spec = pow(max(dot(normal, halfDir), 0.0), 30.0);
        color += uAbyssHigh * vec3(smoothstep(0.1, 1.0, hR), smoothstep(0.1, 1.0, hG), smoothstep(0.1, 1.0, hB)) * uBrightness * 0.8;
        color += vec3(1.0) * spec * uBrightness * 0.3;
        color *= mix(0.1, 1.0, smoothstep(-0.8, 0.4, avgH));
        color *= smoothstep(1.3, 0.1, length(vUv - 0.5) * 0.8);
        finalColor = color;
    } else {
        // Halftone
        float h = mapWeb(p, t);
        float luma = smoothstep(-1.2, 1.2, h);
        luma = pow(luma, 1.5);
        luma = smoothstep(0.0, 0.9, luma);
        vec2 screenUv = vUv * uResolution;
        float angle = 0.785398;
        mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        vec2 grid = rot * screenUv;
        float freq = 1.2;
        grid *= freq;
        float dotPattern = (sin(grid.x) + sin(grid.y)) * 0.5;
        dotPattern = dotPattern * 0.5 + 0.5;
        float aa = 0.05;
        float mask = smoothstep(dotPattern - aa, dotPattern + aa, luma);
        vec3 color = mix(uWebBase, uWebMid, smoothstep(0.0, 0.6, luma));
        color = mix(color, uWebHigh, mask);
        color += uWebHigh * smoothstep(0.7, 1.0, luma) * 0.15;
        color *= smoothstep(1.5, 0.1, length(vUv - 0.5) * 0.9);
        finalColor = color * uBrightness;
    }
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const FluidBackground: React.FC<FluidBackgroundProps> = ({
  style,
  patternStyle = 3,
  // Chrome defaults
  colorDark = "#1a1a2e",
  colorMid = "#4a4a6a",
  colorLight = "#e0e0ff",
  // Ribs defaults
  ribBase = "#0a0a1a",
  ribHigh1 = "#3b82f6",
  ribHigh2 = "#f97316",
  // Fins defaults
  finBase = "#0a0a1a",
  finMid = "#1e3a5f",
  finHigh = "#60a5fa",
  // Abyss defaults
  abyssBase = "#050510",
  abyssMid = "#0a1a3d",
  abyssHigh = "#8b5cf6",
  // Web / Halftone defaults
  webBase = "#0a0a1a",
  webMid = "#1a1a3e",
  webHigh = "#a78bfa",
  // Behavior defaults
  speed = 0.3,
  scale = 1,
  distortion = 2.5,
  brightness = 1.5,
  refraction = 1,
  className,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Keep a mutable ref to current props so the animation loop always reads
  // the latest values without triggering effect re-runs.
  const propsRef = useRef({
    patternStyle,
    colorDark,
    colorMid,
    colorLight,
    ribBase,
    ribHigh1,
    ribHigh2,
    finBase,
    finMid,
    finHigh,
    abyssBase,
    abyssMid,
    abyssHigh,
    webBase,
    webMid,
    webHigh,
    speed,
    scale,
    distortion,
    brightness,
    refraction,
  });

  // Sync latest props into the ref on every render.
  useEffect(() => {
    propsRef.current = {
      patternStyle,
      colorDark,
      colorMid,
      colorLight,
      ribBase,
      ribHigh1,
      ribHigh2,
      finBase,
      finMid,
      finHigh,
      abyssBase,
      abyssMid,
      abyssHigh,
      webBase,
      webMid,
      webHigh,
      speed,
      scale,
      distortion,
      brightness,
      refraction,
    };
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ---- Renderer ---------------------------------------------------------
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // ---- Scene & Camera ---------------------------------------------------
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // ---- Shader Material --------------------------------------------------
    const uniforms: Record<string, THREE.IUniform> = {
      uStyle: { value: propsRef.current.patternStyle },
      uTime: { value: 0.0 },
      uResolution: {
        value: new THREE.Vector2(container.clientWidth, container.clientHeight),
      },
      // Chrome
      uChromeDark: { value: hexToColor(propsRef.current.colorDark) },
      uChromeMid: { value: hexToColor(propsRef.current.colorMid) },
      uChromeLight: { value: hexToColor(propsRef.current.colorLight) },
      // Ribs
      uRibBase: { value: hexToColor(propsRef.current.ribBase) },
      uRibHigh1: { value: hexToColor(propsRef.current.ribHigh1) },
      uRibHigh2: { value: hexToColor(propsRef.current.ribHigh2) },
      // Fins
      uFinBase: { value: hexToColor(propsRef.current.finBase) },
      uFinMid: { value: hexToColor(propsRef.current.finMid) },
      uFinHigh: { value: hexToColor(propsRef.current.finHigh) },
      // Abyss
      uAbyssBase: { value: hexToColor(propsRef.current.abyssBase) },
      uAbyssMid: { value: hexToColor(propsRef.current.abyssMid) },
      uAbyssHigh: { value: hexToColor(propsRef.current.abyssHigh) },
      // Web / Halftone
      uWebBase: { value: hexToColor(propsRef.current.webBase) },
      uWebMid: { value: hexToColor(propsRef.current.webMid) },
      uWebHigh: { value: hexToColor(propsRef.current.webHigh) },
      // Behavior
      uSpeed: { value: propsRef.current.speed },
      uScale: { value: propsRef.current.scale },
      uDistortion: { value: propsRef.current.distortion },
      uBrightness: { value: propsRef.current.brightness },
      uRefraction: { value: propsRef.current.refraction },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ---- Resize Observer --------------------------------------------------
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ---- Intersection Observer (pause when off-screen) --------------------
    let isVisible = true;

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(container);

    // ---- Animation Loop ---------------------------------------------------
    const clock = new THREE.Clock();
    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const p = propsRef.current;

      // Sync prop-driven uniforms each frame
      uniforms.uStyle.value = p.patternStyle;
      uniforms.uSpeed.value = p.speed;
      uniforms.uScale.value = p.scale;
      uniforms.uDistortion.value = p.distortion;
      uniforms.uBrightness.value = p.brightness;
      uniforms.uRefraction.value = p.refraction;

      (uniforms.uChromeDark.value as THREE.Color).set(p.colorDark);
      (uniforms.uChromeMid.value as THREE.Color).set(p.colorMid);
      (uniforms.uChromeLight.value as THREE.Color).set(p.colorLight);

      (uniforms.uRibBase.value as THREE.Color).set(p.ribBase);
      (uniforms.uRibHigh1.value as THREE.Color).set(p.ribHigh1);
      (uniforms.uRibHigh2.value as THREE.Color).set(p.ribHigh2);

      (uniforms.uFinBase.value as THREE.Color).set(p.finBase);
      (uniforms.uFinMid.value as THREE.Color).set(p.finMid);
      (uniforms.uFinHigh.value as THREE.Color).set(p.finHigh);

      (uniforms.uAbyssBase.value as THREE.Color).set(p.abyssBase);
      (uniforms.uAbyssMid.value as THREE.Color).set(p.abyssMid);
      (uniforms.uAbyssHigh.value as THREE.Color).set(p.abyssHigh);

      (uniforms.uWebBase.value as THREE.Color).set(p.webBase);
      (uniforms.uWebMid.value as THREE.Color).set(p.webMid);
      (uniforms.uWebHigh.value as THREE.Color).set(p.webHigh);

      uniforms.uTime.value = clock.getElapsedTime();

      renderer.render(scene, camera);
    };

    animate();

    // ---- Cleanup ----------------------------------------------------------
    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      scene.clear();
      geometry.dispose();
      material.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []); // Run once on mount

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        minWidth: 100,
        minHeight: 100,
        backgroundColor: "#000",
        ...style,
      }}
    />
  );
};

export default FluidBackground;

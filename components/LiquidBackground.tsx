import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Vector2 } from 'three';

// Fix for TypeScript not recognizing R3F elements in JSX
// We declare in both global and module scope to ensure compatibility
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      planeGeometry: any;
      shaderMaterial: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      planeGeometry: any;
      shaderMaterial: any;
    }
  }
}

// Vertex Shader: Handles the wave displacement
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader: Creates the liquid chrome effect
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Simplex noise function
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;

    // Mouse influence
    float mouseDist = distance(st, uMouse);
    float mouseInteraction = smoothstep(0.4, 0.0, mouseDist) * 0.2;

    // Fluid Motion Layers
    float t = uTime * 0.2;
    float noise1 = snoise(vec2(st.x * 3.0 + t, st.y * 3.0 - t));
    float noise2 = snoise(vec2(st.x * 6.0 - t * 1.5, st.y * 6.0 + t * 0.5));
    
    // Distort coordinates
    vec2 distortedSt = st + vec2(noise1, noise2) * (0.1 + mouseInteraction);
    
    // Pattern generation
    float pattern = snoise(distortedSt * 8.0);
    
    // Colors (Dark Cyberpunk / Liquid Oil)
    vec3 color1 = vec3(0.05, 0.05, 0.08); // Deep Black/Blue
    vec3 color2 = vec3(0.4, 0.4, 0.45);   // Chrome/Silver
    vec3 color3 = vec3(0.0, 0.8, 0.8);    // Cyan Hint (Neon)

    // Mixing
    vec3 finalColor = mix(color1, color2, smoothstep(-0.5, 0.5, pattern));
    finalColor = mix(finalColor, color3, smoothstep(0.3, 0.4, pattern) * mouseInteraction);

    // Vignette
    float vignette = 1.0 - distance(vUv, vec2(0.5));
    finalColor *= smoothstep(0.0, 1.2, vignette);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const FluidPlane = ({ mouse }: { mouse: React.MutableRefObject<Vector2> }) => {
  const meshRef = useRef<any>(null);
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      // Smoothly interpolate mouse for fluid feel
      meshRef.current.material.uniforms.uMouse.value.lerp(mouse.current, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} scale={[10, 10, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export const LiquidBackground = () => {
  const mouse = useRef(new Vector2(0.5, 0.5));

  const handleMouseMove = (e: React.MouseEvent) => {
    // Normalize mouse to 0-1 and adjust aspect ratio roughly
    const x = e.clientX / window.innerWidth;
    const y = 1.0 - (e.clientY / window.innerHeight); // Flip Y for shader coords
    mouse.current.set(x, y);
  };

  return (
    <div 
      className="fixed inset-0 z-0 w-full h-full" 
      onMouseMove={handleMouseMove}
    >
      <Canvas camera={{ position: [0, 0, 1] }}>
        <FluidPlane mouse={mouse} />
      </Canvas>
    </div>
  );
};
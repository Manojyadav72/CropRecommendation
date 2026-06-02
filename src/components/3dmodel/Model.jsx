

import "./Model.css";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Sparkles } from "@react-three/drei";

// -------------------- MODEL --------------------

function Model({ model }) {
  model.scene.scale.set(1, 1, 1);
  model.scene.position.set(-1, 0.1, 4);
  model.scene.rotation.set(0, 3, 0);

  return <primitive object={model.scene} />;
}

// -------------------- LIGHTS --------------------

function MovingLight() {
  const ref = useRef();

  useFrame(() => {
    const time = performance.now();
    const radius = 4;
    const speed = 0.001;
    const x = radius * Math.cos(time * speed);
    ref.current.position.set(x, 4, 0);
  });

  return <pointLight ref={ref} intensity={1} distance={100} />;
}

function FarmLight() {
  return <pointLight intensity={1} distance={100} position={[-2, 1, 3]} />;
}

// -------------------- CANVAS --------------------

function ThreeScene({ model }) {
  return (
    <Canvas style={{ height: "100vh", width: "100vw" }}>
      <PerspectiveCamera makeDefault position={[0, 4.5, 8.5]} />
      <Sparkles count={200} size={3} scale={12} position={[-3, 1, 4]} />
      <OrbitControls minPolarAngle={0.5} maxPolarAngle={1.5} />
      <MovingLight />
      <FarmLight />
      <Model model={model} />
    </Canvas>
  );
}

// -------------------- EXPORT --------------------

export default function Background3D({ model }) {
  return <ThreeScene model={model} />;
}

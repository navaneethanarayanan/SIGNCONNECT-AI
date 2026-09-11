import { Float, OrbitControls, Sparkles, useAnimations, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Group } from "three";

type JarvisAvatarProps = {
  active?: boolean;
};

function HumanAvatar({ active = false }: JarvisAvatarProps) {
  const avatar = useRef<Group>(null);
  const { scene, animations } = useGLTF("/models/jarvis-human.glb");
  const { actions } = useAnimations(animations, avatar);

  useEffect(() => {
    const idle = actions.Idle ?? Object.values(actions).find(Boolean);
    idle?.reset().fadeIn(0.35).play();

    return () => {
      idle?.fadeOut(0.2);
    };
  }, [actions]);

  useFrame((state) => {
    if (!avatar.current) return;

    const time = state.clock.getElapsedTime();
    avatar.current.rotation.y = Math.sin(time * 0.34) * (active ? 0.13 : 0.06);
  });

  return (
    <group ref={avatar} position={[0, -1.3, 0]} scale={1.28}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/jarvis-human.glb");

export default function JarvisAvatar({ active = false }: JarvisAvatarProps) {
  return (
    <Canvas
      className="jarvis-3d-canvas"
      camera={{ position: [0, 0.35, 3.45], fov: 35 }}
      dpr={[1, 1.75]}
      shadows
    >
      <color attach="background" args={["#080b1e"]} />
      <ambientLight intensity={1.45} />
      <hemisphereLight args={["#b8e9ff", "#080b1e", 1.8]} />
      <pointLight position={[2.8, 3.2, 3]} intensity={38} color="#d9efff" castShadow />
      <pointLight position={[-2.5, 1.3, 2]} intensity={18} color="#8b5cf6" />
      <Sparkles count={55} scale={[4.6, 3.8, 3]} size={1.4} speed={0.3} color="#8be9fd" />
      <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.08}>
        <HumanAvatar active={active} />
      </Float>
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.31, 0]}>
        <ringGeometry args={[0.82, 0.92, 64]} />
        <meshBasicMaterial color="#63e8ff" transparent opacity={0.65} />
      </mesh>
      <OrbitControls
        enablePan={false}
        target={[0, 0.15, 0]}
        minDistance={2.9}
        maxDistance={4.6}
        minPolarAngle={Math.PI / 2.8}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}

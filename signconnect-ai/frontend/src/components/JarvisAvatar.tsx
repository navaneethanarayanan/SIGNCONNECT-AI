import { useEffect, useRef, useState } from "react";
import {
  Float,
  OrbitControls,
  Sparkles,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Brain,
  Mic,
  TriangleAlert,
  Upload,
  Volume2,
  X,
} from "lucide-react";
import type { Group } from "three";

export type JarvisState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

type JarvisAvatarProps = {
  active?: boolean;
  state?: JarvisState;
};

// Drop your AI assistant portrait (your exact human face) here:
//   frontend/public/avatars/jarvis.png  (or .jpg/.jpeg/.webp)
// It always wins over the placeholder.
// You can also click "Set my face" on the avatar to upload a photo
// straight from the browser — it's saved locally and used as the face.
const CUSTOM_PHOTO_KEY = "signconnect-avatar-photo";
const PHOTO_FILES = [
  "/avatars/jarvis.png",
  "/avatars/jarvis.jpg",
  "/avatars/jarvis.jpeg",
  "/avatars/jarvis.webp",
  "/avatars/jarvis.svg",
];

const stateLabels: Record<JarvisState, string> = {
  idle: "Idle",
  listening: "Listening...",
  thinking: "Thinking...",
  speaking: "Speaking...",
  error: "Need attention",
};

function HumanAvatar({ active }: { active: boolean }) {
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

function Jarvis3D({ active }: { active: boolean }) {
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

function StateIcon({ state }: { state: JarvisState }) {
  if (state === "thinking") return <Brain size={12} />;
  if (state === "speaking") return <Volume2 size={12} />;
  if (state === "listening") return <Mic size={12} />;
  if (state === "error") return <TriangleAlert size={12} />;
  return null;
}

export default function JarvisAvatar({
  active = false,
  state,
}: JarvisAvatarProps) {
  const resolved: JarvisState = state ?? (active ? "thinking" : "listening");
  const isActive = resolved !== "idle" && resolved !== "listening";

  const [sourceIndex, setSourceIndex] = useState(0);
  const [customPhoto, setCustomPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CUSTOM_PHOTO_KEY);
    } catch {
      return null;
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoSource =
    customPhoto ??
    (sourceIndex < PHOTO_FILES.length ? PHOTO_FILES[sourceIndex] : null);

  const photoMissing = !photoSource;

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please use a photo under 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const url = String(reader.result ?? "");

      try {
        localStorage.setItem(CUSTOM_PHOTO_KEY, url);
      } catch {
        // Storage full — still show the photo for this session.
      }

      setCustomPhoto(url);
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const clearCustomPhoto = () => {
    try {
      localStorage.removeItem(CUSTOM_PHOTO_KEY);
    } catch {
      // Ignore — nothing to clear.
    }

    setCustomPhoto(null);
  };

  if (photoMissing) {
    return <Jarvis3D active={isActive} />;
  }

  return (
    <div className={`jarvis-photo jarvis-state-${resolved}`}>
      <div className="jarvis-photo-halo" aria-hidden="true" />
      <div className="jarvis-photo-ring" aria-hidden="true" />

      <div className="jarvis-photo-frame">
        <img
          src={photoSource!}
          alt="Jarvis — your AI assistant"
          className="jarvis-photo-img"
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          onError={() => {
            if (!customPhoto) setSourceIndex((index) => index + 1);
          }}
        />
      </div>

      <div className="jarvis-photo-effects" aria-hidden="true">
        {resolved === "listening" && (
          <span className="fx-pulse" />
        )}

        {resolved === "thinking" && (
          <span className="fx-orbs">
            <i />
            <i />
            <i />
          </span>
        )}

        {resolved === "speaking" && (
          <span className="fx-wave">
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
        )}
      </div>

      <div className="jarvis-photo-set">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleSelect}
        />

        <button
          type="button"
          className="jarvis-photo-set-btn"
          title="Upload your exact face. You can also drop it at frontend/public/avatars/jarvis.png"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={12} />
          Set my face
        </button>

        {customPhoto && (
          <button
            type="button"
            className="jarvis-photo-set-btn jarvis-photo-set-btn-clear"
            title="Use the default Jarvis face again"
            onClick={clearCustomPhoto}
          >
            <X size={12} />
          </button>
        )}
      </div>

      <div className="jarvis-photo-status">
        <StateIcon state={resolved} />
        <span>{stateLabels[resolved]}</span>
      </div>
    </div>
  );
}
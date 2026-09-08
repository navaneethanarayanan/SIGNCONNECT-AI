import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  PoseLandmarker,
  FaceLandmarker,
  HandLandmarker,
} from "@mediapipe/tasks-vision";

export default function HumanTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const poseRef = useRef<PoseLandmarker | null>(null);
  const faceRef = useRef<FaceLandmarker | null>(null);
  const handRef = useRef<HandLandmarker | null>(null);

  const animationRef = useRef<number | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState("");

  const startCamera = async () => {
    try {
      setError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      if (!videoRef.current) return;

      videoRef.current.srcObject = stream;

      await videoRef.current.play();

      setCameraActive(true);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to access camera. Please allow camera permission."
      );
    }
  };

  const stopCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const video = videoRef.current;

    if (video?.srcObject) {
      const stream = video.srcObject as MediaStream;

      stream.getTracks().forEach((track) => track.stop());

      video.srcObject = null;
    }

    setCameraActive(false);
    setTracking(false);
  };

  const drawLandmarks = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    width: number,
    height: number,
    pointSize = 3
  ) => {
    for (const point of landmarks) {
      ctx.beginPath();

      ctx.arc(
        point.x * width,
        point.y * height,
        pointSize,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  };

  const initializeModels = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm"
      );

      const pose = await PoseLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 2,
        }
      );

      const face = await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 2,
        }
      );

      const hands = await HandLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 4,
        }
      );

      poseRef.current = pose;
      faceRef.current = face;
      handRef.current = hands;

      console.log("MediaPipe models loaded successfully");

      return true;
    } catch (err) {
      console.error("MediaPipe initialization error:", err);

      setError(
        "MediaPipe models could not be loaded. Check your internet connection."
      );

      return false;
    }
  };

  const detectFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (
      !video ||
      !canvas ||
      !poseRef.current ||
      !faceRef.current ||
      !handRef.current
    ) {
      return;
    }

    if (video.readyState < 2) {
      animationRef.current = requestAnimationFrame(detectFrame);
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const timestamp = performance.now();

    try {
      const poseResult = poseRef.current.detectForVideo(
        video,
        timestamp
      );

      const faceResult = faceRef.current.detectForVideo(
        video,
        timestamp
      );

      const handResult = handRef.current.detectForVideo(
        video,
        timestamp
      );

      let detected = false;

      // BODY / POSE
      if (poseResult.landmarks) {
        for (const pose of poseResult.landmarks) {
          drawLandmarks(ctx, pose, width, height, 4);
          detected = true;
        }
      }

      // FACE
      if (faceResult.faceLandmarks) {
        for (const face of faceResult.faceLandmarks) {
          drawLandmarks(ctx, face, width, height, 1.5);
          detected = true;
        }
      }

      // HANDS
      if (handResult.landmarks) {
        for (const hand of handResult.landmarks) {
          drawLandmarks(ctx, hand, width, height, 4);
          detected = true;
        }
      }

      setTracking(detected);
    } catch (err) {
      console.error("Detection error:", err);
    }

    animationRef.current = requestAnimationFrame(detectFrame);
  };

  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      const success = await initializeModels();

      if (!mounted || !success) return;

      console.log("Ready for human tracking");
    };

    setup();

    return () => {
      mounted = false;

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      const video = videoRef.current;

      if (video?.srcObject) {
        const stream = video.srcObject as MediaStream;

        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (cameraActive) {
      animationRef.current = requestAnimationFrame(detectFrame);
    }
  }, [cameraActive]);

  return (
    <div className="human-tracker-card">
      <div className="human-tracker-header">
        <div>
          <h2>AI Human Tracking</h2>
          <p>
            Real-time face, body and hand landmark detection
          </p>
        </div>

        <div
          className={`tracker-status ${
            tracking ? "active" : ""
          }`}
        >
          <span />
          {tracking ? "Human Detected" : "Waiting"}
        </div>
      </div>

      <div className="human-tracker-view">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="human-tracker-video"
        />

        <canvas
          ref={canvasRef}
          className="human-tracker-canvas"
        />

        {!cameraActive && (
          <div className="tracker-start">
            <div className="tracker-icon">🤟</div>

            <h3>Start AI Tracking</h3>

            <p>
              The AI will track your face, hands and body
              movements for sign language recognition.
            </p>

            {error && (
              <div className="tracker-error">
                {error}
              </div>
            )}

            <button
              onClick={startCamera}
              className="tracker-start-button"
            >
              Start Camera
            </button>
          </div>
        )}

        {cameraActive && (
          <>
            <div className="tracking-info">
              <span>●</span>
              AI Tracking Active
            </div>

            <div className="landmark-info">
              <span>Face</span>
              <span>Hands</span>
              <span>Body</span>
            </div>
          </>
        )}
      </div>

      <div className="human-tracker-footer">
        <div>
          <span>Face</span>
          <strong>Tracking</strong>
        </div>

        <div>
          <span>Hands</span>
          <strong>2 Hands</strong>
        </div>

        <div>
          <span>Body</span>
          <strong>Pose</strong>
        </div>

        {cameraActive && (
          <button
            onClick={stopCamera}
            className="tracker-stop-button"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}

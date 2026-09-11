import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  ScanFace,
  Users,
  ShieldCheck,
} from "lucide-react";

type CameraPreviewProps = {
  onSignRecognized?: (sign: string) => void;
};

export default function CameraPreview({ onSignRecognized: _onSignRecognized }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const startCamera = async () => {
    try {
      setCameraError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      // The video element is rendered only after cameraActive becomes true.
      // Keep the stream first, then attach it in the effect below.
      streamRef.current = stream;
      setCameraActive(true);
    } catch (error) {
      console.error(error);
      setCameraError(
        "Camera permission was denied or the camera is unavailable."
      );
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) videoRef.current.srcObject = null;

    setCameraActive(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;

    if (!cameraActive || !video || !stream) return;

    video.srcObject = stream;
    video.play().catch((error: unknown) => {
      console.error(error);
      setCameraError("Unable to play the camera preview.");
    });
  }, [cameraActive]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="camera-card">

      {/* CAMERA HEADER */}

      <div className="camera-card-header">

        <div className="camera-person">
          <div className="person-avatar">A</div>

          <div>
            <strong>Person A</strong>
            <span>Sign Language Input</span>
          </div>
        </div>

        <div className="camera-status">
          <span className={cameraActive ? "live-dot" : "offline-dot"} />
          {cameraActive ? "LIVE" : "READY"}
        </div>

      </div>


      {/* CAMERA */}

      <div className="camera-view">

        {cameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-video"
            />

            {/* Scanner */}

            <div className="scanner-frame">
              <span className="corner top-left" />
              <span className="corner top-right" />
              <span className="corner bottom-left" />
              <span className="corner bottom-right" />
            </div>

            {/* Tracking information */}

            <div className="tracking-badge">
              <ScanFace size={15} />
              Signer Tracking
            </div>

            <div className="people-badge">
              <Users size={15} />
              1 Person
            </div>

            <div className="privacy-badge">
              <ShieldCheck size={14} />
              Private
            </div>

          </>
        ) : (
          <div className="camera-start">

            <div className="camera-start-icon">
              <Camera size={42} />
            </div>

            <h3>Start your camera</h3>

            <p>
              Position your hands and face inside
              the camera view for sign recognition.
            </p>

            {cameraError && (
              <div className="camera-error">
                {cameraError}
              </div>
            )}

            <button
              className="camera-start-button"
              onClick={startCamera}
            >
              <Camera size={18} />
              Enable Camera
            </button>

          </div>
        )}

      </div>


      {/* CAMERA FOOTER */}

      <div className="camera-footer">

        <div>
          <span>Recognition</span>
          <strong>Continuous</strong>
        </div>

        <div>
          <span>People</span>
          <strong>Auto Detect</strong>
        </div>

        <div>
          <span>Privacy</span>
          <strong>Protected</strong>
        </div>

        {cameraActive && (
          <button
            className="camera-stop"
            onClick={stopCamera}
            title="Stop camera"
          >
            <CameraOff size={17} />
          </button>
        )}

      </div>

    </div>
  );
}

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

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          "Camera access needs HTTPS or http://localhost. Open the app on localhost or a secure https link."
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      // Keep the stream first; the callback ref below attaches it
      // the moment the video element mounts.
      streamRef.current = stream;
      setCameraActive(true);
    } catch (error) {
      console.error(error);
      const name = (error as DOMException)?.name;

      if (name === "NotAllowedError" || name === "SecurityError") {
        setCameraError(
          "Camera permission was denied. Allow camera access in your browser and try again."
        );
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        setCameraError("No usable camera was found on this device.");
      } else {
        setCameraError(
          "The camera could not be started. Close other apps using it and try again."
        );
      }
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) videoRef.current.srcObject = null;

    setCameraActive(false);
  };

  const attachStream = (video: HTMLVideoElement | null) => {
    if (!video || !streamRef.current) return;

    video.srcObject = streamRef.current;
    video.play().catch((error: unknown) => {
      console.error(error);
      setCameraError("Unable to play the camera preview.");
    });
  };

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
              ref={attachStream}
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

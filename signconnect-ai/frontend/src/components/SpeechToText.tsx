import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Trash2 } from "lucide-react";

interface SpeechRecognitionEventLike extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function SpeechToText() {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let temporaryText = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          finalText += text + " ";
        } else {
          temporaryText += text;
        }
      }

      if (finalText) {
        setTranscript((previous) => previous + finalText);
      }

      setInterimText(temporaryText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      if (event.error === "not-allowed") {
        setError("Microphone permission was denied.");
      } else if (event.error === "no-speech") {
        setError("No speech detected. Please try again.");
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not available.");
      return;
    }

    setError("");
    setInterimText("");

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.log(err);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimText("");
  };

  const clearText = () => {
    setTranscript("");
    setInterimText("");
    setError("");
  };

  return (
    <div className="speech-to-text-card">
      <div className="speech-header">
        <div>
          <h2>Speech to Text</h2>
          <p>Speak naturally and let AI convert your voice into text.</p>
        </div>

        <div className={`speech-status ${isListening ? "active" : ""}`}>
          <span />
          {isListening ? "Listening..." : "Ready"}
        </div>
      </div>

      <div className="speech-controls">
        {!isListening ? (
          <button
            className="speech-mic-button"
            onClick={startListening}
            title="Start speech recognition"
          >
            <Mic size={24} />
            Start Listening
          </button>
        ) : (
          <button
            className="speech-mic-button listening"
            onClick={stopListening}
            title="Stop speech recognition"
          >
            <MicOff size={24} />
            Stop Listening
          </button>
        )}

        <button
          className="speech-clear-button"
          onClick={clearText}
          title="Clear text"
        >
          <Trash2 size={18} />
          Clear
        </button>
      </div>

      <div className="speech-output">
        <div className="speech-output-header">
          <span>Recognized Text</span>
          {isListening && <span className="live-label">LIVE</span>}
        </div>

        <div className="speech-text">
          {transcript || interimText ? (
            <>
              <span>{transcript}</span>
              <span className="interim-text">{interimText}</span>
            </>
          ) : (
            <span className="placeholder-text">
              Your speech will appear here...
            </span>
          )}
        </div>
      </div>

      {error && <div className="speech-error">{error}</div>}

      <div className="speech-info">
        <span>🎙️ Microphone</span>
        <span>•</span>
        <span>English (India)</span>
        <span>•</span>
        <span>Real-time Recognition</span>
      </div>
    </div>
  );
}

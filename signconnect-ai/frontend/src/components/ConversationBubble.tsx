interface ConversationBubbleProps {
  type: "sign" | "voice";
  text: string;
  confidence?: number;
}

function ConversationBubble({
  type,
  text,
  confidence,
}: ConversationBubbleProps) {
  return (
    <div className={`conversation-bubble ${type}`}>
      <div className="bubble-header">
        <span>{type === "sign" ? "🤟 Sign" : "🎙 Voice"}</span>

        {confidence && (
          <span className="confidence">
            {confidence}% confidence
          </span>
        )}
      </div>

      <p>{text}</p>
    </div>
  );
}

export default ConversationBubble;

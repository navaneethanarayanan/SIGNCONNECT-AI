interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  status?: string;
}

function FeatureCard({
  icon,
  title,
  description,
  status,
}: FeatureCardProps) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>

      <div className="feature-content">
        <h3>{title}</h3>
        <p>{description}</p>

        {status && <span className="feature-status">{status}</span>}
      </div>
    </div>
  );
}

export default FeatureCard;

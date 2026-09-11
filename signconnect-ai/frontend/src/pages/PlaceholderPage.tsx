import { Link } from "react-router-dom";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <main className="placeholder-page">
      <p className="section-label">SIGNCONNECT AI</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link to="/home" className="primary-btn">Back to home</Link>
    </main>
  );
}

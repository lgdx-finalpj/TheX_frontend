interface StatusCardProps {
  title: string;
  lines: string[];
}

export default function StatusCard({ title, lines }: StatusCardProps) {
  return (
    <article className="status-card">
      <p className="status-card__label">[{title}]</p>
      <div className="status-card__value">
        {lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </article>
  );
}

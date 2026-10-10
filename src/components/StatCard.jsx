export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "primary",
}) {
  return (
    <article className={`stat-card stat-card-${variant}`}>
      <div className="stat-card-top">
        <span className="stat-card-title">{title}</span>

        {Icon && (
          <div className="stat-card-icon">
            <Icon size={21} strokeWidth={1.8} />
          </div>
        )}
      </div>

      <div className="stat-card-value">{value}</div>

      {description && (
        <p className="stat-card-description">{description}</p>
      )}
    </article>
  );
}
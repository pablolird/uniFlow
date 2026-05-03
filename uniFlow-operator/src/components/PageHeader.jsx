export default function PageHeader({ title, description, action }) {
  return (
    <div className={`mb-6 ${action ? "flex items-start justify-between" : ""}`}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      {action}
    </div>
  );
}

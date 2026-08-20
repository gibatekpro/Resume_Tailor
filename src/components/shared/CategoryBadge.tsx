interface CategoryBadgeProps {
  name: string;
  colour?: string;
}

export default function CategoryBadge({ name, colour = '#0058be' }: CategoryBadgeProps) {
  const alpha = colour + '1a';
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '9999px',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      backgroundColor: alpha,
      color: colour,
      border: `1px solid ${colour}33`,
      whiteSpace: 'nowrap',
    }}>
      {name}
    </span>
  );
}

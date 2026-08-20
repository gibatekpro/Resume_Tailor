interface StatusBadgeProps {
  status: string;
}

const statusMap: Record<string, { bg: string; text: string; border: string }> = {
  Open:        { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  'In Progress':{ bg: 'rgba(33,112,228,0.08)', text: '#0058be', border: 'rgba(0,88,190,0.2)' },
  Completed:   { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  Active:      { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  Inactive:    { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' },
  Deprecated:  { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' },
  Pending:     { bg: 'rgba(33,112,228,0.08)', text: '#0058be', border: 'rgba(0,88,190,0.2)' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusMap[status] ?? { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '9999px',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      backgroundColor: style.bg,
      color: style.text,
      border: `1px solid ${style.border}`,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
}

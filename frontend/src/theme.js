export const theme = {
  colors: {
    background: 'var(--color-background)',
    surface: 'var(--color-surface)',
    surfaceAlt: 'var(--color-surface-alt)',
    surfaceMuted: 'var(--color-surface-muted)',
    border: 'var(--color-border)',
    borderStrong: 'var(--color-border-strong)',
    text: 'var(--color-text)',
    textMuted: 'var(--color-text-muted)',
    primary: 'var(--color-primary)',
    primarySoft: 'var(--color-primary-soft)',
    danger: 'var(--color-danger)',
    success: 'var(--color-success)',
    info: 'var(--color-info)',
    amber: 'var(--color-amber)',
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 20,
  },
  shadow: {
    soft: '0 4px 20px rgba(0, 0, 0, 0.05)',
    glow: '0 10px 30px rgba(0, 14, 36, 0.08)',
  },
};

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' },
};

export const pageStyle = {
  width: '100%',
  maxWidth: 1440,
  margin: '0 auto',
  padding: '48px 16px 80px',
};

export const cardStyle = (extra = {}) => ({
  background: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  ...extra,
});

export const softCardStyle = (extra = {}) => ({
  background: theme.colors.surfaceMuted,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  ...extra,
});

export const sectionTitleStyle = {
  margin: 0,
  fontFamily: 'var(--font-body)',
  fontSize: 'clamp(2rem, 4vw, 3rem)',
  lineHeight: 1.08,
  color: theme.colors.text,
  letterSpacing: '-0.03em',
  fontWeight: 600,
};

export const eyebrowStyle = {
  margin: 0,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  fontWeight: 600,
  color: theme.colors.textMuted,
};

export const bodyStyle = {
  margin: 0,
  color: theme.colors.textMuted,
  fontSize: 16,
  lineHeight: 1.6,
};

export const navLinkStyle = (active = false) => ({
  color: active ? theme.colors.text : theme.colors.textMuted,
  fontSize: 16,
  fontWeight: active ? 600 : 500,
  textDecoration: 'none',
  transition: 'color 180ms ease, border-color 180ms ease',
  borderBottom: `2px solid ${active ? theme.colors.primary : 'transparent'}`,
  paddingBottom: 6,
});

export const buttonStyle = (variant = 'primary', extra = {}) => {
  const common = {
    borderRadius: 8,
    padding: '14px 24px',
    border: '1px solid transparent',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    transition: 'transform 180ms ease, box-shadow 180ms ease, background 180ms ease, color 180ms ease, border-color 180ms ease',
  };

  if (variant === 'secondary') {
    return {
      ...common,
      background: 'transparent',
      color: theme.colors.primary,
      borderColor: theme.colors.primary,
      ...extra,
    };
  }

  if (variant === 'ghost') {
    return {
      ...common,
      background: theme.colors.surfaceMuted,
      color: theme.colors.textMuted,
      borderColor: theme.colors.border,
      ...extra,
    };
  }

  return {
    ...common,
    background: theme.colors.primary,
    color: '#ffffff',
    ...extra,
  };
};

export const inputStyle = (hasError = false, extra = {}) => ({
  width: '100%',
  borderRadius: 8,
  border: `1px solid ${hasError ? theme.colors.danger : theme.colors.border}`,
  background: '#ffffff',
  color: theme.colors.text,
  padding: '14px 16px',
  outline: 'none',
  fontSize: 14,
  boxShadow: hasError ? '0 0 0 2px rgba(186, 26, 26, 0.12)' : 'none',
  ...extra,
});

export const badgeStyle = (tone = 'default') => {
  const tones = {
    default: { background: theme.colors.surfaceMuted, color: theme.colors.textMuted },
    gold: { background: theme.colors.primarySoft, color: theme.colors.primary },
    success: { background: 'rgba(22, 163, 74, 0.10)', color: theme.colors.success },
    danger: { background: 'rgba(220, 38, 38, 0.10)', color: theme.colors.danger },
    amber: { background: 'rgba(217, 119, 6, 0.10)', color: theme.colors.amber },
    info: { background: 'rgba(37, 99, 235, 0.10)', color: theme.colors.info },
  };

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    ...tones[tone],
  };
};

export const statusTone = {
  pending: 'amber',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'danger',
};

export const emptyStateStyle = {
  ...cardStyle({
    padding: '48px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  }),
};

export const statCardStyle = {
  ...softCardStyle({
    padding: 20,
    minHeight: 112,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }),
};

export const skeletonStyle = (height, extra = {}) => ({
  width: '100%',
  height,
  borderRadius: 8,
  background: 'linear-gradient(90deg, #f1f2f4 20%, #e6e8eb 45%, #f1f2f4 70%)',
  backgroundSize: '220% 100%',
  animation: 'shimmer 1.4s linear infinite',
  ...extra,
});

export const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

export const quantityButtonStyle = {
  width: 36,
  height: 36,
  borderRadius: 8,
  border: `1px solid ${theme.colors.border}`,
  background: '#ffffff',
  color: theme.colors.text,
  cursor: 'pointer',
  fontSize: 16,
};

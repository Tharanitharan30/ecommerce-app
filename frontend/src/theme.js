export const theme = {
  colors: {
    background: 'var(--color-background)',
    surface: 'var(--color-surface)',
    surfaceAlt: 'var(--color-surface-alt)',
    border: 'var(--color-border)',
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
    sm: 12,
    md: 18,
    lg: 24,
    xl: 32,
  },
  shadow: {
    soft: '0 18px 45px rgba(15, 23, 42, 0.08)',
    glow: '0 18px 50px rgba(15, 23, 42, 0.12)',
  },
};

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' },
};

export const pageStyle = {
  width: '100%',
  maxWidth: 1200,
  margin: '0 auto',
  padding: '24px 16px 64px',
};

export const cardStyle = (extra = {}) => ({
  background: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.soft,
  ...extra,
});

export const softCardStyle = (extra = {}) => ({
  background: theme.colors.surfaceAlt,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  ...extra,
});

export const sectionTitleStyle = {
  margin: 0,
  fontFamily: 'var(--font-heading)',
  fontSize: 'clamp(2rem, 4vw, 3rem)',
  lineHeight: 1.05,
  color: theme.colors.text,
  letterSpacing: '-0.04em',
};

export const eyebrowStyle = {
  margin: 0,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  fontWeight: 700,
  color: theme.colors.primary,
};

export const bodyStyle = {
  margin: 0,
  color: theme.colors.textMuted,
  fontSize: 15,
  lineHeight: 1.7,
};

export const navLinkStyle = (active = false) => ({
  color: active ? theme.colors.text : theme.colors.textMuted,
  fontSize: 14,
  fontWeight: active ? 700 : 600,
  textDecoration: 'none',
  transition: 'color 180ms ease',
});

export const buttonStyle = (variant = 'primary', extra = {}) => {
  const common = {
    borderRadius: 14,
    padding: '12px 18px',
    border: '1px solid transparent',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: 700,
    transition: 'transform 180ms ease, box-shadow 180ms ease, background 180ms ease, color 180ms ease',
  };

  if (variant === 'secondary') {
    return {
      ...common,
      background: '#ffffff',
      color: theme.colors.text,
      borderColor: theme.colors.border,
      ...extra,
    };
  }

  if (variant === 'ghost') {
    return {
      ...common,
      background: theme.colors.surfaceAlt,
      color: theme.colors.text,
      borderColor: theme.colors.border,
      ...extra,
    };
  }

  return {
    ...common,
    background: theme.colors.text,
    color: '#ffffff',
    boxShadow: '0 12px 26px rgba(15, 23, 42, 0.14)',
    ...extra,
  };
};

export const inputStyle = (hasError = false, extra = {}) => ({
  width: '100%',
  borderRadius: 14,
  border: `1px solid ${hasError ? theme.colors.danger : theme.colors.border}`,
  background: '#ffffff',
  color: theme.colors.text,
  padding: '13px 15px',
  outline: 'none',
  fontSize: 14,
  boxShadow: hasError ? '0 0 0 3px rgba(220, 38, 38, 0.12)' : 'none',
  ...extra,
});

export const badgeStyle = (tone = 'default') => {
  const tones = {
    default: { background: '#f8fafc', color: theme.colors.textMuted },
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
    padding: '7px 11px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.04em',
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
    padding: 18,
    minHeight: 104,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }),
};

export const skeletonStyle = (height, extra = {}) => ({
  width: '100%',
  height,
  borderRadius: 18,
  background: 'linear-gradient(90deg, #eef2f7 20%, #e2e8f0 45%, #eef2f7 70%)',
  backgroundSize: '220% 100%',
  animation: 'shimmer 1.4s linear infinite',
  ...extra,
});

export const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

export const quantityButtonStyle = {
  width: 38,
  height: 38,
  borderRadius: 12,
  border: `1px solid ${theme.colors.border}`,
  background: '#ffffff',
  color: theme.colors.text,
  cursor: 'pointer',
  fontSize: 18,
};

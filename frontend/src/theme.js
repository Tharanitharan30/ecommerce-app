export const theme = {
  colors: {
    background: 'var(--color-background)',
    surface: 'var(--color-surface)',
    surfaceAlt: 'var(--color-surface-alt)',
    border: 'var(--color-border)',
    text: 'var(--color-text)',
    textMuted: 'var(--color-text-muted)',
    gold: 'var(--color-gold)',
    goldSoft: 'var(--color-gold-soft)',
    danger: 'var(--color-danger)',
    success: 'var(--color-success)',
    info: 'var(--color-info)',
    amber: 'var(--color-amber)',
  },
  radius: {
    sm: 14,
    md: 20,
    lg: 28,
    xl: 36,
  },
  shadow: {
    soft: '0 18px 45px rgba(0, 0, 0, 0.28)',
    glow: '0 0 0 1px rgba(201, 169, 110, 0.18), 0 24px 60px rgba(0, 0, 0, 0.38)',
  },
};

export const fadeUp = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut' },
};

export const pageStyle = {
  width: '100%',
  maxWidth: 1240,
  margin: '0 auto',
  padding: '24px 16px 72px',
};

export const cardStyle = (extra = {}) => ({
  background: 'linear-gradient(180deg, rgba(28, 28, 28, 0.92), rgba(18, 18, 18, 0.94))',
  border: '1px solid var(--color-border)',
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.soft,
  ...extra,
});

export const softCardStyle = (extra = {}) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: theme.radius.md,
  ...extra,
});

export const sectionTitleStyle = {
  margin: 0,
  fontFamily: 'var(--font-heading)',
  fontSize: 'clamp(2rem, 4vw, 3rem)',
  lineHeight: 1,
  color: theme.colors.text,
  letterSpacing: '-0.03em',
};

export const eyebrowStyle = {
  margin: 0,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.28em',
  color: theme.colors.gold,
};

export const bodyStyle = {
  margin: 0,
  color: theme.colors.textMuted,
  fontSize: 15,
  lineHeight: 1.75,
};

export const navLinkStyle = (active = false) => ({
  color: active ? theme.colors.gold : theme.colors.textMuted,
  fontSize: 14,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  textDecoration: 'none',
  transition: 'color 180ms ease, transform 180ms ease',
  transform: active ? 'translateY(-1px)' : 'none',
});

export const buttonStyle = (variant = 'primary', extra = {}) => {
  const common = {
    borderRadius: 999,
    padding: '14px 22px',
    border: '1px solid transparent',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: 600,
    transition: 'transform 180ms ease, box-shadow 180ms ease, background 180ms ease, color 180ms ease',
  };

  if (variant === 'secondary') {
    return {
      ...common,
      background: 'transparent',
      color: theme.colors.text,
      borderColor: theme.colors.border,
      ...extra,
    };
  }

  if (variant === 'ghost') {
    return {
      ...common,
      background: 'rgba(255,255,255,0.04)',
      color: theme.colors.text,
      borderColor: 'rgba(255,255,255,0.08)',
      ...extra,
    };
  }

  return {
    ...common,
    background: theme.colors.gold,
    color: '#1b1711',
    boxShadow: '0 14px 34px rgba(201, 169, 110, 0.22)',
    ...extra,
  };
};

export const inputStyle = (hasError = false, extra = {}) => ({
  width: '100%',
  borderRadius: 18,
  border: `1px solid ${hasError ? theme.colors.danger : 'rgba(255,255,255,0.08)'}`,
  background: 'rgba(255,255,255,0.03)',
  color: theme.colors.text,
  padding: '14px 16px',
  outline: 'none',
  fontSize: 14,
  boxShadow: hasError ? '0 0 0 1px rgba(190, 74, 72, 0.25)' : 'none',
  ...extra,
});

export const badgeStyle = (tone = 'default') => {
  const tones = {
    default: { background: 'rgba(255,255,255,0.05)', color: theme.colors.textMuted },
    gold: { background: 'rgba(201,169,110,0.14)', color: theme.colors.gold },
    success: { background: 'rgba(72, 154, 104, 0.16)', color: theme.colors.success },
    danger: { background: 'rgba(190, 74, 72, 0.16)', color: theme.colors.danger },
    amber: { background: 'rgba(203, 149, 52, 0.16)', color: theme.colors.amber },
    info: { background: 'rgba(83, 132, 187, 0.16)', color: theme.colors.info },
  };

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
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
  background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.11) 45%, rgba(255,255,255,0.05) 70%)',
  backgroundSize: '220% 100%',
  animation: 'shimmer 1.4s linear infinite',
  ...extra,
});

export const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

export const quantityButtonStyle = {
  width: 38,
  height: 38,
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.03)',
  color: theme.colors.text,
  cursor: 'pointer',
  fontSize: 18,
};

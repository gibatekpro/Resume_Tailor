// Centralized design tokens — single source of truth for all colors, spacing, and typography.
// Changing a value here propagates everywhere via CSS custom properties and this file.

export const colors = {
  // Sidebar / structural chrome
  primaryContainer: '#131b2e',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#7c839b',
  onPrimaryFixedVariant: '#3f465c',
  primaryFixed: '#dae2fd',
  primaryFixedDim: '#bec6e0',
  inversePrimary: '#bec6e0',

  // Accent / actions
  secondary: '#0058be',
  onSecondary: '#ffffff',
  secondaryContainer: '#2170e4',
  onSecondaryContainer: '#fefcff',
  secondaryFixed: '#d8e2ff',
  secondaryFixedDim: '#adc6ff',
  onSecondaryFixed: '#001a42',
  onSecondaryFixedVariant: '#004395',

  // Tertiary (amber/gold tones)
  tertiary: '#000000',
  onTertiary: '#ffffff',
  tertiaryContainer: '#271901',
  onTertiaryContainer: '#98805d',
  tertiaryFixed: '#fcdeb5',
  tertiaryFixedDim: '#dec29a',
  onTertiaryFixed: '#271901',
  onTertiaryFixedVariant: '#574425',

  // Surface tokens
  background: '#f6f9ff',
  onBackground: '#161c22',
  surface: '#f6f9ff',
  surfaceDim: '#d4dbe2',
  surfaceBright: '#f6f9ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#eef4fc',
  surfaceContainer: '#e8eef6',
  surfaceContainerHigh: '#e3e9f1',
  surfaceContainerHighest: '#dde3eb',
  onSurface: '#161c22',
  onSurfaceVariant: '#45464d',
  surfaceVariant: '#dde3eb',
  surfaceTint: '#565e74',
  inverseSurface: '#2b3137',
  inverseOnSurface: '#ebf1f9',

  // Borders
  outline: '#76777d',
  outlineVariant: '#c6c6cd',

  // Status: error/danger
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  // Status: success (green)
  successBg: '#f0fdf4',
  successText: '#15803d',
  successBorder: '#bbf7d0',

  // Status: warning (amber)
  warningBg: '#fffbeb',
  warningText: '#b45309',
  warningBorder: '#fde68a',
} as const;

export const spacing = {
  base: '8px',
  sidebarWidth: '260px',
  containerPadding: '24px',
  gutter: '16px',
  cardPadding: '20px',
  stackSm: '4px',
  stackMd: '12px',
  stackLg: '24px',
} as const;

export const typography = {
  displayLg: { fontSize: '36px', lineHeight: '44px', fontWeight: '700', letterSpacing: '-0.02em' },
  headlineMd: { fontSize: '24px', lineHeight: '32px', fontWeight: '600', letterSpacing: '-0.01em' },
  headlineSm: { fontSize: '20px', lineHeight: '28px', fontWeight: '600' },
  titleLg: { fontSize: '18px', lineHeight: '24px', fontWeight: '600' },
  bodyLg: { fontSize: '16px', lineHeight: '24px', fontWeight: '400' },
  bodyMd: { fontSize: '14px', lineHeight: '20px', fontWeight: '400' },
  bodySm: { fontSize: '13px', lineHeight: '18px', fontWeight: '400' },
  labelMd: { fontSize: '12px', lineHeight: '16px', fontWeight: '600', letterSpacing: '0.05em' },
  labelSm: { fontSize: '11px', lineHeight: '14px', fontWeight: '500' },
  metricValue: { fontSize: '28px', lineHeight: '32px', fontWeight: '700', letterSpacing: '-0.02em' },
} as const;

export const radius = {
  sm: '2px',
  DEFAULT: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
} as const;

export const shadows = {
  card: '0px 1px 3px rgba(15, 23, 42, 0.05)',
  elevated: '0px 10px 15px -3px rgba(15, 23, 42, 0.1)',
} as const;

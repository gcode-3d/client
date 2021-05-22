export const fetchSentryDsn = () => ({
  type: "api/sentry/fetchDsn",
});

export const sentryInit = (dsn) => ({
  type: "api/sentry/sentryInit",
  dsn,
  environment: process.env.NODE_ENV,
});

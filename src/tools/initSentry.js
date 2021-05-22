import * as Sentry from "@sentry/react";
import { CaptureConsole } from "@sentry/integrations";

export default function initSentry(sentry_dsn, environment) {
  if (
    Sentry.getCurrentHub().getClient() &&
    Sentry.getCurrentHub().getClient().getOptions().dsn
  ) {
    Sentry.getCurrentHub().getClient().getOptions().dsn = sentry_dsn;
    Sentry.getCurrentHub().getClient().getOptions().environment =
      "CLIENT_" + environment;
  } else {
    Sentry.init({
      dsn: sentry_dsn,
      environment: "CLIENT_" + environment,
    });
  }
}

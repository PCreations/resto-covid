import * as Sentry from "@sentry/react";

export const captureException = (exception) =>
  Sentry.captureException(exception);

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { Error } from "./Error";

Sentry.init({
  dsn:
    "https://b44818e4fa3f4953996f3d3721f4a458@o377168.ingest.sentry.io/5461082",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={Error}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

export function GoogleAnalytics({
  GA_MEASUREMENT_ID,
}: {
  GA_MEASUREMENT_ID: string;
}) {
  return <NextGoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}

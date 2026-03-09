"use client";

import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import { useEffect } from "react";

let didInit = false;

type PostHogProviderProps = {
  children: React.ReactNode;
};

export function AppPostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

    if (!apiKey || didInit) {
      return;
    }

    posthog.init(apiKey, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      capture_pageview: false,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });

    didInit = true;
  }, []);

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

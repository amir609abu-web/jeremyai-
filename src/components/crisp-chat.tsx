"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

declare global {
  interface Window {
    $crisp?: unknown[];
    CRISP_WEBSITE_ID?: string;
    CRISP_RUNTIME_CONFIG?: { locale?: string };
  }
}

const SCRIPT_ID = "crisp-chat-script";

export function CrispChat() {
  const locale = useLocale();
  const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

  useEffect(() => {
    if (!websiteId) return;

    window.CRISP_RUNTIME_CONFIG = { locale };

    if (document.getElementById(SCRIPT_ID)) return;

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = websiteId;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);
  }, [websiteId, locale]);

  return null;
}

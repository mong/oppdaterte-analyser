"use client";

import React from "react";

declare const window: {
  _mtm: any;
} & Window;

export default function MatomoTracker() {
  React.useEffect(() => {
    const _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
    const d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0];
    g.async = true;
    g.src = "https://statistikk.fnsp.no/js/container_wcHdDuAW.js";
    s.parentNode && s.parentNode.insertBefore(g, s);
  }, []);
  return <></>;
}

"use client";

import { useEffect } from "react";

/**
 * Marks the document as an immersive play session. On mobile the global site
 * header, bottom nav and footer are hidden (see globals.css `body.gw-immersive`)
 * so the game fills the screen — the player carries its own GameWhame logo +
 * controls. Renders nothing; the class is removed on route change / unmount so
 * every other page keeps its chrome.
 */
export default function ImmersivePlay() {
  useEffect(() => {
    document.body.classList.add("gw-immersive");
    return () => document.body.classList.remove("gw-immersive");
  }, []);
  return null;
}

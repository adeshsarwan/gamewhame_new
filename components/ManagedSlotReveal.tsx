"use client";

import { useEffect } from "react";
import { revealOnClientMount } from "@/lib/priceOptimiser";

/**
 * Lifecycle companion for a Price Optimiser managed container. On the initial
 * document it does nothing (Price Optimiser discovers server-rendered
 * containers itself). When the container was mounted by a client navigation it
 * announces the new node once via `revealSlots` — see `revealOnClientMount`.
 */
export default function ManagedSlotReveal({ id }: { id: string }) {
  useEffect(() => revealOnClientMount(id), [id]);
  return null;
}

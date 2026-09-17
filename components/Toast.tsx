"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import type { IconName } from "@/lib/types";
import styles from "./Toast.module.css";

const EVENT = "gw-toast";

interface ToastDetail {
  message: string;
  icon?: IconName;
}

/** Fire a toast from anywhere on the client. Navy pill, bottom-center, ~2.6s. */
export function toast(message: string, icon?: IconName) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ToastDetail>(EVENT, { detail: { message, icon } }));
}

export function Toaster() {
  const [items, setItems] = useState<{ id: number; detail: ToastDetail }[]>([]);

  useEffect(() => {
    let seq = 0;
    function onToast(e: Event) {
      const detail = (e as CustomEvent<ToastDetail>).detail;
      const id = ++seq;
      setItems((prev) => [...prev, { id, detail }]);
      window.setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 2600);
    }
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, []);

  return (
    <div className={styles.host} role="status" aria-live="polite">
      {items.map(({ id, detail }) => (
        <div key={id} className={styles.toast}>
          {detail.icon && <Icon name={detail.icon} size={18} color="var(--aqua-light)" />}
          <span>{detail.message}</span>
        </div>
      ))}
    </div>
  );
}

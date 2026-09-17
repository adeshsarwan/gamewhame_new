import type { TileSize } from "@/lib/types";
import styles from "./GameCardSkeleton.module.css";

/** Shimmer placeholder matching a tile's footprint — keeps CLS at 0 during
 *  route/data transitions. */
export default function GameCardSkeleton({
  size = "s",
  context = "mosaic",
}: {
  size?: TileSize;
  context?: "mosaic" | "rail" | "grid";
}) {
  return <span className={styles.skel} data-size={size} data-context={context} aria-hidden />;
}

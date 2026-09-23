// Game-card UI toggles. Cards now use with-title cover-art thumbnails, so the
// separate caption text and heart are redundant for now. Flip any of these to
// `true` to restore that element on every GameCard (home, category grid,
// mosaic, rails, favorites) — no other change needed.
export const cardConfig = {
  showFavorite: false, // true -> render the favorite heart button on the card
  showTitle: false, // true -> render the card title text in the caption bar
  showCategory: false, // true -> render the card category label (caption + hover)
};

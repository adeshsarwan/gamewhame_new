import { Nunito, Plus_Jakarta_Sans } from "next/font/google";

// Variable fonts — full weight axis, so Nunito reaches the 1000 "black" the
// display type ramp needs. Exposed as CSS vars consumed by tokens.css.
export const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

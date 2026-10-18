import { asset } from "@/lib/assets";

// Exact supplied lettering. The supplied demo OTF is personal-use-only, so it
// is not copied into public/ or loaded as a website font. See docs/SIGNATURE.md.
export const signature = {
  artwork: asset("haveli-wordmark-pink"),
  layers: {
    pink: asset("haveli-wordmark-pink"),
    red: asset("haveli-wordmark-red"),
    green: asset("haveli-wordmark-green"),
    chrome: asset("haveli-wordmark-chrome"),
  },
  compactWidth: 142,
  compactMobileWidth: 112,
  introViewportWidth: 0.84,
  introMaxWidth: 1360,
  navigationDuration: 0.46,
};

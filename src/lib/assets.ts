import manifest from "@/data/assets.json";
export type Asset = (typeof manifest)[number];
export function asset(id: string): Asset {
  const result = manifest.find((item) => item.id === id);
  if (!result) throw new Error(`Unknown asset: ${id}`);
  return result;
}

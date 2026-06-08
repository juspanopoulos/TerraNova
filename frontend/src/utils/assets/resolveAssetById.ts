export async function resolveAssetById(
  loaders: Record<string, () => Promise<unknown>>,
  assetId: string,
): Promise<string> {
  const match = Object.entries(loaders).find(([path]) => {
    const fileName = path.split("/").pop() ?? "";
    const baseName = fileName.replace(/\.[^.]+$/, "");
    return baseName === assetId;
  });

  if (!match) return "";

  const asset = await match[1]();
  return typeof asset === "string" ? asset : "";
}

export function backupData(): string {
  return JSON.stringify(localStorage);
}

export async function recoverData(data: string) {
  const parsed = JSON.parse(data);
  Object.entries(parsed).forEach(([key, value]) => {
    if (typeof value === "string") {
      localStorage.setItem(key, value);
    } else {
      throw new Error("Value should be a string");
    }
  });
}

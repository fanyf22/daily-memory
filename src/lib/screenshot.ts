import html2canvas from "html2canvas";

export async function screenshotAndCopy(element: HTMLElement) {
  const canvas = await html2canvas(element);
  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

  if (blob) {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
  } else {
    throw new Error("Fail to copy to clipboard");
  }
}

export async function screenshotAndDownload(element: HTMLElement) {
  const canvas = await html2canvas(element);
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = "screenshot.png";
  a.click();
}

import { Analyser } from "@/payload-types";

export default function downloadJSON(
  analyse: Analyser["data"]
): void {

  const blob = new Blob([JSON.stringify(analyse, null, 2)], { type: "application/json" });

  const a = document.createElement('a');
  a.download = `${analyse.name}`;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
}

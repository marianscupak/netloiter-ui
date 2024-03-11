export const downloadFile = ({
  data,
  fileName,
}: {
  data: object;
  fileName: string;
}) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/json" });
  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
};

export const sendStartPrintAction = (filename) => ({
  type: "api/startPrint",
  filename,
});

export const cancelPrintAction = (filename) => ({
  type: "api/cancelPrint",
  filename,
});

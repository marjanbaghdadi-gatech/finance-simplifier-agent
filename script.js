const pdfFileInput = document.getElementById("pdfFile");
const fileStatus = document.getElementById("fileStatus");

if (pdfFileInput && fileStatus) {
  pdfFileInput.addEventListener("change", () => {
    const file = pdfFileInput.files[0];

    if (!file) {
      fileStatus.textContent = "No file selected yet.";
      return;
    }

    if (file.type !== "application/pdf") {
      fileStatus.textContent = "Please choose a PDF file.";
      return;
    }

    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
    fileStatus.textContent = `Selected file: ${file.name} (${fileSizeMb} MB)`;
  });
}

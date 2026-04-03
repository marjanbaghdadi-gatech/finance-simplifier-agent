const pdfFileInput = document.getElementById("pdfFile");
const fileStatus = document.getElementById("fileStatus");
const uploadTabBtn = document.getElementById("uploadTabBtn");
const resultsTabBtn = document.getElementById("resultsTabBtn");
const uploadTab = document.getElementById("uploadTab");
const resultsTab = document.getElementById("resultsTab");
const uploadForm = document.getElementById("uploadForm");

function showTab(tabName) {
  const showUpload = tabName === "upload";

  uploadTab.classList.toggle("active", showUpload);
  resultsTab.classList.toggle("active", !showUpload);

  uploadTabBtn.classList.toggle("active", showUpload);
  resultsTabBtn.classList.toggle("active", !showUpload);

  uploadTabBtn.setAttribute("aria-selected", showUpload ? "true" : "false");
  resultsTabBtn.setAttribute("aria-selected", showUpload ? "false" : "true");
}

uploadTabBtn.addEventListener("click", () => showTab("upload"));
resultsTabBtn.addEventListener("click", () => showTab("results"));

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

if (uploadForm) {
  uploadForm.addEventListener("submit", () => {
    showTab("results");
  });
}

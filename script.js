
const WEBHOOK_URL = "https://mbaghdadi6g.app.n8n.cloud/webhook-test/simplify-financial-pdf";

const pdfFileInput = document.getElementById("pdfFile");
const fileStatus = document.getElementById("fileStatus");
const submitBtn = document.getElementById("submitBtn");
const loadingCard = document.getElementById("loadingCard");
const errorCard = document.getElementById("errorCard");
const errorMessage = document.getElementById("errorMessage");
const resultsSection = document.getElementById("resultsSection");
const resultsCards = document.getElementById("resultsCards");

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

submitBtn.addEventListener("click", async () => {
  hideError();
  clearResults();

  const file = pdfFileInput.files[0];

  if (!file) {
    showError("Please choose a PDF file first.");
    return;
  }

  if (file.type !== "application/pdf") {
    showError("The selected file is not a PDF. Please upload a PDF file.");
    return;
  }

 if (WEBHOOK_URL === "PASTE_YOUR_N8N_WEBHOOK_URL_HERE") {
  showError("Please add your n8n webhook URL inside script.js before using this page.");
  return;
  }

  const formData = new FormData();
  formData.append("data", file);

  showLoading(true);
  submitBtn.disabled = true;

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const text = await response.text();
    renderFormattedResponse(text);
  } catch (error) {
    showError("We could not process the document. Please try again. " + error.message);
  } finally {
    showLoading(false);
    submitBtn.disabled = false;
  }
});

function renderFormattedResponse(text) {
  const sections = parseSections(text);

  if (!sections.length) {
    resultsCards.innerHTML = createCard(
      "Simple explanation",
      escapeHtml(text).replace(/\n/g, "<br>")
    );
    resultsSection.classList.remove("hidden");
    return;
  }

  resultsCards.innerHTML = sections
    .map((section) => {
      const contentHtml = formatSectionContent(section.content);
      return createCard(section.title, contentHtml);
    })
    .join("");

  resultsSection.classList.remove("hidden");
}

function parseSections(text) {
  const normalized = text.replace(/\r/g, "").trim();
  const regex = /(\d+)\.\s*(.+?)\n([\s\S]*?)(?=\n\d+\.\s|$)/g;
  const sections = [];
  let match;

  while ((match = regex.exec(normalized)) !== null) {
    sections.push({
      number: match[1],
      title: match[2].replace(/\*\*/g, "").trim(),
      content: match[3].trim()
    });
  }

  return sections;
}

function formatSectionContent(content) {
  const cleaned = escapeHtml(content);

  if (cleaned.includes("- ")) {
    const parts = cleaned.split(/\n?\s*-\s+/).filter(Boolean);

    if (parts.length > 1) {
      return "<ul>" + parts.map((item) => `<li>${item.trim()}</li>`).join("") + "</ul>";
    }
  }

  return cleaned.replace(/\n/g, "<br>");
}

function createCard(title, contentHtml) {
  return `
    <article class="result-card">
      <h3>${escapeHtml(title)}</h3>
      <div>${contentHtml}</div>
    </article>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showLoading(isLoading) {
  loadingCard.classList.toggle("hidden", !isLoading);
}

function showError(message) {
  errorMessage.textContent = message;
  errorCard.classList.remove("hidden");
}

function hideError() {
  errorCard.classList.add("hidden");
}

function clearResults() {
  resultsCards.innerHTML = "";
  resultsSection.classList.add("hidden");
}

const pdfFileInput = document.getElementById("pdfFile");
const fileStatus = document.getElementById("fileStatus");
const addOptionBtn = document.getElementById("addOptionBtn");
const optionsContainer = document.getElementById("optionsContainer");

let currentOptionCount = 2;
const maxOptions = 4;

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

function createOptionCard(optionNumber) {
  const section = document.createElement("section");
  section.className = "option-card";
  section.setAttribute("data-option", optionNumber);

  section.innerHTML = `
    <h3>Option ${optionNumber}</h3>

    <label for="option${optionNumber}_name" class="field-label">Option name</label>
    <input
      id="option${optionNumber}_name"
      name="option${optionNumber}_name"
      type="text"
      placeholder="Example: Bond fund"
      required
    />

    <label for="option${optionNumber}_type" class="field-label">Option type</label>
    <select id="option${optionNumber}_type" name="option${optionNumber}_type" required>
      <option value="">Choose one</option>
      <option value="savings account">Savings account</option>
      <option value="certificate of deposit">Certificate of deposit</option>
      <option value="bond fund">Bond fund</option>
      <option value="stock etf">Stock ETF / index fund</option>
      <option value="individual stocks">Individual stocks</option>
      <option value="real estate">Real estate</option>
      <option value="other">Other</option>
    </select>

    <label for="option${optionNumber}_rate" class="field-label">Expected annual rate or APY (optional)</label>
    <input
      id="option${optionNumber}_rate"
      name="option${optionNumber}_rate"
      type="number"
      step="0.01"
      placeholder="Example: 4 or 8"
    />

    <label for="option${optionNumber}_notes" class="field-label">Extra notes (optional)</label>
    <textarea
      id="option${optionNumber}_notes"
      name="option${optionNumber}_notes"
      rows="4"
      placeholder="Example: lower risk, may need money soon, focused on long-term growth"
    ></textarea>
  `;

  return section;
}

if (addOptionBtn && optionsContainer) {
  addOptionBtn.addEventListener("click", () => {
    if (currentOptionCount >= maxOptions) {
      return;
    }

    currentOptionCount += 1;
    optionsContainer.appendChild(createOptionCard(currentOptionCount));

    if (currentOptionCount >= maxOptions) {
      addOptionBtn.disabled = true;
      addOptionBtn.textContent = "Maximum of 4 Options Added";
    }
  });
}

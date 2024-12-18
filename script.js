let numbers = [];
let chart;
const listElement = document.getElementById("number-list");
const qrCanvas = document.getElementById("qr-code");
const saveButton = document.getElementById("save-btn");
const stopButton = document.getElementById("stop-btn");
const restartButton = document.getElementById("restart-btn");
const startButton = document.getElementById("start-btn");

// Start Experiment
startButton.addEventListener("click", () => {
  document.getElementById("qr-container").classList.remove("hidden");
  saveButton.classList.remove("hidden");
  stopButton.classList.remove("hidden");
  restartButton.classList.remove("hidden");
  startButton.classList.add("hidden");

  const qrCodeUrl = `${window.location.href}?upload=true`;
  const qr = new QRCode(qrCanvas, { text: qrCodeUrl, width: 150, height: 150 });

  setupChart();
});

// Add New Number
function addNumber(num) {
  const timestamp = new Date().toISOString();
  numbers.push({ value: num, timestamp });

  // Update List
  const li = document.createElement("li");
  li.textContent = `${timestamp} - ${num}`;
  listElement.appendChild(li);

  // Update Chart
  updateChart();
}

// Stop Experiment
stopButton.addEventListener("click", () => {
  alert("Experiment Stopped!");
});

// Restart Experiment
restartButton.addEventListener("click", () => {
  numbers = [];
  listElement.innerHTML = "";
  setupChart();
});

// Save Results
saveButton.addEventListener("click", () => {
  saveDataAsCSV();
  saveChartAsImage();
});

function setupChart() {
  const ctx = document.getElementById("histogram").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: { labels: [], datasets: [{ label: "Frequency", data: [] }] },
    options: {
      scales: {
        x: { title: { display: true, text: "Numbers" } },
        y: { title: { display: true, text: "Frequency" } }
      }
    }
  });
}

function updateChart() {
  const data = numbers.map((item) => item.value);
  const counts = {};
  data.forEach((num) => {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  });

  chart.data.labels = Object.keys(counts);
  chart.data.datasets[0].data = Object.values(counts);
  chart.update();
}

function saveDataAsCSV() {
  const csvContent = numbers
    .map(({ value, timestamp }) => `${timestamp},${value}`)
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `experiment_${new Date().toISOString()}.csv`;
  a.click();
}

function saveChartAsImage() {
  const canvas = document.getElementById("histogram");
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png", 1.0);
  a.download = `histogram_${new Date().toISOString()}.png`;
  a.click();
}

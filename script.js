let numbers = [];
const qrContainer = document.getElementById("qr-container");
const startButton = document.getElementById("start-btn");
const listElement = document.getElementById("number-list");
const chartContainer = document.getElementById("chart-container");
const resultsContainer = document.getElementById("results");
const saveButton = document.getElementById("save-btn");
const stopButton = document.getElementById("stop-btn");
const restartButton = document.getElementById("restart-btn");

let chart;

// Start Experiment
startButton.addEventListener("click", () => {
  qrContainer.classList.remove("hidden");
  resultsContainer.classList.remove("hidden");
  chartContainer.classList.remove("hidden");
  saveButton.parentElement.classList.remove("hidden");
  startButton.classList.add("hidden");

  setupChart();
});

// Add New Number (Simulate receiving from input page)
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

function renderRadarChart(factors, riskLevel) {
  var canvas = document.getElementById("riskChart");
  if (!canvas) return;

  // Destroy existing chart if any
  if (window._radarChart) {
    window._radarChart.destroy();
    window._radarChart = null;
  }

  var labels = factors.map(function(f) { return f.factor; });
  var values = factors.map(function(f) { return f.isRisk ? 80 + Math.random() * 20 : 10 + Math.random() * 30; });

  var colors = { Low: "#00d4aa", Moderate: "#ffa500", High: "#ff4466" };
  var color = colors[riskLevel] || "#ff6b00";

  var isDark = !document.body.classList.contains("light-mode");
  var gridColor  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  var labelColor = isDark ? "rgba(255,255,255,0.6)"  : "rgba(0,0,0,0.6)";

  window._radarChart = new Chart(canvas, {
    type: "radar",
    data: {
      labels: labels,
      datasets: [{
        label: "Risk Factors",
        data: values,
        backgroundColor: color + "22",
        borderColor: color,
        borderWidth: 2,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        r: {
          min: 0, max: 100,
          ticks: { display: false },
          grid: { color: gridColor },
          angleLines: { color: gridColor },
          pointLabels: {
            color: labelColor,
            font: { size: 11, family: "Poppins, sans-serif" }
          }
        }
      }
    }
  });
}
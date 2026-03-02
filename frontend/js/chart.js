var riskChartInstance = null;
function renderRadarChart(factors, riskLevel) {
  if (riskChartInstance) { riskChartInstance.destroy(); riskChartInstance = null; }
  var colorMap = { Low:"#00d4aa", Moderate:"#ffa500", High:"#ff4466" };
  var color = colorMap[riskLevel] || "#ff6b00";
  var labels = factors.map(function(f) { var l = f.factor.split("(")[0].trim(); return l.length > 16 ? l.slice(0,16)+"..." : l; });
  var dataPoints = factors.map(function(f) { return f.points || 0; });
  var ctx = document.getElementById("riskChart").getContext("2d");
  riskChartInstance = new Chart(ctx, {
    type: "radar",
    data: { labels:labels, datasets:[{ label:"Risk Profile", data:dataPoints, borderColor:color, backgroundColor:color+"18", pointBackgroundColor:color, pointBorderColor:color, pointHoverBackgroundColor:"#fff", borderWidth:2, pointRadius:4, pointHoverRadius:6 }] },
    options: { responsive:true, maintainAspectRatio:false,
      scales:{ r:{ min:0, max:4, grid:{color:"rgba(255,255,255,0.04)"}, angleLines:{color:"rgba(255,255,255,0.04)"}, ticks:{color:"rgba(255,255,255,0.2)",backdropColor:"transparent",stepSize:1}, pointLabels:{color:"#a0a0c0",font:{family:"Poppins",size:10}} } },
      plugins:{ legend:{display:false}, tooltip:{ backgroundColor:"#1a1a35", borderColor:"rgba(255,107,0,0.2)", borderWidth:1, titleColor:"#f0f0f0", bodyColor:"#a0a0c0", callbacks:{label:function(ctx){return " Risk Points: "+ctx.raw;}} } }
    }
  });
}

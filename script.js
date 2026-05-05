const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const visitRange = document.querySelector("#visitRange");
const budgetRange = document.querySelector("#budgetRange");
const legalRange = document.querySelector("#legalRange");
const visitValue = document.querySelector("#visitValue");
const budgetValue = document.querySelector("#budgetValue");
const legalValue = document.querySelector("#legalValue");
const signalText = document.querySelector("#signalText");
const actionText = document.querySelector("#actionText");
const reportText = document.querySelector("#reportText");
const actionPill = document.querySelector("#actionPill");
const roiValue = document.querySelector("#roiValue");
const riskValue = document.querySelector("#riskValue");
const statusValue = document.querySelector("#statusValue");
const signalBars = document.querySelectorAll("#signalBars i");
const reportLines = document.querySelectorAll("#reportLines i");

const formatRisk = (visits, legal) => {
  if (visits < 55 || legal > 16) return "High";
  if (visits < 82 || legal > 8) return "Medium";
  return "Low";
};

const updateAiSimulator = () => {
  if (!visitRange || !budgetRange || !legalRange) return;

  const visits = Number(visitRange.value);
  const budget = Number(budgetRange.value);
  const legal = Number(legalRange.value);
  const roi = Math.max(1.1, Math.min(5.8, 1.1 + visits / 55 + budget / 75 - legal / 30));
  const risk = formatRisk(visits, legal);
  const budgetPressure = budget > 85 ? "high" : budget > 45 ? "controlled" : "low";
  const visitDelta = Math.max(5, Math.round((92 - visits) / 2));

  visitValue.textContent = visits;
  budgetValue.textContent = budget;
  legalValue.textContent = legal;
  roiValue.textContent = `${roi.toFixed(1)}x`;
  riskValue.textContent = risk;
  statusValue.textContent = legal > 14 ? "Legal review" : budget > 95 ? "Budget alert" : "Live";

  if (visits < 70) {
    signalText.textContent = `Coverage is ${visits}% and AI detects visit-frequency risk. Budget pressure is ${budgetPressure}, with ${legal} documents in the legal queue.`;
    actionText.textContent = `Increase visit frequency by ${visitDelta}% and focus investment on pharmacies with stronger sell-out signals.`;
    actionPill.textContent = `Increase visits +${visitDelta}%`;
  } else if (budget > 85) {
    signalText.textContent = `Investment budget is €${budget}k and AI detects the need for ROI rebalancing before the next cycle.`;
    actionText.textContent = "Pause weaker campaigns, shift budget to the brand/region with higher projected ROI and send a finance alert.";
    actionPill.textContent = "Rebalance budget";
  } else if (legal > 12) {
    signalText.textContent = `${legal} legal documents are slowing execution. AI flags a bottleneck in the approval flow.`;
    actionText.textContent = "Prioritize contracts with the highest revenue impact and send an automated reminder to the legal team.";
    actionPill.textContent = "Prioritize approvals";
  } else {
    signalText.textContent = `Flow is stable: coverage ${visits}%, budget €${budget}k, legal queue ${legal}. AI continues monitoring.`;
    actionText.textContent = "Keep execution pace, monitor sell-out and generate the weekly management summary.";
    actionPill.textContent = "Keep execution pace";
  }

  reportText.textContent = `Auto report updated: visits ${visits}%, investment €${budget}k, ROI ${roi.toFixed(1)}x, legal queue ${legal}, risk ${risk.toLowerCase()}.`;

  const bars = [visits, budget, roi * 20, 115 - legal * 3, (visits + budget) / 2];
  signalBars.forEach((bar, index) => {
    const height = Math.max(24, Math.min(96, bars[index]));
    bar.style.setProperty("--bar-height", `${height}%`);
    bar.style.filter = risk === "High" ? "hue-rotate(120deg)" : "none";
  });

  const reportWidths = [Math.min(100, visits), Math.min(100, budget), Math.max(34, 100 - legal * 3)];
  reportLines.forEach((line, index) => {
    line.style.setProperty("--report-width", `${reportWidths[index]}%`);
  });

  actionPill.style.transform = risk === "High" ? "scale(1.04)" : "scale(1)";
};

[visitRange, budgetRange, legalRange].forEach((input) => {
  input?.addEventListener("input", updateAiSimulator);
});

updateAiSimulator();

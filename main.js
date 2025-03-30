// Gestion du stockage local
function getQuitData() {
  const data = localStorage.getItem("quitData");
  return data ? JSON.parse(data) : null;
}

function saveQuitData(data) {
  localStorage.setItem("quitData", JSON.stringify(data));
}

function resetQuitData() {
  localStorage.removeItem("quitData");
}

// Seuils et descriptions des améliorations
const improvementsData = {
  heartRate: {
    threshold: 20,
    desc: "Your heart rate and blood pressure drop"
  },
  carbon: {
    threshold: 12 * 60,
    desc: "The carbon monoxide level in your blood drops to normal"
  },
  circulation: {
    threshold: 14 * 24 * 60,
    desc: "Your circulation improves and your lung function increases"
  },
  coughing: {
    threshold: 30 * 24 * 60,
    desc: "Coughing and shortness of breath decrease"
  },
  riskCoronary: {
    threshold: 365 * 24 * 60,
    desc: "Your risk of coronary heart disease is about half that of a smoker's"
  },
  strokeRisk: {
    threshold: 5 * 365 * 24 * 60,
    desc: "The stroke risk is that of a nonsmoker's"
  },
  lungCancer: {
    threshold: 10 * 365 * 24 * 60,
    desc: "Your risk of lung cancer falls to about half that of a smoker and your risk of cancer of the mouth, throat, esophagus, bladder, cervix, and pancreas decreases"
  },
  coronaryHeartDisease: {
    threshold: 15 * 365 * 24 * 60,
    desc: "The risk of coronary heart disease is that of a nonsmoker's"
  }
};

/**
 * Convert decimal hours to a string in days/hours/minutes.
 * Example: 1.75 hours => "1 hours 45 minutes"
 */
function formatHoursToDHMS(hoursFloat) {
  const totalMinutes = Math.floor(hoursFloat * 60);
  const days = Math.floor(totalMinutes / 1440); // 1440 = 60*24
  const remainderAfterDays = totalMinutes % 1440;
  const hours = Math.floor(remainderAfterDays / 60);
  const minutes = remainderAfterDays % 60;

  let result = "";
  if (days > 0) {
    result += days + " days ";
  }
  if (hours > 0) {
    result += hours + " hours ";
  }
  if (minutes > 0) {
    result += minutes + " minutes";
  }

  // If all are zero, show "0 minutes"
  return result.trim() || "0 minutes";
}

// Mise à jour des données du tableau de bord
function loadData() {
  const data = getQuitData();
  if (!data) return;

  // 1. Calcul des stats globales
  const lastSmoke = new Date(data.lastSmoke);
  const now = new Date();
  const elapsed = now - lastSmoke;
  const elapsedMinutes = elapsed / 60000;
  const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((elapsed / (1000 * 60)) % 60);

  document.getElementById("timeSince").textContent = `${days}d ${hours}h ${minutes}min`;
  document.getElementById("daysQuit").textContent = days;

  // Nombre total de cigarettes évitées
  const avoided = days * data.dailyCigs;
  // Argent économisé au total
  const money = (avoided / data.cigsPerPack) * data.packPrice;
  // Temps gagné (en heures) pour toutes les cigarettes évitées
  const timeSavedHours = (avoided * 11) / 60;

  // Mise à jour de l'ancien tableau de bord
  document.getElementById("cigsAvoided").textContent = avoided;
  document.getElementById("moneySaved").textContent = money.toFixed(2);
  document.getElementById("timeSaved").textContent = timeSavedHours.toFixed(1);

  // 2. Calcul des pourcentages pour chaque amélioration
  const calcPercent = (threshold) =>
    Math.min(100, (elapsedMinutes / threshold) * 100);

  const progressValues = {
    heartRate: calcPercent(improvementsData.heartRate.threshold),
    carbon: calcPercent(improvementsData.carbon.threshold),
    circulation: calcPercent(improvementsData.circulation.threshold),
    coughing: calcPercent(improvementsData.coughing.threshold),
    riskCoronary: calcPercent(improvementsData.riskCoronary.threshold),
    strokeRisk: calcPercent(improvementsData.strokeRisk.threshold),
    lungCancer: calcPercent(improvementsData.lungCancer.threshold),
    coronaryHeartDisease: calcPercent(improvementsData.coronaryHeartDisease.threshold)
  };

  let completed = 0;
  Object.entries(progressValues).forEach(([key, value]) => {
    const progress = Math.floor(value);
    if (progress >= 100) completed++;

    const bar = document.getElementById(`progress-${key}`);
    const label = document.getElementById(`percent-${key}`);
    if (bar) bar.style.width = `${progress}%`;
    if (label) label.textContent = `${progress}`;
  });

  // Mise à jour du compteur global
  const heartLabel = document.getElementById("healthProgressCount");
  if (heartLabel) {
    heartLabel.textContent = `${completed}/8`;
  }

  // Moyenne d'amélioration globale
  const average =
    Object.values(progressValues).reduce((a, b) => a + b, 0) /
    Object.keys(progressValues).length;
  document.getElementById("healthImprovement").textContent = Math.floor(average);

  // 3. Mise à jour des nouvelles stats "détaillées" (jour, semaine, mois, an)

  // -- A) CIGARETTES AVOIDED
  // Per day: user smokes "dailyCigs" => that many are avoided each day
  const cigsPerDay = data.dailyCigs;
  const cigsPerWeek = cigsPerDay * 7;
  const cigsPerMonth = cigsPerDay * 30; // approximate month
  const cigsPerYear = cigsPerDay * 365; // approximate year

  document.getElementById("cigsAvoidedDay").textContent = cigsPerDay;
  document.getElementById("cigsAvoidedWeek").textContent = cigsPerWeek;
  document.getElementById("cigsAvoidedMonth").textContent = cigsPerMonth;
  document.getElementById("cigsAvoidedYear").textContent = cigsPerYear;

  // -- B) MONEY SAVED
  // Money saved per day = (cigsPerDay / cigsPerPack) * packPrice
  const moneyPerDay = (cigsPerDay / data.cigsPerPack) * data.packPrice;
  const moneyPerWeek = moneyPerDay * 7;
  const moneyPerMonth = moneyPerDay * 30;
  const moneyPerYear = moneyPerDay * 365;

  document.getElementById("moneySavedDay").textContent = moneyPerDay.toFixed(2);
  document.getElementById("moneySavedWeek").textContent = moneyPerWeek.toFixed(2);
  document.getElementById("moneySavedMonth").textContent = moneyPerMonth.toFixed(2);
  document.getElementById("moneySavedYear").textContent = moneyPerYear.toFixed(2);

  // -- C) TIME WON BACK
  // Each cigarette avoided = 11 minutes
  // So time saved per day (in hours):
  const dailyTimeHours = (cigsPerDay * 11) / 60;
  const weeklyTimeHours = dailyTimeHours * 7;
  const monthlyTimeHours = dailyTimeHours * 30;
  const yearlyTimeHours = dailyTimeHours * 365;

  document.getElementById("timeSavedDay").textContent = formatHoursToDHMS(dailyTimeHours);
  document.getElementById("timeSavedWeek").textContent = formatHoursToDHMS(weeklyTimeHours);
  document.getElementById("timeSavedMonth").textContent = formatHoursToDHMS(monthlyTimeHours);
  document.getElementById("timeSavedYear").textContent = formatHoursToDHMS(yearlyTimeHours);
}

// Mise à jour de l'indicateur de progression en bague (ring)
function updateRingProgress(percent) {
  const safePercent = Math.max(0, Math.min(100, percent));
  const degrees = (safePercent / 100) * 360;
  const ring = document.getElementById("detailPercentage");
  ring.style.background = `conic-gradient(#00ff88 ${degrees}deg, #333 ${degrees}deg)`;
  // Mise à jour du pourcentage affiché dans le span au centre
  document.getElementById("progressText").textContent = safePercent + "%";
}

// Affichage de la vue de détail d'une amélioration avec mise à jour de la bague et du compte à rebours
function showImprovementDetail(improvementKey) {
  const improvement = improvementsData[improvementKey];
  if (!improvement) return;
  const data = getQuitData();
  if (!data) return;

  const lastSmoke = new Date(data.lastSmoke);
  const now = new Date();
  const elapsedMinutes = (now - lastSmoke) / 60000;
  const threshold = improvement.threshold;
  const progress = Math.min(100, (elapsedMinutes / threshold) * 100);
  const progressFloor = Math.floor(progress);

  // Mise à jour de la bague de progression
  updateRingProgress(progressFloor);
  document.getElementById("detailDesc").textContent = improvement.desc;

  // Si la progression est complète ou non
  if (progressFloor >= 100) {
    document.getElementById("detailCountdown").textContent = "You did it!";
    document.querySelector("#improvementDetail .detail-small").textContent = "Your health has improved";
  } else {
    const remainingMinutes = threshold - elapsedMinutes;
    let days = Math.floor(remainingMinutes / (60 * 24));
    const hours = Math.floor((remainingMinutes % (60 * 24)) / 60);
    const mins = Math.floor(remainingMinutes % 60);

    if (days >= 365) {
      const years = Math.floor(days / 365);
      const remDays = days % 365;
      document.getElementById("detailCountdown").textContent = `${years}y ${remDays}d ${hours}h ${mins}min remaining`;
    } else {
      document.getElementById("detailCountdown").textContent = `${days}d ${hours}h ${mins}min remaining`;
    }
    document.querySelector("#improvementDetail .detail-small").textContent = "Now it's just a matter of time";
  }
  showView("improvementDetail");
}

// Gestion de l'affichage des vues
function showView(viewId) {
  const views = document.querySelectorAll(".view");
  views.forEach((view) => {
    view.classList.toggle("hidden", view.id !== viewId);
  });
  const navLinks = document.querySelectorAll(".bottom-nav a");
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("data-view") === viewId);
  });
}

// Écouteurs d'événements
document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Reset all data?")) {
    resetQuitData();
    showView("settings");
  }
});

const settingsForm = document.getElementById("settingsForm");
if (settingsForm) {
  settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      lastSmoke: document.getElementById("lastSmoke").value,
      dailyCigs: parseInt(document.getElementById("dailyCigs").value, 10),
      cigsPerPack: parseInt(document.getElementById("cigsPerPack").value, 10),
      packPrice: parseFloat(document.getElementById("packPrice").value)
    };
    saveQuitData(data);
    showView("dashboard");
    loadData();
  });
}

const navLinks = document.querySelectorAll(".bottom-nav a");
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const viewId = link.getAttribute("data-view");
    showView(viewId);
    if (viewId === "dashboard" || viewId === "health") {
      loadData();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const storedData = getQuitData();
  if (storedData) {
    // Pré-remplir les champs Settings si des données existent
    document.getElementById("lastSmoke").value = storedData.lastSmoke;
    document.getElementById("dailyCigs").value = storedData.dailyCigs;
    document.getElementById("cigsPerPack").value = storedData.cigsPerPack;
    document.getElementById("packPrice").value = storedData.packPrice;
  }

  if (!storedData) {
    showView("settings");
  } else {
    showView("dashboard");
    loadData();
  }
});

// Mise à jour régulière des données toutes les 60 secondes
setInterval(() => {
  const current = document.querySelector(".view:not(.hidden)");
  if (current && (current.id === "dashboard" || current.id === "health")) {
    loadData();
  }
}, 60000);

// Écouteurs pour afficher le détail de chaque amélioration
document.querySelectorAll(".improvement").forEach((el) => {
  el.addEventListener("click", () => {
    const key = el.id.replace("impr-", "");
    showImprovementDetail(key);
  });
});

// Bouton retour dans la vue détail
document.getElementById("backFromDetail").addEventListener("click", () => {
  showView("health");
});

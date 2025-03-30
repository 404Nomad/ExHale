// ======================
//  LOCAL STORAGE HELPERS
// ======================
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

// We'll store achievements unlocked state separately
function getAchievementsProgress() {
  const data = localStorage.getItem("achievementsProgress");
  return data ? JSON.parse(data) : [];
}

function saveAchievementsProgress(progressArray) {
  localStorage.setItem("achievementsProgress", JSON.stringify(progressArray));
}

// ==============
// ACHIEVEMENTS
// ==============
/**
 * We'll define 100 achievements in categories:
 * 1) Days smoke-free (20)
 * 2) Cigs avoided (20)
 * 3) Money saved (20)
 * 4) Time saved (20)
 * 5) Fun & Misc (20)
 *
 * Each achievement has:
 * - id
 * - title
 * - desc
 * - icon
 * - check(stats) => boolean
 */
const achievementsData = (function createAchievements() {
  const arr = [];
  let idCounter = 1;

  // 1) Days smoke-free (20 achievements)
  const daysThresholds = [1, 2, 3, 5, 7, 10, 14, 21, 30, 50, 75, 100, 150, 200, 250, 300, 365, 500, 730, 1000];
  daysThresholds.forEach((threshold) => {
    arr.push({
      id: idCounter++,
      title: `Smoke-Free for ${threshold} days`,
      desc: `You've gone ${threshold} days without smoking!`,
      icon: "📅",
      check: (stats) => stats.days >= threshold,
    });
  });

  // 2) Cigs avoided (20 achievements)
  const cigsThresholds = [1, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 30000, 50000, 75000, 100000, 150000, 200000, 300000];
  cigsThresholds.forEach((threshold) => {
    arr.push({
      id: idCounter++,
      title: `${threshold} Cigarettes Avoided`,
      desc: `You have avoided ${threshold} cigarettes!`,
      icon: "🚭",
      check: (stats) => stats.cigsAvoided >= threshold,
    });
  });

  // 3) Money saved (20 achievements) - in euros
  const moneyThresholds = [1, 5, 10, 20, 50, 100, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 5000, 7500, 10000, 15000, 20000, 50000];
  moneyThresholds.forEach((threshold) => {
    arr.push({
      id: idCounter++,
      title: `Saved €${threshold}`,
      desc: `You have saved at least €${threshold} so far!`,
      icon: "💰",
      check: (stats) => stats.money >= threshold,
    });
  });

  // 4) Time saved (20 achievements) - in hours
  const timeThresholds = [1, 5, 10, 24, 48, 72, 100, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 5000, 7500, 10000, 15000, 20000];
  timeThresholds.forEach((threshold) => {
    arr.push({
      id: idCounter++,
      title: `${threshold} Hours Reclaimed`,
      desc: `You've reclaimed ${threshold} hours of your life!`,
      icon: "⏰",
      check: (stats) => stats.timeSavedHours >= threshold,
    });
  });

  // 5) Fun & Misc (20 achievements)
  //   We'll create some playful achievements with various thresholds.
  const funAchievements = [
    {
      name: "First Step",
      desc: "You avoided your very first cigarette!",
      icon: "🚀",
      check: (stats) => stats.cigsAvoided >= 1,
    },
    {
      name: "High Five",
      desc: "5 days smoke-free—give yourself a high five!",
      icon: "✋",
      check: (stats) => stats.days >= 5,
    },
    {
      name: "Double Digits",
      desc: "10 days smoke-free. Double digits, baby!",
      icon: "🔟",
      check: (stats) => stats.days >= 10,
    },
    {
      name: "Lucky Number 7",
      desc: "You avoided 7 cigarettes in total. Lucky you!",
      icon: "🍀",
      check: (stats) => stats.cigsAvoided >= 7,
    },
    {
      name: "Pocket Change",
      desc: "You saved over €2.50 in total. It's a start!",
      icon: "🪙",
      check: (stats) => stats.money >= 2.5,
    },
    {
      name: "One Hour Gained",
      desc: "You've reclaimed at least 1 hour of your life!",
      icon: "⏱️",
      check: (stats) => stats.timeSavedHours >= 1,
    },
    {
      name: "Morning Person",
      desc: "Over 24 hours without a smoke. Good morning indeed!",
      icon: "🌅",
      check: (stats) => stats.days >= 1,
    },
    {
      name: "Midnight Oil",
      desc: "You've saved at least 5 hours of your life. Burn that midnight oil on something better!",
      icon: "🌙",
      check: (stats) => stats.timeSavedHours >= 5,
    },
    {
      name: "Crisp €50",
      desc: "You saved €50 total. That's a nice dinner!",
      icon: "💸",
      check: (stats) => stats.money >= 50,
    },
    {
      name: "Century Mark",
      desc: "100 cigarettes avoided—you're unstoppable!",
      icon: "🏅",
      check: (stats) => stats.cigsAvoided >= 100,
    },
    {
      name: "One Week Warrior",
      desc: "7 days smoke-free, unstoppable!",
      icon: "💪",
      check: (stats) => stats.days >= 7,
    },
    {
      name: "Marathon Saver",
      desc: "Reclaimed 42 hours of life (a marathon in hours)!",
      icon: "🏃",
      check: (stats) => stats.timeSavedHours >= 42,
    },
    {
      name: "Party Time",
      desc: "Saved €100—time to celebrate responsibly!",
      icon: "🥳",
      check: (stats) => stats.money >= 100,
    },
    {
      name: "Quarter Master",
      desc: "25 days smoke-free. That's a quarter of 100!",
      icon: "🎉",
      check: (stats) => stats.days >= 25,
    },
    {
      name: "Payday",
      desc: "Saved over €500 total. Big money!",
      icon: "💎",
      check: (stats) => stats.money >= 500,
    },
    {
      name: "Night Owl",
      desc: "Over 50 hours reclaimed. Who needs sleep?",
      icon: "🦉",
      check: (stats) => stats.timeSavedHours >= 50,
    },
    {
      name: "No Looking Back",
      desc: "You've avoided 1,000 cigarettes. Incredible!",
      icon: "🚫",
      check: (stats) => stats.cigsAvoided >= 1000,
    },
    {
      name: "Halfway Hero",
      desc: "Reached 50% average health improvement.",
      icon: "⚕️",
      check: (stats) => stats.healthImprovement >= 50,
    },
    {
      name: "Full Recovery",
      desc: "Reached 100% average health improvement. Congratulations!",
      icon: "💖",
      check: (stats) => stats.healthImprovement >= 100,
    },
    {
      name: "Legendary Quitter",
      desc: "365 days smoke-free. A living legend!",
      icon: "🏆",
      check: (stats) => stats.days >= 365,
    },
  ];

  funAchievements.forEach((fa) => {
    arr.push({
      id: idCounter++,
      title: fa.name,
      desc: fa.desc,
      icon: fa.icon,
      check: fa.check,
    });
  });

  return arr;
})();

/**
 * Loads achievements progress from localStorage, checks achievements,
 * and then renders them in the achievements grid.
 */
function checkAndRenderAchievements(stats) {
  const progress = getAchievementsProgress();

  // progress is an array of booleans, same index as achievementsData
  // if empty, initialize with false
  if (progress.length !== achievementsData.length) {
    // re-init
    for (let i = 0; i < achievementsData.length; i++) {
      progress[i] = progress[i] || false;
    }
  }

  // Check each achievement
  achievementsData.forEach((ach, idx) => {
    if (!progress[idx]) {
      // If not unlocked yet, see if user meets requirement
      if (ach.check(stats)) {
        progress[idx] = true;
      }
    }
  });

  // Save the updated progress
  saveAchievementsProgress(progress);

  // Render achievements
  renderAchievements(progress);
}

function renderAchievements(progress) {
  const achievementsGrid = document.getElementById("achievementsGrid");
  achievementsGrid.innerHTML = "";

  let unlockedCount = 0;
  achievementsData.forEach((ach, idx) => {
    const isUnlocked = progress[idx];
    if (isUnlocked) unlockedCount++;

    const card = document.createElement("div");
    card.classList.add("achievement-card");
    if (!isUnlocked) {
      card.classList.add("locked");
    }

    card.innerHTML = `
      <div class="achievement-icon">${ach.icon}</div>
      <div class="achievement-title">${ach.title}</div>
      <div class="achievement-desc">${ach.desc}</div>
    `;

    achievementsGrid.appendChild(card);
  });

  // Update the "X/100" in the Achievements title
  document.getElementById("achievementsCount").textContent = `${unlockedCount}/${achievementsData.length}`;
}

// ======================
//   UTILITY FUNCTIONS
// ======================
/**
 * Convert decimal hours to a string in days/hours/minutes.
 * Example: 1.75 hours => "1 hours 45 minutes"
 */
function formatHoursToDHMS(hoursFloat) {
  const totalMinutes = Math.floor(hoursFloat * 60);
  const days = Math.floor(totalMinutes / 1440); // 1440 = 60*24
  const remainderAfterDays = totalMinutes % 1440;
  const hrs = Math.floor(remainderAfterDays / 60);
  const mins = remainderAfterDays % 60;

  let result = "";
  if (days > 0) {
    result += days + " days ";
  }
  if (hrs > 0) {
    result += hrs + " hours ";
  }
  if (mins > 0) {
    result += mins + " minutes";
  }
  return result.trim() || "0 minutes";
}

// ======================
//  MAIN LOAD DATA LOGIC
// ======================
function loadData() {
  const data = getQuitData();
  if (!data) return;

  const lastSmoke = new Date(data.lastSmoke);
  const now = new Date();
  const elapsed = now - lastSmoke;
  const elapsedMinutes = elapsed / 60000;
  const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((elapsed / (1000 * 60)) % 60);

  // Basic info
  document.getElementById("timeSince").textContent = `${days}d ${hours}h ${minutes}min`;
  document.getElementById("daysQuit").textContent = days;

  // Cigarettes avoided total
  const avoided = days * data.dailyCigs;
  // Money saved total
  const money = (avoided / data.cigsPerPack) * data.packPrice;
  // Time saved total in hours
  const timeSavedHours = (avoided * 11) / 60;

  document.getElementById("cigsAvoided").textContent = avoided;
  document.getElementById("moneySaved").textContent = money.toFixed(2);
  document.getElementById("timeSaved").textContent = timeSavedHours.toFixed(1);

  // Health improvements
  const calcPercent = (threshold) => Math.min(100, (elapsedMinutes / threshold) * 100);

  const progressValues = {
    heartRate: calcPercent(20),
    carbon: calcPercent(12 * 60),
    circulation: calcPercent(14 * 24 * 60),
    coughing: calcPercent(30 * 24 * 60),
    riskCoronary: calcPercent(365 * 24 * 60),
    strokeRisk: calcPercent(5 * 365 * 24 * 60),
    lungCancer: calcPercent(10 * 365 * 24 * 60),
    coronaryHeartDisease: calcPercent(15 * 365 * 24 * 60),
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

  // Overall health improvement
  const average = Object.values(progressValues).reduce((a, b) => a + b, 0) / Object.keys(progressValues).length;
  document.getElementById("healthImprovement").textContent = Math.floor(average);

  // Update health progress count
  const heartLabel = document.getElementById("healthProgressCount");
  if (heartLabel) {
    heartLabel.textContent = `${completed}/8`;
  }

  // Detailed stats (day/week/month/year)
  // Per day
  const cigsPerDay = data.dailyCigs;
  const moneyPerDay = (cigsPerDay / data.cigsPerPack) * data.packPrice;
  const dailyTimeHours = (cigsPerDay * 11) / 60;

  // Multiply up
  const cigsPerWeek = cigsPerDay * 7;
  const cigsPerMonth = cigsPerDay * 30;
  const cigsPerYear = cigsPerDay * 365;

  const moneyPerWeek = moneyPerDay * 7;
  const moneyPerMonth = moneyPerDay * 30;
  const moneyPerYear = moneyPerDay * 365;

  const weeklyTimeHours = dailyTimeHours * 7;
  const monthlyTimeHours = dailyTimeHours * 30;
  const yearlyTimeHours = dailyTimeHours * 365;

  // Update DOM
  document.getElementById("cigsAvoidedDay").textContent = cigsPerDay;
  document.getElementById("cigsAvoidedWeek").textContent = cigsPerWeek;
  document.getElementById("cigsAvoidedMonth").textContent = cigsPerMonth;
  document.getElementById("cigsAvoidedYear").textContent = cigsPerYear;

  document.getElementById("moneySavedDay").textContent = moneyPerDay.toFixed(2);
  document.getElementById("moneySavedWeek").textContent = moneyPerWeek.toFixed(2);
  document.getElementById("moneySavedMonth").textContent = moneyPerMonth.toFixed(2);
  document.getElementById("moneySavedYear").textContent = moneyPerYear.toFixed(2);

  document.getElementById("timeSavedDay").textContent = formatHoursToDHMS(dailyTimeHours);
  document.getElementById("timeSavedWeek").textContent = formatHoursToDHMS(weeklyTimeHours);
  document.getElementById("timeSavedMonth").textContent = formatHoursToDHMS(monthlyTimeHours);
  document.getElementById("timeSavedYear").textContent = formatHoursToDHMS(yearlyTimeHours);

  // Prepare a stats object for achievements
  const stats = {
    days: days,
    cigsAvoided: avoided,
    money: money,
    timeSavedHours: timeSavedHours,
    healthImprovement: Math.floor(average),
  };

  // Check achievements now
  checkAndRenderAchievements(stats);
}

// ======================
//   RING PROGRESS LOGIC
// ======================
function updateRingProgress(percent) {
  const safePercent = Math.max(0, Math.min(100, percent));
  const degrees = (safePercent / 100) * 360;
  const ring = document.getElementById("detailPercentage");
  ring.style.background = `conic-gradient(#00ff88 ${degrees}deg, #333 ${degrees}deg)`;
  document.getElementById("progressText").textContent = safePercent + "%";
}

// ======================
//  IMPROVEMENT DETAILS
// ======================
const improvementsData = {
  heartRate: { threshold: 20, desc: "Your heart rate and blood pressure drop" },
  carbon: {
    threshold: 12 * 60,
    desc: "The carbon monoxide level in your blood drops to normal",
  },
  circulation: {
    threshold: 14 * 24 * 60,
    desc: "Your circulation improves and your lung function increases",
  },
  coughing: {
    threshold: 30 * 24 * 60,
    desc: "Coughing and shortness of breath decrease",
  },
  riskCoronary: {
    threshold: 365 * 24 * 60,
    desc: "Your risk of coronary heart disease is about half that of a smoker's",
  },
  strokeRisk: {
    threshold: 5 * 365 * 24 * 60,
    desc: "The stroke risk is that of a nonsmoker's",
  },
  lungCancer: {
    threshold: 10 * 365 * 24 * 60,
    desc: "Your risk of lung cancer falls to about half that of a smoker and your risk of cancer of the mouth, throat, esophagus, bladder, cervix, and pancreas decreases",
  },
  coronaryHeartDisease: {
    threshold: 15 * 365 * 24 * 60,
    desc: "The risk of coronary heart disease is that of a nonsmoker's",
  },
};

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

  updateRingProgress(progressFloor);
  document.getElementById("detailDesc").textContent = improvement.desc;

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

// ======================
//   VIEW NAVIGATION
// ======================
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

// ======================
//   EVENT LISTENERS
// ======================
document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Reset all data?")) {
    resetQuitData();
    // Also reset achievements
    localStorage.removeItem("achievementsProgress");
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
      packPrice: parseFloat(document.getElementById("packPrice").value),
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
    if (viewId === "dashboard" || viewId === "health" || viewId === "achievements") {
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
  if (current && (current.id === "dashboard" || current.id === "health" || current.id === "achievements")) {
    loadData();
  }
}, 60000);

// Détails d'amélioration
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

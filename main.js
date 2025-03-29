// -----------------------------
// Gestion du localStorage
// -----------------------------
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
  
  // -----------------------------
  // Mise à jour du Dashboard
  // -----------------------------
  function loadData() {
    const data = getQuitData();
    if (!data) return;
  
    const lastSmoke = new Date(data.lastSmoke);
    const now = new Date();
    const elapsed = now - lastSmoke;
  
    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
  
    document.getElementById("timeSince").textContent = `${days}d ${hours}h ${minutes}min`;
    document.getElementById("daysQuit").textContent = days;
  
    const avoided = days * data.dailyCigs;
    const money = (avoided / data.cigsPerPack) * data.packPrice;
    const timeSaved = (avoided * 11) / 60; // 11 minutes par cigarette
  
    document.getElementById("cigsAvoided").textContent = avoided;
    document.getElementById("moneySaved").textContent = money.toFixed(2);
    document.getElementById("timeSaved").textContent = timeSaved.toFixed(1);
  }
  
  // -----------------------------
  // Réinitialisation
  // -----------------------------
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (confirm("Reset all data?")) {
      resetQuitData();
      // Après réinitialisation, on passe en mode settings
      showView("settings");
    }
  });
  
  // -----------------------------
  // Gestion du formulaire Settings
  // -----------------------------
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
      // Après sauvegarde, on retourne au dashboard et on recharge les données
      showView("dashboard");
      loadData();
    });
  }
  
  // -----------------------------
  // Navigation et affichage des vues
  // -----------------------------
  function showView(viewId) {
    const views = document.querySelectorAll(".view");
    views.forEach((view) => {
      view.classList.toggle("hidden", view.id !== viewId);
    });
  
    // Met à jour l'état actif de la nav
    const navLinks = document.querySelectorAll(".bottom-nav a");
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("data-view") === viewId);
    });
  }
  
  // Événements sur la nav
  const navLinks = document.querySelectorAll(".bottom-nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const viewId = link.getAttribute("data-view");
      showView(viewId);
      if (viewId === "dashboard") {
        loadData();
      }
    });
  });
  
  // -----------------------------
  // Initialisation
  // -----------------------------
  document.addEventListener("DOMContentLoaded", () => {
    // Si aucune donnée n'est enregistrée, afficher la vue Settings
    if (!getQuitData()) {
      showView("settings");
    } else {
      showView("dashboard");
      loadData();
    }
  });
  
  // Actualisation du dashboard toutes les minutes s'il est visible
  setInterval(() => {
    if (!document.getElementById("dashboard").classList.contains("hidden")) {
      loadData();
    }
  }, 60000);
  

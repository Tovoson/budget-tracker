import { state } from "./data.js";
import { renderDashboard } from "./components/dashboard.js";
import { formatAmount, badgeClass, badgeLabel } from "./utils/helpers.js";
import { renderTransactions, bindTransactions } from "./components/transactions.js";
import { bindBudgets, renderBudgetsPage } from "./components/budget.js";


// ─────────────────────────────────────────
//  ROUTER — navigate between pages
// ─────────────────────────────────────────

export function navigate(page) {
  state.currentPage = page;

  // Update URL hash so refresh works without server routing
  window.location.hash = `#${page}`;

  // Update active nav item
  document.querySelectorAll(".nav-item").forEach((el) => {
    el.classList.toggle(
      "active",
      el.dataset.page === page // read html attribute data-page in each nav-item
    );
  });

  // Render the right page
  const content = document.getElementById("pageContent");
  switch (page) {
    case "dashboard":
      content.innerHTML = renderDashboard();
      bindDashboard();
      break;
    case "transactions":
      content.innerHTML = renderTransactions();
      bindTransactions();
      break;
    case "budgets":
      content.innerHTML = renderBudgetsPage();
      bindBudgets();
      break;
    default:
      content.innerHTML = renderPlaceholder(page);
      break;
  }
}

// Bind dynamic events after dashboard renders
function bindDashboard() {
  const voirTout = document.querySelector(".voir-tout");
  if (voirTout) {
    voirTout.addEventListener("click", (e) => {
      e.preventDefault();
      navigate("transactions");
    });
  }
}

// ─────────────────────────────────────────
//  PAGE: PLACEHOLDER (Accounts, Reports…)
// ─────────────────────────────────────────

function renderPlaceholder(page) {
  const labels = {
    accounts: "Accounts",
    reports: "Reports",
    settings: "Settings",
  };
  return `
    <div class="placeholder-page">
      <h2>${labels[page] || page}</h2>
      <p>Cette page est en cours de développement.</p>
    </div>
  `;
}

// ─────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // Sidebar nav clicks
  document.querySelectorAll(".nav-item").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(el.dataset.page);
    });
  });

  // Add Expense button → go to transaction page
  document.getElementById("addExpenseBtn").addEventListener("click", () => {
    navigate("transactions");
  });

  // Handle back/forward via hash changes
  window.addEventListener("hashchange", () => {
    const page = window.location.hash.slice(1) || "dashboard";
    navigate(page);
    
  });
  // console.log(window.location.hash);

  // Initial render based on current hash
  const initialPage = window.location.hash.slice(1) || "dashboard";
  navigate(initialPage);
});

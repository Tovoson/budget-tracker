import { state } from "../data.js";

export function renderBudgetsPage() {
  return `
    <div class="dashboard-header">
      <div>
        <h1>Budgets</h1>
        <p>Suivez vos budgets mensuels.</p>
      </div>
    </div>
    <div class="budget-cards">
      ${state.budgets
        .map((b) => {
          const pct = Math.round((b.spent / b.total) * 100);
          return `
          <div class="budget-card">
            <div class="budget-card-header">
              <span class="budget-card-name">${b.name}</span>
              <span class="budget-card-pct ${b.pctClass}">${b.label}</span>
            </div>
            <div class="budget-card-amount">$${b.total.toFixed(2)}</div>
            <div class="budget-track">
              <div class="budget-fill ${b.colorClass}" style="width:${pct}%"></div>
            </div>
            <div class="budget-rest ${b.restWarning ? "warning" : ""}">${b.restLabel}</div>
          </div>
        `;
        })
        .join("")}
    </div>
  `;
}

import { state } from "../data.js";
import { formatAmount, badgeClass, badgeLabel } from "../utils/helpers.js";

export function renderDashboard() {
  return `
    <!-- Header -->
    <div class="dashboard-header">
      <div>
        <h1>Tableau de bord</h1>
        <p>Bienvenue, voici un aperçu de vos finances aujourd'hui.</p>
      </div>
      <div class="header-filters">
        <button class="filter-btn">Derniers 30 jours</button>
        <button class="filter-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filtrer
        </button>
      </div>
    </div>

    <!-- Top 3 cards -->
    <div class="top-cards">

      <!-- Balance -->
      <div class="card-balance">
        <div class="card-balance-label">Solde Disponible</div>
        <div class="card-balance-amount">$24,562.00</div>
        <div class="balance-stat">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <div>
            <div class="stat-label">Revenus Mensuels</div>
            <div class="stat-value">+$8,450.00</div>
          </div>
        </div>
        <div class="balance-stat">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
              <polyline points="17 18 23 18 23 12"/>
            </svg>
          </div>
          <div>
            <div class="stat-label">Dépenses Mensuelles</div>
            <div class="stat-value negative">-$3,120.45</div>
          </div>
        </div>
      </div>

      <!-- Donut -->
      <div class="card-donut">
        <div class="card-donut-title">
          Répartition des dépenses
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/>
          </svg>
        </div>
        <div class="donut-body">
          <div class="donut-svg-wrap">
            ${buildDonutSVG(state.donut, 3120)}
          </div>
          <div class="donut-legend">
            ${state.donut
              .map(
                (s) => `
              <div class="legend-item">
                <div class="legend-left">
                  <div class="legend-dot" style="background:${s.color}"></div>
                  <span class="legend-label">${s.label}</span>
                </div>
                <span class="legend-pct">${s.pct}%</span>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </div>

      <!-- Savings goal -->
      <div class="card-savings">
        <div class="savings-icon">🐘</div>
        <div class="savings-title">Objectif d'épargne</div>
        <div class="savings-sub">Vous avez atteint 85% de votre objectif "Vacances 2024"</div>
        <div class="savings-progress-track">
          <div class="savings-progress-fill"></div>
        </div>
      </div>
    </div>

    <!-- Recent transactions -->
    <div class="transactions-card">
      <div class="transactions-header">
        <h2>Transactions récentes</h2>
        <a class="voir-tout" data-page="transactions">Voir tout</a>
      </div>
      <table class="tx-table">
        <thead>
          <tr>
            <th>Détails</th>
            <th>Catégorie</th>
            <th>Date</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          ${state.transactions
            .map(
              (tx) => `
            <tr>
              <td>
                <div class="tx-detail">
                  <div class="tx-icon">${tx.icon}</div>
                  <span class="tx-name">${tx.name}</span>
                </div>
              </td>
              <td><span class="tx-badge ${badgeClass(tx.category)}">${badgeLabel(tx.category)}</span></td>
              <td><span class="tx-date">${tx.date}</span></td>
              <td class="tx-amount ${tx.amount >= 0 ? "positive" : "negative"}">${formatAmount(tx.amount)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>

    <!-- Budget cards -->
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

// ─────────────────────────────────────────
//  SVG DONUT CHART (pure JS, no library)
// ─────────────────────────────────────────

function buildDonutSVG(segments, total) {
  const r = 60;
  const cx = 80;
  const cy = 80;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  let paths = "";
  segments.forEach((seg) => {
    const dash = (seg.pct / 100) * circumference;
    const gap = circumference - dash;
    paths += `
      <circle
        cx="${cx}" cy="${cy}" r="${r}"
        fill="none"
        stroke="${seg.color}"
        stroke-width="18"
        stroke-dasharray="${dash} ${gap}"
        stroke-dashoffset="${-offset}"
        stroke-linecap="butt"
      />`;
    offset += dash;
  });

  return `
    <svg width="160" height="160" viewBox="0 0 160 160">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#f1f5f9" stroke-width="18"/>
      ${paths}
      <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="11" fill="#94a3b8" font-family="Trebuchet MS">Total</text>
      <text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="15" font-weight="700" fill="#0f172a" font-family="Trebuchet MS">$${total.toLocaleString()}</text>
    </svg>`;
}

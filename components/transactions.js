import { state } from "../data.js";
import { formatAmount, badgeClass, badgeLabel } from "../utils/helpers.js";

export function renderTransactions() {
  return `
    <div class="dashboard-header">
      <div>
        <h1>Transactions</h1>
        <p>Historique complet de vos transactions.</p>
      </div>
    </div>
    <div class="transactions-card">
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
  `;
}
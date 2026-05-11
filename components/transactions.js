import { state } from "../data.js";
import { navigate } from "../main.js";
import { formatAmount, badgeClass, badgeLabel, calculExpense, calculBudget } from "../utils/helpers.js";
import { iconLabel } from "../utils/helpers.js";

let expenses = [];
let selectedCategory = "Loisirs";

async function addExpense() {
  const expenseName = document.getElementById("nomDepense");
  const montantDepense = document.getElementById("montantDepense");
  const expenseDate = document.getElementById("date");
  const note = document.getElementById("note");

  const expense = {
    name: expenseName.value,
    amount: parseFloat(montantDepense.value),
    date: expenseDate.value,
    note: note.value,
    category: selectedCategory,
    icon: iconLabel(selectedCategory),
  };

  try {
    const response = fetch("http://localhost:3000/add-expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    });

    // const result = await response.json();
    console.log(response.message);
  } catch (error) {
    console.error("Error adding expense:", error);
  }

  expenseName.value = "";
  montantDepense.value = "";
  expenseDate.value = "";
  note.value = "";
}

function fetchExpenses() {
  const response = fetch("http://localhost:3000/getData")
    .then((res) => res.json())
    .then((data) => {
      expenses = data.data;
      console.log("Data from backend:", expenses);
    })
    .catch((err) => console.error("Error fetching data:", err));
}
  

function selectCategory(el) {
  document
    .querySelectorAll(".categorie-item")
    .forEach((c) => c.classList.remove("selected"));
  el.classList.add("selected");

  selectedCategory = el.querySelector(".categorie-txt").textContent;
  // console.log("selected category", selectedCategory);
}


globalThis.selectCategory = selectCategory;

export function renderTransactions() {

  const spent = Math.abs(calculExpense(expenses));
  const budget = calculBudget(expenses);
  const progress = budget > 0 ? (spent / budget) * 100 : 0;

  return `
    <div class="dashboard-header">
      <div>
        <h1>Transactions</h1>
      </div>
    </div>

    <div class="main-element">
      <!-- Form -->
      <div class="left-side">
        <form action="">
            <div class="container-input">
              <div class="input-left">
                <label for="montantDepense">MONTANT</label>
                <div class="input-container">
                  <span class="currency-prefix">€</span>
                  <input
                    type="number"
                    class="montant-input"
                    placeholder="0.00"
                    id="montantDepense"
                  />
                  <select class="montant" name="devise">
                    <option value="eur">EUR</option>
                    <option value="mga">Ariary</option>
                    <option value="usd">Dollar</option>
                  </select>
                </div>
              </div>

              <div class="input-right">
                <label for="nomDepense">NOM DE LA DÉPENSE</label>
                <input
                  type="text"
                  class="nom-depense-input"
                  placeholder="ex: Courses hebdomadaires"
                  id="nomDepense"
                />
              </div>
            </div>

            <div class="container-input">
              <div class="input-left">
                <label for="date">DATE</label>
                <div class="input-container">
                  <img
                    src="./icons/icons8-accueil-24.png"
                    class="input-icon"
                    alt=""
                  />
                  <input
                    type="date"
                    class="date-input"
                    id="date"
                    value="2024-05-20"
                  />
                </div>
              </div>

              <div class="input-right">
                <label for="categorie">CATÉGORIE</label>
                <div class="categorie-container">
                  <div class="categorie-item" onclick="selectCategory(this)">
                    <img
                      src="./icons/icons8-accueil-24.png"
                      class="cat-icon"
                      alt=""
                    />
                    <p class="categorie-txt">Nourriture</p>
                  </div>
                  <div
                    class="categorie-item selected"
                    onclick="selectCategory(this)"
                  >
                    <img
                      src="./icons/icons8-accueil-24.png"
                      class="cat-icon"
                      alt=""
                    />
                    <p class="categorie-txt">Loisirs</p>
                  </div>
                  <div class="categorie-item" onclick="selectCategory(this)">
                    <img
                      src="./icons/icons8-accueil-24.png"
                      class="cat-icon"
                      alt=""
                    />
                    <p class="categorie-txt">Loyer</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="note-container">
              <label for="note">NOTES (OPTIONNEL)</label>
              <textarea
                name="note"
                id="note"
                placeholder="Ajoutez des détails supplémentaires ici..."
              ></textarea>
            </div>

            <div class="btn-container">
              <button type="reset" class="btn-cancel">Annuler</button>
              <button type="button" class="btn-save" id="ajouterDepenseBtn">
                Enregistrer la dépense
              </button>
            </div>
          </form>
      
          <h1 class="dashboard-header-title">Historique complet de vos transactions.</h1>
      
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
                ${expenses
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
      </div>


        <!-- Right side cards -->
        <div class="right-side">
          <div class="card card-blue">
            <h4 class="card-blue-title">Gestion Intelligente</h4>
            <p class="card-blue-text">
              Cette dépense sera automatiquement déduite de votre budget
              "Loisirs" mensuel.
            </p>
          </div>

          <div class="card card-budget">
            <p class="card-section-label">ÉTAT DU BUDGET : LOISIRS</p>
            <div class="budget-amounts">
              <div>
                <p class="budget-sub-label">Dépensé ce mois</p>
                <p class="budget-spent">${spent} Ar</p>
              </div>
              <div class="budget-total-col">
                <p class="budget-sub-label">Budget total</p>
                <p class="budget-total">${budget} Ar</p>
              </div>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width: ${progress}%"></div>
            </div>
            <div class="budget-info-box">
              <img
                src="./icons/icons8-accueil-24.png"
                class="info-icon"
                alt="info"
              />
              <p>
                Il vous reste <strong>${budget - spent} Ar</strong> pour finir le mois en
                toute sérénité.
              </p>
            </div>
          </div>

          <div class="card card-tip">
            <p class="card-section-label">CONSEIL RAPIDE</p>
            <p class="tip-text">
              "Les dépenses de type 'Loisirs' ont augmenté de 12% par rapport
              au mois dernier. Pensez à vérifier vos abonnements actifs."
            </p>
          </div>
        </div>
      </div>
    </div>

  `;
}

export function bindTransactions() {

  fetchExpenses();

  const addExpenseBtn = document.getElementById("ajouterDepenseBtn");
  if (addExpenseBtn) {
    addExpenseBtn.addEventListener("click", function (e) {
      e.preventDefault();
      addExpense();
      if (expenses.length > 1) {
        // First expense added, re-render to show the table
        renderTransactions();
        navigate("transactions");
      }

      // const resp = fetch("http://localhost:3000/", {})
      //   .then((res) => res.json())
      //   .then((data) => console.log("Data from backend:", data))
      //   .catch((err) => console.error("Error fetching data:", err));
    });
  }
}



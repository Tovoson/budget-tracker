import { state } from "../data.js";
import { colorClass, pctClass } from "../utils/helpers.js";

let budgets = state.budgets; // Initialize budgets from state
export const fetchBudgetData = async () => {
  try {
    const response = await fetch("http://localhost:3000/getDataBudget");
    const result = await response.json();

    const budgetData = result.data.map((b) => {
      const remaining = b.total + b.spent;

      return {
        ...b,
        pctClass: pctClass(b),
        colorClass: colorClass(b),
        restWarning: remaining < 0,
        restLabel: `Ar ${remaining} restant`,
      };
    });

    
    budgets = budgetData;
    // console.log("after push", budgets);
  } catch (error) {
    console.error("Error fetching budget data:", error);
  }
};

function addBudget() {
  const budgetValue = document.getElementById("BudgetValueInput");
  const categorySelect = document.querySelector(".category-items");

  console.log(budgetValue.value);

  const newBudget = {
    name: categorySelect.value,
    total: parseFloat(budgetValue.value),
  };

  fetch("http://localhost:3000/add-budget", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBudget),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      // Optionally, update the UI or fetch the latest budget data
    })
    .catch((error) => {
      console.error("Error adding budget:", error);
    });

  console.log("New Budget:", newBudget);
}

export async function bindBudgets() {
  await fetchBudgetData();
  const addBudgetBtn = document.getElementById("addBudgetBtn");
  const budgetValueInput = document.getElementById("BudgetValueInput");
  const categoryItems = document.querySelectorAll(".category-items");
  addBudgetBtn.addEventListener("click", () => {
    addBudget();
  });

  // Initialize form with first budget data for demo purposes
  console.log("in bindBudgets", budgets);
  budgetValueInput.value = budgets[0].total;
  categoryItems.forEach((element) => {
    element.children[0].value = budgets[0].name;
  });

  // When user select on the option, the input value will change to the selected option
  categoryItems.forEach((element) => {
    element.addEventListener("change", (e) => {
      const selectedOption = e.target.value;
      // console.log("selected options", selectedOption);
      const selectedBudget = budgets.find((b) =>
        b.name.toLowerCase().includes(selectedOption.toLowerCase()),
      );
      // console.log(
      //   selectedBudget
      //     ? "Selected Budget: " + selectedBudget.name
      //     : "No matching budget found",
      // );
      if (selectedBudget) {
        budgetValueInput.value = selectedBudget.total;
        console.log("val",budgetValueInput.value);
      }
    });
  });
}

export function renderBudgetsPage() {
 ;
  return `
    <div class="dashboard-header">
      <div>
        <h1>Budgets</h1>
        <p>Suivez vos budgets mensuels.</p>
      </div>
    </div>
    <div class="budget-cards">
      ${
      
      budgets.map((b) => {
        const pct = Math.round((b.spent / b.total) * 100);
        return `
        <div class="budget-card">
          <div class="budget-card-header">
            <span class="budget-card-name">${b.name}</span>
            <span class="budget-card-pct ${b.pctClass}">${b.percentUsed}% utilisé</span>
          </div>
          <div class="budget-card-amount">Ar ${b.total}</div>
          <div class="budget-track">
            <div class="budget-fill ${b.colorClass}" style="width:${b.percentUsed}%"></div>
          </div>
          <div class="budget-rest ${b.restWarning ? "warning" : ""}">${b.restLabel}</div>
        </div>
      `;
          })
          .join("")
        
      }
    </div>
    <div class="add-budget-section">
      <div class="add-budget-form">
        <input type="text" class="add-budget-input" id="BudgetValueInput" placeholder="Valeur du budget" />
        <select class="category-items" name="CategoryName">
        <option value="nourriture">Nourriture</option>
          <option value="loisirs">Loisirs</option>
          <option value="loyer">Loyer</option>
        </select>
      </div>
      <button class="add-budget-btn" id="addBudgetBtn">Ajouter Budget</button>
    </div>
  `;
}

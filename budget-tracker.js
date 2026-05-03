const expenseName = document.getElementById("nomDepense");
const montantDepense = document.getElementById("montantDepense");
const addExpenseBtn = document.getElementById("ajouterDepenseBtn");
//const devise = document.getElementById("devise");
const expenseDate = document.getElementById("date");
const note = document.getElementById("note");

let expenses = [];

let selectedCategory = "Loisirs";

function selectCategory(el) {
  document
    .querySelectorAll(".categorie-item")
    .forEach((c) => c.classList.remove("selected"));
  el.classList.add("selected");

  selectedCategory = el.querySelector(".categorie-txt").textContent;
  console.log("selected category", selectedCategory);
}

function addExpense() {
  const expense = {
    nom: expenseName.value,
    montant: parseFloat(montantDepense.value),
    //devise: devise.value,
    date: expenseDate.value,
    note: note.value,
    categorie: selectedCategory,
  };



  expenses.push(expense);
  console.log(expenses);
  expenseName.value = "";
  montantDepense.value = "";
  expenseDate.value = "";
  note.value = "";
}

addExpenseBtn.addEventListener("click", function (e) {
  e.preventDefault();
  addExpense();
});

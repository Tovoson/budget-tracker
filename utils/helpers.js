export function formatAmount(amount) {
  const abs = Math.abs(amount)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return amount >= 0 ? `+$${abs}` : `-$${abs}`;
}

export function badgeClass(category) {
  const map = {
    nourriture: "badge-nourriture",
    loisirs: "badge-loisirs",
    revenu: "badge-revenu",
    logement: "badge-logement",
  };
  return map[category] || "badge-logement";
}

export function badgeLabel(category) {
  const map = {
    nourriture: "Nourriture",
    loisirs: "Loisirs",
    revenu: "Revenu",
    logement: "Logement",
  };
  return map[category] || category;
}

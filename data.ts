type Depense = {
    id: number;
    name: string;
    montantDepense: number;
    date: string;
    categorie: string;
    description: string;
}

type Account = {
    id: number;
    name: string;
    email: string;
    depenses: Depense[];
    budgetLoyer: number;
    budgetCou: number;
    budgetLoisirs: number;
    revenue: number;
}

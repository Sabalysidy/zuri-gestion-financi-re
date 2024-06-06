// Définition de la fonction addTransaction en dehors de l'événement DOMContentLoaded
function addTransaction(transaction) {
  const listItem = document.createElement("li");
  listItem.className = "list-group-item";
  listItem.textContent = `${transaction.date} - ${
    transaction.type === "income" ? "Entrée" : "Dépense"
  }: ${transaction.description} - ${transaction.amount} Fcfa`;
  transactionList.appendChild(listItem);
}

document.addEventListener("DOMContentLoaded", function () {
  const transactionForm = document.getElementById("transactionForm");
  const transactionList = document.getElementById("transactionList");
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;
    const type = document.getElementById("type").value;

    if (!validateAmount(amount)) {
      alert("Veuillez saisir un montant valide.");
      return; // Arrête l'exécution de la fonction
    }

    const transaction = {
      description,
      amount: parseFloat(amount),
      type,
      date: new Date().toLocaleString(),
    };

    addTransaction(transaction); // Maintenant, addTransaction est accessible ici
    updateFinancialStatus(transaction);

    // Réinitialiser le formulaire après soumission
    transactionForm.reset();
  });

  function updateFinancialStatus(transaction) {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    const { incomeTotal, expenseTotal } = calculateTotals();
    let financialStatusText = "";

    if (incomeTotal > expenseTotal) {
      financialStatusText = `Vous êtes en gain de ${
        ((incomeTotal - expenseTotal) / incomeTotal) * 100
      }%`;
    } else if (incomeTotal < expenseTotal) {
      financialStatusText = `Vous êtes en perte de ${
        ((expenseTotal - incomeTotal) / incomeTotal) * 100
      }%`;
    } else {
      financialStatusText = `Votre situation financière est équilibrée`;
    }

    document.getElementById("financialStatus").textContent =
      financialStatusText;
  }

  function calculateTotals() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction && typeof transaction.type === "string") {
        if (transaction.type === "income") {
          incomeTotal += transaction.amount;
        } else if (transaction.type === "expense") {
          expenseTotal += transaction.amount;
        }
      }
    });

    return { incomeTotal, expenseTotal };
  }

  function validateAmount(amount) {
    returnisNaN(amount) && parseFloat(amount) > 0;
  }

  loadTransactions(); // Appelle la fonction loadTransactions

  // Gestion du changement de thème
  themeToggle.addEventListener("click", function () {
    if (body.classList.contains("dark-theme")) {
      body.classList.remove("dark-theme");
      body.classList.add("light-theme");
      themeToggle.textContent = "Mode Sombre";
    } else {
      body.classList.remove("light-theme");
      body.classList.add("dark-theme");
      themeToggle.textContent = "Mode Clair";
    }
  });
});

function loadTransactions() {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.forEach((transaction) => addTransaction(transaction)); // Utilisation de addTransaction ici
}

// Fonction pour calculer et afficher les totaux
function updateTransactionStats() {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const { incomeTotal, expenseTotal } = calculateTotals(transactions);
  displayTransactionStats(incomeTotal, expenseTotal);
}

// Fonction pour calculer les totaux
function calculateTotals(transactions) {
  let incomeTotal = 0;
  let expenseTotal = 0;

  transactions.forEach((transaction) => {
    if (transaction && typeof transaction.type === "string") {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else if (transaction.type === "expense") {
        expenseTotal += transaction.amount;
      }
    }
  });

  return { incomeTotal, expenseTotal };
}

// Fonction pour afficher les stats
function displayTransactionStats(incomeTotal, expenseTotal) {
  let financialStatusText = "";
  if (incomeTotal > expenseTotal) {
    financialStatusText = `Vous êtes en gain de ${
      ((incomeTotal - expenseTotal) / incomeTotal) * 100
    }%`;
  } else if (incomeTotal < expenseTotal) {
    financialStatusText = `Vous êtes en perte de ${
      ((expenseTotal - incomeTotal) / incomeTotal) * 100
    }%`;
  } else {
    financialStatusText = `Votre situation financière est équilibrée`;
  }
  document.getElementById("financialStatus").textContent = financialStatusText;
}

// Utilisation de setInterval pour mettre à jour les stats toutes les 5 secondes
setInterval(updateTransactionStats, 3000);

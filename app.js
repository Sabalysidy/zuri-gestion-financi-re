document.addEventListener("DOMContentLoaded", function () {
  const transactionForm = document.getElementById("transactionForm");
  const transactionList = document.getElementById("transactionList");
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  const financialStatus = document.getElementById("financialStatus");
  const totalAmountDisplay = document.getElementById("totalAmount");

  class Transaction {
    constructor(description, amount, type, category) {
      this.description = description;
      this.amount = parseFloat(amount);
      this.type = type;
      this.category = category;
      this.date = new Date().toLocaleString();
    }
  }

  function addTransaction(transaction, index) {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between align-items-center";
    listItem.dataset.index = index;

    const amountSpan = document.createElement("span");
    amountSpan.textContent = `${transaction.amount} Fcfa`;
    amountSpan.className = transaction.type === "income" ? "badge badge-success" : "badge badge-danger";

    const detailDiv = document.createElement("div");
    detailDiv.className = "d-flex flex-column justify-content-center align-items-start";

    const dateSpan = document.createElement("span");
    dateSpan.textContent = transaction.date;
    dateSpan.className = "font-weight-bold";
    detailDiv.appendChild(dateSpan);

    const descriptionSpan = document.createElement("span");
    descriptionSpan.textContent = transaction.description;
    detailDiv.appendChild(descriptionSpan);

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger btn-sm ml-2";
    deleteButton.innerHTML = '<i class="bi bi-trash"></i>'; // Remplacer le texte par l'icône trash
    deleteButton.onclick = function () {
      deleteTransaction(index);
    };

    listItem.appendChild(amountSpan);
    listItem.appendChild(detailDiv);
    listItem.appendChild(deleteButton);

    transactionList.appendChild(listItem);
  }

  function updateFinancialStatus() {
    const { incomeTotal, expenseTotal } = calculateTotals();
    let financialStatusText = "";

    if (incomeTotal > expenseTotal) {
      financialStatusText = `Vous êtes en gain de ${(((incomeTotal - expenseTotal) / incomeTotal) * 100).toFixed(2)}%`;
    } else if (incomeTotal < expenseTotal) {
      financialStatusText = `Vous êtes en perte de ${(((expenseTotal - incomeTotal) / incomeTotal) * 100).toFixed(2)}%`;
    } else {
      financialStatusText = `Votre situation financière est équilibrée`;
    }

    financialStatus.textContent = financialStatusText;
  }

  function calculateTotals() {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else if (transaction.type === "expense") {
        expenseTotal += transaction.amount;
      }
    });

    return { incomeTotal, expenseTotal };
  }

  function updateTotalAmount() {
    const { incomeTotal, expenseTotal } = calculateTotals();
    const totalAmount = incomeTotal - expenseTotal;
    totalAmountDisplay.textContent = `Montant total : ${totalAmount} Fcfa`;
  }

  function validateAmount(amount) {
    return !isNaN(amount) && parseFloat(amount) > 0;
  }

  function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactionList.innerHTML = '';
    transactions.forEach((transaction, index) => addTransaction(transaction, index));
    updateFinancialStatus();
    updateTotalAmount();
  }

  function saveTransaction(transaction) {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }

  function deleteTransaction(index) {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const transactionToDelete = transactions[index];
    const confirmationMessage = `Êtes-vous sûr de vouloir supprimer la transaction : ${transactionToDelete.description} ?`;

    if (confirm(confirmationMessage)) {
      transactions.splice(index, 1);
      localStorage.setItem("transactions", JSON.stringify(transactions));
      loadTransactions();
    }
}


  transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;
    const type = document.getElementById("type").value;

    if (!validateAmount(amount)) {
      alert("Veuillez saisir un montant valide (numérique et positif).");
      return;
    }

    const transaction = new Transaction(description, amount, type);
    saveTransaction(transaction);
    loadTransactions();
    transactionForm.reset();
  });

  themeToggle.addEventListener("click", function () {
    if (body.classList.contains("dark-theme")) {
      body.classList.remove("dark-theme");
      body.classList.add("light-theme");
      themeToggle.className = "bi bi-moon";
    } else {
      body.classList.remove("light-theme");
      body.classList.add("dark-theme");
      themeToggle.className = "bi bi-sun";
    }
  });

  loadTransactions();
  setInterval(updateFinancialStatus, 3000);
});

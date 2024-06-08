document.addEventListener("DOMContentLoaded", function () {
    const transactionForm = document.getElementById("transactionForm");
    const transactionList = document.getElementById("transactionList");
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;
    const financialStatus = document.getElementById("financialStatus");
    const totalAmountDisplay = document.getElementById("totalAmount");
  
    transactionForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const description = document.getElementById("description").value;
      const amount = document.getElementById("amount").value;
      const type = document.getElementById("type").value;
  
      if (!validateAmount(amount)) {
        alert("Veuillez saisir un montant valide.");
        return;
      }
  
      const transaction = {
        description,
        amount: parseFloat(amount),
        type,
        date: new Date().toLocaleString(),
      };
  
      addTransaction(transaction);
      updateFinancialStatus(transaction);
      updateTotalAmount();
      transactionForm.reset();
    });
  
    function addTransaction(transaction) {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.textContent = `${transaction.date} - ${
        transaction.type === "income" ? "Entrée" : "Dépense"
      }: ${transaction.description} - ${transaction.amount} Fcfa`;
      transactionList.appendChild(listItem);
    }
  
    function updateFinancialStatus(transaction) {
      let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
      transactions.push(transaction);
      localStorage.setItem("transactions", JSON.stringify(transactions));
  
      const { incomeTotal, expenseTotal } = calculateTotals();
      let financialStatusText = "";
  
      if (incomeTotal > expenseTotal) {
        financialStatusText = `Vous êtes en gain de ${(
          ((incomeTotal - expenseTotal) / incomeTotal) *
          100
        ).toFixed(2)}%`;
      } else if (incomeTotal < expenseTotal) {
        financialStatusText = `Vous êtes en perte de ${(
          ((expenseTotal - incomeTotal) / incomeTotal) *
          100
        ).toFixed(2)}%`;
      } else {
        financialStatusText = `Votre situation financière est équilibrée`;
      }
  
      financialStatus.textContent = financialStatusText;
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
      return !isNaN(amount) && parseFloat(amount) > 0;
    }
  
    function loadTransactions() {
      const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
      transactions.forEach((transaction) => addTransaction(transaction));
      updateTransactionStats();
      updateTotalAmount();
    }
  
    function updateTransactionStats() {
      let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
      const { incomeTotal, expenseTotal } = calculateTotals(transactions);
      displayTransactionStats(incomeTotal, expenseTotal);
    }
  
    function displayTransactionStats(incomeTotal, expenseTotal) {
      let financialStatusText = "";
      if (incomeTotal > expenseTotal) {
        financialStatusText = `Vous êtes en gain de ${(
          ((incomeTotal - expenseTotal) / incomeTotal) *
          100
        ).toFixed(2)}%`;
      } else if (incomeTotal < expenseTotal) {
        financialStatusText = `Vous êtes en perte de ${(
          ((expenseTotal - incomeTotal) / incomeTotal) *
          100
        ).toFixed(2)}%`;
      } else {
        financialStatusText = `Votre situation financière est équilibrée`;
      }
      financialStatus.textContent = financialStatusText;
    }
  
    function updateTotalAmount() {
      let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
      let totalAmount = 0;
  
      transactions.forEach((transaction) => {
        if (transaction && typeof transaction.type === "string") {
          if (transaction.type === "income") {
            totalAmount += transaction.amount;
          } else if (transaction.type === "expense") {
            totalAmount -= transaction.amount;
          }
        }
      });
  
      totalAmountDisplay.textContent = `Montant total: ${totalAmount} Fcfa`;
    }
  
    setInterval(updateTransactionStats, 3000);
  
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
  });
  
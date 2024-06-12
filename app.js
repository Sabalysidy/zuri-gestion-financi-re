document.addEventListener("DOMContentLoaded", function () {
  const transactionForm = document.getElementById("transactionForm");
  const transactionList = document.getElementById("transactionList");
  const financialStatus = document.getElementById("financialStatus");
  const totalAmountDisplay = document.getElementById("totalAmount");
  const transactionDetails = document.getElementById("transactionDetails");
  const transactionContainer = document.getElementById("transactionContainer");
  const transactionModal = new bootstrap.Modal(
    document.getElementById("transactionModal"),
    {
      keyboard: true,
    }
  );

  class Transaction {
    constructor(amount, type) {
      this.amount = parseFloat(amount);
      this.type = type;
      this.date = new Date().toLocaleString();
    }
  }

  function addTransaction(transaction, index) {
    const listItem = document.createElement("li");
    listItem.className =
      "list-group-item d-flex justify-content-between align-items-center";
    listItem.dataset.index = index;

    const formattedAmount = transaction.amount.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const amountSpan = document.createElement("span");
    amountSpan.textContent = `${formattedAmount} Fcfa`;
    amountSpan.className =
      transaction.type === "income"
        ? "badge badge-success"
        : "badge badge-danger";

    const detailDiv = document.createElement("div");
    detailDiv.className =
      "d-flex flex-column justify-content-center align-items-start";

    const typeText = transaction.type === "income" ? "Dépôt" : "Retrait";
    const typeSpan = document.createElement("span");
    typeSpan.textContent = typeText;
    detailDiv.appendChild(typeSpan);

    const dateWithoutTime = new Date(transaction.date).toLocaleDateString();
    const dateSpan = document.createElement("span");
    dateSpan.textContent = dateWithoutTime;
    dateSpan.className = "font-weight-bold";
    detailDiv.appendChild(dateSpan);

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger btn-sm ml-2";
    deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
    deleteButton.onclick = function (event) {
      event.stopPropagation();
      deleteTransaction(index);
    };

    listItem.appendChild(amountSpan);
    listItem.appendChild(detailDiv);
    listItem.appendChild(deleteButton);
    listItem.onclick = function () {
      showTransactionDetails(transaction);
    };

    transactionList.appendChild(listItem);
  }

  function showTransactionDetails(transaction) {
    const typeText = transaction.type === "income" ? "Dépôt" : "Retrait";
    transactionDetails.innerHTML = `
      <p><strong>Montant:</strong> ${transaction.amount.toLocaleString(
        "fr-FR",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )} Fcfa</p>
      <p><strong>Type:</strong> ${typeText}</p>
      <p><strong>Date:</strong> ${transaction.date}</p>
    `;
    transactionModal.show();
  }

  function updateFinancialStatus() {
    const { incomeTotal, expenseTotal } = calculateTotals();
    let financialStatusText = "";
    let percentage = 0;
    let icon = "";

    if (incomeTotal > 0) {
      percentage = ((incomeTotal - expenseTotal) / incomeTotal) * 100;
    }

    if (incomeTotal === expenseTotal) {
      financialStatusText = `Votre situation financière est équilibrée`;
    } else if (percentage < 50) {
      financialStatusText = `Vous êtes en perte de ${percentage.toFixed(2)}%`;
      icon = `<i class="bi bi-arrow-down-circle" style="color: red;"></i>`;
    } else {
      financialStatusText = `Vous êtes en gain de ${percentage.toFixed(2)}%`;
      icon = `<i class="bi bi-arrow-up-circle" style="color: green;"></i>`;
    }

    financialStatus.innerHTML = `${icon} ${financialStatusText}`;
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
    const totalAmount = (incomeTotal - expenseTotal).toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    totalAmountDisplay.textContent = `Montant total : ${totalAmount} Fcfa`;
  }

  function validateAmount(amount) {
    return !isNaN(amount) && parseFloat(amount) > 0;
  }

  function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactionList.innerHTML = "";
    transactions.forEach((transaction, index) =>
      addTransaction(transaction, index)
    );
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
    const confirmationMessage = `Êtes-vous sûr de vouloir supprimer cette transaction ?`;

    if (confirm(confirmationMessage)) {
      transactions.splice(index, 1);
      localStorage.setItem("transactions", JSON.stringify(transactions));
      loadTransactions();
    }
  }

  transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const amount = document.getElementById("amount").value;
    const type = document.getElementById("type").value;

    if (!validateAmount(amount)) {
      alert("Veuillez saisir un montant valide (numérique et positif).");
      return;
    }

    const transaction = new Transaction(amount, type);
    saveTransaction(transaction);
    loadTransactions();
    transactionForm.reset();
  });

  transactionContainer.addEventListener("scroll", function () {
    if (transactionContainer.scrollTop > 0) {
      transactionForm.classList.add("hidden");
    } else {
      transactionForm.classList.remove("hidden");
    }
  });

  loadTransactions();
  setInterval(updateFinancialStatus, 3000);
});

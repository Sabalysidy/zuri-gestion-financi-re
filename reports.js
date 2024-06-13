document.addEventListener("DOMContentLoaded", function () {
  const financialReport = document.getElementById("financialReport");
  const salesReport = document.getElementById("salesReport");

  // Chargement du rapport financier
  function loadFinancialReport() {
      const { incomeTotal, expenseTotal } = calculateTotals();

      let financialReportHTML = `
          <h3>Rapport Financier</h3>
          <p><strong>Total des Dépôts:</strong> ${incomeTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Fcfa</p>
          <p><strong>Total des Retraits:</strong> ${expenseTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Fcfa</p>
      `;

      financialReport.innerHTML = financialReportHTML;

      // Création du graphique financier
      const financialChartCanvas = document.getElementById("financialChart");
      const financialChartCtx = financialChartCanvas.getContext("2d");

      const financialData = {
          labels: ["Dépôts", "Retraits"],
          datasets: [{
              label: 'Montant (Fcfa)',
              data: [incomeTotal, expenseTotal],
              backgroundColor: [
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: [
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1
          }]
      };

      const financialChartOptions = {
          scales: {
              y: {
                  beginAtZero: true,
                  ticks: {
                      callback: function (value) {
                          return `${value.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Fcfa`;
                      }
                  }
              }
          }
      };

      new Chart(financialChartCtx, {
          type: 'bar',
          data: financialData,
          options: financialChartOptions
      });
  }

  // Chargement du rapport des ventes sous forme de graphique
  function loadSalesReport() {
      const sales = JSON.parse(localStorage.getItem("sales")) || [];
      let totalAmount = 0;
      const salesLabels = sales.map(sale => sale.date);
      const salesData = sales.map(sale => parseFloat(sale.amount));

      sales.forEach(sale => {
          totalAmount += parseFloat(sale.amount);
      });

      let salesReportHTML = `
          <h3>Rapport des Ventes</h3>
          <div class="text-center font-weight-bold mt-3">Chiffre d'affaires total: <span id="totalSalesAmount">${totalAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Fcfa</span></div>
      `;

      salesReport.innerHTML = salesReportHTML;

      // Création du graphique des ventes
      const salesChartCanvas = document.getElementById("salesChart");
      const salesChartCtx = salesChartCanvas.getContext("2d");

      const salesChartData = {
          labels: salesLabels,
          datasets: [{
              label: 'Montant (Fcfa)',
              data: salesData,
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1
          }]
      };

      const salesChartOptions = {
          scales: {
              y: {
                  beginAtZero: true,
                  ticks: {
                      callback: function (value) {
                          return `${value.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Fcfa`;
                      }
                  }
              }
          }
      };

      new Chart(salesChartCtx, {
          type: 'line',
          data: salesChartData,
          options: salesChartOptions
      });
  }

  // Calcul des totaux financiers
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

  // Chargement initial des rapports
  loadFinancialReport();
  loadSalesReport();

  // Actualisation du chiffre d'affaires total en temps réel
  function updateTotalSalesAmount() {
      const sales = JSON.parse(localStorage.getItem("sales")) || [];
      let totalAmount = 0;

      sales.forEach(sale => {
          totalAmount += parseFloat(sale.amount);
      });

      document.getElementById("totalSalesAmount").textContent = `${totalAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Fcfa`;
  }

  // Écouteur d'événement pour détecter les nouvelles ventes et mettre à jour le rapport
  window.addEventListener("storage", function (event) {
      if (event.key === "sales") {
          updateTotalSalesAmount();
          loadSalesReport();
      }
  });

});

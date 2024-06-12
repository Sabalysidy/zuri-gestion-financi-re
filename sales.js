document.addEventListener("DOMContentLoaded", function () {
  const saleForm = document.getElementById("saleForm");
  const form = document.getElementById("salesForm");
  const salesTableBody = document.getElementById("salesTableBody");
  const chiffreAffaireDisplay = document.getElementById("chiffreAffaire");
  const itemsPerPage = 10; // Nombre d'éléments à afficher par page
  let currentPage = 1; // Page actuelle, initialisée à 1

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      form.classList.add("hidden");
    } else {
      form.classList.remove("hidden");
    }
  });

  function loadSales() {
    const sales = JSON.parse(localStorage.getItem("sales")) || [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSales = sales.slice(startIndex, endIndex);
    salesTableBody.innerHTML = "";
    let totalAmount = 0;

    currentSales.forEach((sale, index) => {
      const row = document.createElement("tr");

      const imgCell = document.createElement("td");
      const img = document.createElement("img");
      img.src = sale.productImage;
      img.alt = "Image du produit";
      img.style.width = "50px";
      img.style.height = "50px";
      imgCell.appendChild(img);

      const amountCell = document.createElement("td");
      amountCell.textContent = `${parseFloat(sale.amount).toLocaleString(
        "fr-FR",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )} Fcfa`;

      const dateCell = document.createElement("td");
      dateCell.textContent = sale.date;

      const phoneCell = document.createElement("td");
      phoneCell.textContent = sale.customerPhone;

      row.appendChild(imgCell);
      row.appendChild(amountCell);
      row.appendChild(dateCell);
      row.appendChild(phoneCell);
      salesTableBody.appendChild(row);

      totalAmount += parseFloat(sale.amount);
    });

    chiffreAffaireDisplay.textContent = `Chiffre d'affaires : ${totalAmount.toLocaleString(
      "fr-FR",
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )} Fcfa`;

    updatePaginationButtons();
  }

  function updatePaginationButtons() {
    const sales = JSON.parse(localStorage.getItem("sales")) || [];
    const totalPages = Math.ceil(sales.length / itemsPerPage);

    // Supprimer les boutons de pagination existants
    const paginationContainer = document.getElementById("paginationContainer");
    paginationContainer.innerHTML = "";

    // Ajouter un bouton pour la page précédente avec une flèche vers la gauche
    const prevButton = document.createElement("button");
    prevButton.classList.add("btn", "btn-primary", "mx-1");
    prevButton.innerHTML = '<i class="bi bi-chevron-left"></i>';
    prevButton.addEventListener("click", function () {
      previousPage();
    });
    paginationContainer.appendChild(prevButton);

    // Créer et ajouter les boutons de pagination avec des numéros de page
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.classList.add("btn", "btn-primary", "mx-1");
      button.textContent = i;
      button.addEventListener("click", function () {
        goToPage(i);
      });
      paginationContainer.appendChild(button);
    }

    // Ajouter un bouton pour la page suivante avec une flèche vers la droite
    const nextButton = document.createElement("button");
    nextButton.classList.add("btn", "btn-primary", "mx-1");
    nextButton.innerHTML = '<i class="bi bi-chevron-right"></i>';
    nextButton.addEventListener("click", function () {
      nextPage();
    });
    paginationContainer.appendChild(nextButton);
  }

  function previousPage() {
    if (currentPage > 1) {
      currentPage--;
      loadSales();
    }
  }

  function nextPage() {
    const sales = JSON.parse(localStorage.getItem("sales")) || [];
    const totalPages = Math.ceil(sales.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      loadSales();
    }
  }

  function goToPage(pageNumber) {
    const totalPages = Math.ceil(
      JSON.parse(localStorage.getItem("sales")).length / itemsPerPage
    );
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      currentPage = pageNumber;
      loadSales();
    }
  }

  function saveSale(sale) {
    const sales = JSON.parse(localStorage.getItem("sales")) || [];
    sales.push(sale);
    localStorage.setItem("sales", JSON.stringify(sales));
  }

  saleForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const productImageInput = document.getElementById("productImage");
    const saleAmount = document.getElementById("saleAmount").value;
    const saleDate = document.getElementById("saleDate").value;
    const customerPhone = document.getElementById("customerPhone").value;

    const reader = new FileReader();
    reader.onload = function (e) {
      const sale = {
        productImage: e.target.result,
        amount: saleAmount,
        date: saleDate,
        customerPhone: customerPhone,
      };

      saveSale(sale);
      loadSales();
      saleForm.reset();
    };

    reader.readAsDataURL(productImageInput.files[0]);
  });

  loadSales();
});

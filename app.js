document.addEventListener('DOMContentLoaded', function () {
    const transactionForm = document.getElementById('transactionForm');
    const transactionList = document.getElementById('transactionList');
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    transactionForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const type = document.getElementById('type').value;

        const transaction = {
            description,
            amount: parseFloat(amount),
            type,
            date: new Date().toLocaleString()
        };

        addTransaction(transaction);
        saveTransaction(transaction);

        // Réinitialiser le formulaire après soumission
        transactionForm.reset();
    });

    function addTransaction(transaction) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = `${transaction.date} - ${transaction.type === 'income' ? 'Entrée' : 'Dépense'}: ${transaction.description} - ${transaction.amount} Fcfa`;
        transactionList.appendChild(listItem);
    }

    function saveTransaction(transaction) {
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function loadTransactions() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.forEach(transaction => addTransaction(transaction));
    }

    loadTransactions();

    // Gestion du changement de thème
    themeToggle.addEventListener('click', function () {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeToggle.textContent = 'Mode Sombre';
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeToggle.textContent = 'Mode Clair';
        }
    });
});

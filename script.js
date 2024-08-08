// script.js

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('vehicleSelect').addEventListener('change', handleVehicleChange);
    document.getElementById('saveBillingButton').addEventListener('click', saveBillingData);
    document.getElementById('saveExpensesButton').addEventListener('click', saveExpensesData);
    document.getElementById('monthlyIncome').addEventListener('input', calculateDriverSalary);

    // Initialize the UI
    initialize();
});

function initialize() {
    const vehicleNumber = document.getElementById('vehicleSelect').value;
    if (vehicleNumber) {
        loadVehicleData(vehicleNumber);
        loadExpensesData(vehicleNumber);
        loadCalculations(vehicleNumber);
    }
}

function handleVehicleChange() {
    const vehicleNumber = document.getElementById('vehicleSelect').value;
    if (vehicleNumber) {
        clearForms();
        loadVehicleData(vehicleNumber);
        loadExpensesData(vehicleNumber);
        loadCalculations(vehicleNumber);
    }
}

function clearForms() {
    document.getElementById('billingTableBody').innerHTML = '';
    document.getElementById('expensesTableBody').innerHTML = '';
    document.getElementById('monthlyIncome').value = '';
    document.getElementById('totalAdvanceMoney').textContent = '0.00';
    document.getElementById('totalExpense').textContent = '0.00';
    document.getElementById('remainingAmount').textContent = '0.00';
    document.getElementById('totalOtherExpenses').textContent = '0.00';
    document.getElementById('netRemainingAmount').textContent = '0.00';
    document.getElementById('driverSalary').textContent = '0.00';
}

function addRow() {
    const tableBody = document.getElementById('billingTableBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="date" name="loadingDate" required></td>
        <td><input type="date" name="unloadingDate" required></td>
        <td><input type="text" name="loadingPoint" required></td>
        <td><input type="text" name="unloadingPoint" required></td>
        <td><input type="number" name="advanceMoney" class="amount" required></td>
        <td><input type="number" name="expense" class="amount" required></td>
        <td><button type="button" onclick="removeRow(this)" class="remove">Remove</button></td>
    `;
    tableBody.appendChild(row);
}

function removeRow(button) {
    button.closest('tr').remove();
    calculateAmounts();
}

function addExpenseRow() {
    const tableBody = document.getElementById('expensesTableBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" name="otherExpense" required></td>
        <td><input type="number" name="amount" class="amount" required></td>
        <td><button type="button" onclick="removeExpenseRow(this)" class="remove">Remove</button></td>
    `;
    tableBody.appendChild(row);
}

function removeExpenseRow(button) {
    button.closest('tr').remove();
    calculateAmounts();
}

function calculateAmounts() {
    const advanceMoneyInputs = document.querySelectorAll('#billingTableBody [name="advanceMoney"]');
    const expenseInputs = document.querySelectorAll('#billingTableBody [name="expense"]');
    const otherExpenseInputs = document.querySelectorAll('#expensesTableBody [name="amount"]');

    let totalAdvanceMoney = 0;
    let totalExpense = 0;
    let totalOtherExpenses = 0;

    advanceMoneyInputs.forEach(input => totalAdvanceMoney += parseFloat(input.value) || 0);
    expenseInputs.forEach(input => totalExpense += parseFloat(input.value) || 0);
    otherExpenseInputs.forEach(input => totalOtherExpenses += parseFloat(input.value) || 0);

    const remainingAmount = totalAdvanceMoney - totalExpense;
    const netRemainingAmount = remainingAmount - totalOtherExpenses;

    document.getElementById('totalAdvanceMoney').textContent = totalAdvanceMoney.toFixed(2);
    document.getElementById('totalExpense').textContent = totalExpense.toFixed(2);
    document.getElementById('remainingAmount').textContent = remainingAmount.toFixed(2);
    document.getElementById('totalOtherExpenses').textContent = totalOtherExpenses.toFixed(2);
    document.getElementById('netRemainingAmount').textContent = netRemainingAmount.toFixed(2);
}

function saveBillingData() {
    const vehicleNumber = document.getElementById('vehicleSelect').value;
    if (vehicleNumber) {
        const billingData = [];
        document.querySelectorAll('#billingTableBody tr').forEach(row => {
            const cells = row.querySelectorAll('input');
            billingData.push({
                loadingDate: cells[0].value,
                unloadingDate: cells[1].value,
                loadingPoint: cells[2].value,
                unloadingPoint: cells[3].value,
                advanceMoney: parseFloat(cells[4].value) || 0,
                expense: parseFloat(cells[5].value) || 0
            });
        });

        const calculations = {
            totalAdvanceMoney: parseFloat(document.getElementById('totalAdvanceMoney').textContent) || 0,
            totalExpense: parseFloat(document.getElementById('totalExpense').textContent) || 0,
            remainingAmount: parseFloat(document.getElementById('remainingAmount').textContent) || 0,
            totalOtherExpenses: parseFloat(document.getElementById('totalOtherExpenses').textContent) || 0,
            netRemainingAmount: parseFloat(document.getElementById('netRemainingAmount').textContent) || 0,
            driverSalary: parseFloat(document.getElementById('driverSalary').textContent) || 0
        };

        localStorage.setItem(`vehicle_${vehicleNumber}_billingData`, JSON.stringify(billingData));
        localStorage.setItem(`vehicle_${vehicleNumber}_calculations`, JSON.stringify(calculations));
    }
}

function saveExpensesData() {
    const vehicleNumber = document.getElementById('vehicleSelect').value;
    if (vehicleNumber) {
        const expensesData = [];
        document.querySelectorAll('#expensesTableBody tr').forEach(row => {
            const cells = row.querySelectorAll('input');
            expensesData.push({
                otherExpense: cells[0].value,
                amount: parseFloat(cells[1].value) || 0
            });
        });

        localStorage.setItem(`vehicle_${vehicleNumber}_expensesData`, JSON.stringify(expensesData));
    }
}

function loadVehicleData(vehicleNumber) {
    const savedData = localStorage.getItem(`vehicle_${vehicleNumber}_billingData`);
    if (savedData) {
        const billingData = JSON.parse(savedData);
        const tableBody = document.getElementById('billingTableBody');
        tableBody.innerHTML = '';
        billingData.forEach(data => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="date" value="${data.loadingDate}" name="loadingDate" required></td>
                <td><input type="date" value="${data.unloadingDate}" name="unloadingDate" required></td>
                <td><input type="text" value="${data.loadingPoint}" name="loadingPoint" required></td>
                <td><input type="text" value="${data.unloadingPoint}" name="unloadingPoint" required></td>
                <td><input type="number" value="${data.advanceMoney}" name="advanceMoney" class="amount" required></td>
                <td><input type="number" value="${data.expense}" name="expense" class="amount" required></td>
                <td><button type="button" onclick="removeRow(this)" class="remove">Remove</button></td>
            `;
            tableBody.appendChild(row);
        });
        calculateAmounts();
    }
}

function loadExpensesData(vehicleNumber) {
    const savedData = localStorage.getItem(`vehicle_${vehicleNumber}_expensesData`);
    if (savedData) {
        const expensesData = JSON.parse(savedData);
        const tableBody = document.getElementById('expensesTableBody');
        tableBody.innerHTML = '';
        expensesData.forEach(data => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" value="${data.otherExpense}" name="otherExpense" required></td>
                <td><input type="number" value="${data.amount}" name="amount" class="amount" required></td>
                <td><button type="button" onclick="removeExpenseRow(this)" class="remove">Remove</button></td>
            `;
            tableBody.appendChild(row);
        });
        calculateAmounts();
    }
}

function loadCalculations(vehicleNumber) {
    const savedData = localStorage.getItem(`vehicle_${vehicleNumber}_calculations`);
    if (savedData) {
        const calculations = JSON.parse(savedData);
        document.getElementById('totalAdvanceMoney').textContent = calculations.totalAdvanceMoney.toFixed(2);
        document.getElementById('totalExpense').textContent = calculations.totalExpense.toFixed(2);
        document.getElementById('remainingAmount').textContent = calculations.remainingAmount.toFixed(2);
        document.getElementById('totalOtherExpenses').textContent = calculations.totalOtherExpenses.toFixed(2);
        document.getElementById('netRemainingAmount').textContent = calculations.netRemainingAmount.toFixed(2);
        // document.getElementById('driverSalary').textContent = calculations.driverSalary.toFixed(2);
    }
}
function calculateDriverSalary() {
    // Get the monthly income from the input field
    const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value) || 0;
    // Get the net remaining amount from the span
    const netRemainingAmount = parseFloat(document.getElementById('netRemainingAmount').textContent) || 0;
    // Calculate the driver's salary
    const driverSalary = monthlyIncome - netRemainingAmount;
    // Update the driver's salary span with the calculated value
    // Show the driver's salary container
    document.getElementById('driverSalary').textContent = driverSalary.toFixed(2);

}
function captureScreenshot() {
    html2canvas(document.body).then(function(canvas) {
        var link = document.createElement('a');
        link.download = 'page_screenshot.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

document.getElementById('clearButton').addEventListener('click', () => {
    const vehicleNumber = document.getElementById('vehicleSelect').value;
    if (vehicleNumber) {
        // Clear the vehicle selection
        document.getElementById('vehicleSelect').value = '';

        // Clear billing table and expenses table
        document.getElementById('billingTableBody').innerHTML = '';
        document.getElementById('expensesTableBody').innerHTML = '';

        // Reset calculation displays
        document.getElementById('totalAdvanceMoney').textContent = '0.00';
        document.getElementById('totalExpense').textContent = '0.00';
        document.getElementById('remainingAmount').textContent = '0.00';
        document.getElementById('totalOtherExpenses').textContent = '0.00';
        document.getElementById('netRemainingAmount').textContent = '0.00';
        document.getElementById('driverSalary').textContent = '0.00';
        document.getElementById('monthlyIncome').value = '';

        // Remove only the selected vehicle's data from localStorage
        localStorage.removeItem(`vehicle_${vehicleNumber}_billingData`);
        localStorage.removeItem(`vehicle_${vehicleNumber}_calculations`);
        localStorage.removeItem(`vehicle_${vehicleNumber}_expensesData`);
    }
});

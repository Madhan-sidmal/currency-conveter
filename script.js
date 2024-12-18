const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const convertBtn = document.getElementById('convert-btn');
const resultDiv = document.getElementById('result');
const barChartCanvas = document.getElementById('barChart');
const lineChartCanvas = document.getElementById('lineChart');

let barChart, lineChart;

// Fetch and populate currencies
async function populateCurrencies() {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await response.json();
    const currencies = Object.keys(data.rates);

    currencies.forEach(currency => {
        const optionFrom = document.createElement('option');
        optionFrom.value = currency;
        optionFrom.textContent = currency;
        fromCurrency.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = currency;
        optionTo.textContent = currency;
        toCurrency.appendChild(optionTo);
    });

    fromCurrency.value = 'USD';
    toCurrency.value = 'INR';
    initializeCharts(data.rates);
}

// Convert currency
convertBtn.addEventListener('click', async () => {
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        resultDiv.textContent = 'Please enter a valid amount.';
        return;
    }

    const from = fromCurrency.value;
    const to = toCurrency.value;

    const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await response.json();

    const convertedAmount = (amount * data.rates[to]).toFixed(2);
    resultDiv.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;

    updateLineChart(data.rates[to]);
});

// Initialize Bar Chart
function initializeCharts(rates) {
    const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD'];
    const values = currencies.map(currency => rates[currency]);

    barChart = new Chart(barChartCanvas, {
        type: 'bar',
        data: {
            labels: currencies,
            datasets: [{
                label: 'Exchange Rates (Base: USD)',
                data: values,
                backgroundColor: ['#4facfe', '#00f2fe', '#36a2eb', '#ffcd56', '#ff6384'],
            }]
        }
    });
}

// Update Line Chart for Growth
function updateLineChart(targetRate) {
    const growthData = [1, targetRate * 1.01, targetRate * 1.02, targetRate * 1.03, targetRate * 1.04];
    if (lineChart) lineChart.destroy();

    lineChart = new Chart(lineChartCanvas, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
            datasets: [{
                label: 'Simulated Growth Over 5 Days',
                data: growthData,
                borderColor: '#4facfe',
                backgroundColor: 'rgba(79, 172, 254, 0.2)',
                fill: true,
            }]
        }
    });
}

populateCurrencies();

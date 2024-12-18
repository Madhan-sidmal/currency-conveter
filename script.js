const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const convertBtn = document.getElementById('convert-btn');
const resultDiv = document.getElementById('result');

// Fetch currencies and populate dropdowns
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
}

// Handle conversion
convertBtn.addEventListener('click', async () => {
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        resultDiv.textContent = 'Please enter a valid amount.';
        resultDiv.style.color = 'red';
        return;
    }

    const from = fromCurrency.value;
    const to = toCurrency.value;

    const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await response.json();

    if (data.rates[to]) {
        const convertedAmount = (amount * data.rates[to]).toFixed(2);
        resultDiv.style.color = '#333';
        resultDiv.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
    } else {
        resultDiv.textContent = 'Conversion rate not available.';
        resultDiv.style.color = 'red';
    }
});

// Initialize the app
populateCurrencies();

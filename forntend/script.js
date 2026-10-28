
const API_URL = "http://127.0.0.1:8000";
const USER_ID = 1;

const form = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalElement = document.getElementById("total");
const message = document.getElementById("message");

async function loadExpenses() {
    try {
        const response = await fetch(
            `${API_URL}/expense/${USER_ID}`
        );

        if (!response.ok) {
            throw new Error("Could not load expenses");
        }

        const data = await response.json();

        expenseList.replaceChildren();

        data.expenses.forEach((expense) => {
            const li = document.createElement("li");
            const details = document.createElement("span");
            const price = document.createElement("strong");

            details.textContent =
                `${expense.category} — ${expense.item_name}`;
            price.textContent = `₹${expense.item_price}`;

            li.append(details, price);
            expenseList.appendChild(li);
        });

        await loadTotal();
    } catch (error) {
        message.textContent = error.message;
    }
}

async function loadTotal() {
    const response = await fetch(
        `${API_URL}/expense/expense_total/${USER_ID}`
    );

    if (!response.ok) {
        throw new Error("Could not load total expenses");
    }

    const data = await response.json();
    totalElement.textContent =
        `₹${Number(data.total_expenses).toFixed(2)}`;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const expense = {
        user_id: USER_ID,
        category: document.getElementById("category").value.trim(),
        item_name: document.getElementById("item-name").value.trim(),
        item_price: Number(
            document.getElementById("item-price").value
        )
    };

    if (
        !expense.category ||
        !expense.item_name ||
        !Number.isFinite(expense.item_price) ||
        expense.item_price <= 0
    ) {
        message.textContent = "Please enter valid expense details.";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/expenses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expense)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Could not save expense");
        }

        message.textContent = "Expense added successfully.";
        form.reset();
        await loadExpenses();
    } catch (error) {
        message.textContent =
            `${error.message}. Check whether the API server is running.`;
    }
});

document.getElementById("refresh-btn")
    .addEventListener("click", loadExpenses);

loadExpenses();

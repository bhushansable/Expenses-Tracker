const API_URL = "http://127.0.0.1:8000";

const userID = sessionStorage.getItem("user_id");

const expenseForm = document.getElementById("Expens_form");
const expenseList = document.getElementById("expens_list");
const expenseTotal = document.getElementById("total-Expenses");

function showMessage(text, color = "red") {
    const message = document.getElementById("expense-message");

    if (message) {
        message.textContent = text;
        message.style.color = color;
    }
}

function formatMoney(amount) {
    return Number(amount ?? 0).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR"
    });
}

async function readResponse(response) {
    const data = await response.json();

    if (!response.ok) {
        const detail = data.detail;

        throw new Error(
            typeof detail === "string"
                ? detail
                : JSON.stringify(detail || "Request failed")
        );
    }

    return data;
}

async function loadExpenses() {
    try {
        const response = await fetch(
            `${API_URL}/expense/${encodeURIComponent(userID)}`
        );

        // api.py returns { user_id: ..., expenses: [...] }
        const data = await readResponse(response);
        const expenses = data.expenses;

        if (!Array.isArray(expenses)) {
            throw new Error("Unexpected expenses response from API.");
        }

        expenseList.replaceChildren();

        if (expenses.length === 0) {
            const item = document.createElement("li");
            item.textContent = "No expenses yet.";
            expenseList.appendChild(item);
        } else {
            expenses.forEach(function (expense) {
                const category = expense.category;
                const itemName = expense.item_name;
                const price = expense.item_price;

                const li = document.createElement("li");

                const details = document.createElement("span");
                details.textContent = `${category} - ${itemName}`;

                const amount = document.createElement("strong");
                amount.textContent = formatMoney(price);

                li.append(details, amount);
                expenseList.appendChild(li);
            });
        }

        await loadTotal();

    } catch (error) {
        showMessage(error.message);
    }
}

async function loadTotal() {
    const response = await fetch(
        `${API_URL}/expense/expense_total/${encodeURIComponent(userID)}`
    );

    const data = await readResponse(response);

    // Matches the key returned by your current api.py.
    expenseTotal.textContent = formatMoney(data["total expense"] ?? 0);
}

expenseForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const category = document.getElementById("category").value.trim();
    const itemName = document.getElementById("iteam_name").value.trim();
    const itemPrice = Number(
        document.getElementById("iteam_price").value
    );

    if (
        !category ||
        !itemName ||
        !Number.isFinite(itemPrice) ||
        itemPrice <= 0
    ) {
        showMessage("Enter valid expense details.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/expenses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: Number(userID),
                category: category,
                item_name: itemName,
                item_price: itemPrice
            })
        });

        await readResponse(response);

        expenseForm.reset();
        showMessage("Expense added successfully.", "green");

        await loadExpenses();

    } catch (error) {
        showMessage(error.message);
    }
});

// Validate the saved ID before requesting expenses.
if (!userID || !Number.isInteger(Number(userID))) {
    sessionStorage.removeItem("user_id");
    window.location.replace("/forntend/login.html");
} else {
    loadExpenses();
}
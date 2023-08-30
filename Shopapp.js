const budgetInput = document.getElementById("budget");
const setBudgetButton = document.getElementById("setBudget");
const updateBudgetInput = document.getElementById("updateBudget");
const updateBudgetButton = document.getElementById("updateBudgetButton");
const currentBudgetAmount = document.getElementById("currentBudgetAmount");
const budgetStatusLabel = document.getElementById("budgetStatusLabel");

const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const productQuantityInput = document.getElementById("productQuantity");
const addProductButton = document.getElementById("addProduct");
const productList = document.getElementById("productList");

let remainingBudget = 0;
const products = [];

setBudgetButton.addEventListener("click", () => {
    remainingBudget = parseFloat(budgetInput.value);
    budgetInput.disabled = true;
    setBudgetButton.disabled = true;
    budgetStatusLabel.textContent = `Budžet od ${remainingBudget.toFixed(2)} € je uspješno postavljen!`;
    budgetStatusLabel.style.color = "green";
    budgetStatusLabel.style.fontWeight = "bold";
    currentBudgetAmount.textContent = remainingBudget.toFixed(2);
});

updateBudgetButton.addEventListener("click", () => {
    const newBudget = parseFloat(updateBudgetInput.value);
    if (!isNaN(newBudget)) {
        remainingBudget = newBudget;
        currentBudgetAmount.textContent = newBudget.toFixed(2);
        updateBudgetInput.value = "";
        budgetStatusLabel.textContent = "Budžet je uspješno ažuriran!";
        budgetStatusLabel.style.color = "green";
        budgetStatusLabel.style.fontWeight = "bold";
        updateUI();
    } else {
        alert("Molimo unesite valjan iznos za budžet.");
    }
});

addProductButton.addEventListener("click", () => {
    const name = productNameInput.value;
    const price = parseFloat(productPriceInput.value);
    const quantity = parseInt(productQuantityInput.value);

    if (name && !isNaN(price) && !isNaN(quantity) && price > 0 && quantity > 0) {
        addProduct(name, price, quantity);
        productNameInput.value = "";
        productPriceInput.value = "";
        productQuantityInput.value = "";
    } else {
        alert("Molimo unesite valjane informacije za proizvod.");
    }
});

function addProduct(name, price, quantity) {
    if (remainingBudget >= price * quantity) {
        products.push({ name, price, quantity });
        remainingBudget -= price * quantity;
        updateUI();
    } else {
        alert("Nemate dovoljno novca za ovaj proizvod.");
    }
}


const updateProductButton = document.getElementById("updateProduct");

updateProductButton.addEventListener("click", () => {
    const index = updateProductButton.getAttribute("data-index");
    const newName = productNameInput.value;
    const newPrice = parseFloat(productPriceInput.value);
    const newQuantity = parseInt(productQuantityInput.value);

    if (newName && !isNaN(newPrice) && !isNaN(newQuantity) && newPrice > 0 && newQuantity > 0) {
        const product = products[index];
        const previousPrice = product.price;
        const previousQuantity = product.quantity;

        const priceDifference = (previousPrice * previousQuantity) - (newPrice * newQuantity);

        if (remainingBudget + priceDifference >= 0) {
            products[index] = { name: newName, price: newPrice, quantity: newQuantity };
            updateBudgetOnProductUpdate(previousPrice, previousQuantity, newPrice, newQuantity);
            updateUI();

            productNameInput.value = "";
            productPriceInput.value = "";
            productQuantityInput.value = "";
            addProductButton.style.display = "inline";
            updateProductButton.style.display = "none";
            updateProductButton.removeAttribute("data-index");
        } else {
            alert("Nemate dovoljno novca za ovu promjenu.");
        }
    } else {
        alert("Molimo unesite valjane informacije za proizvod.");
    }
});


function updateBudgetOnProductUpdate(previousPrice, previousQuantity, newPrice, newQuantity) {
    const priceDifference = (previousPrice * previousQuantity) - (newPrice * newQuantity);
    remainingBudget += priceDifference;
    currentBudgetAmount.textContent = remainingBudget.toFixed(2);
}


function updateUI() {
    productList.innerHTML = "";
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${product.name} - ${product.quantity} kom x ${product.price} € = ${product.quantity * product.price} €</span>
            <button class="editProduct" data-index="${i}">Uredi</button>
            <button class="deleteProduct" data-index="${i}">Obriši</button>
        `;
        productList.appendChild(li);
    }

    const editButtons = document.querySelectorAll(".editProduct");
    const deleteButtons = document.querySelectorAll(".deleteProduct");

    editButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const index = event.target.getAttribute("data-index");
            const productToEdit = products[index];

            productNameInput.value = productToEdit.name;
            productPriceInput.value = productToEdit.price;
            productQuantityInput.value = productToEdit.quantity;

            addProductButton.style.display = "none";
            updateProductButton.style.display = "inline";
            updateProductButton.setAttribute("data-index", index);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const index = event.target.getAttribute("data-index");
            deleteProduct(index);
        });
    });

    currentBudgetAmount.textContent = remainingBudget.toFixed(2);
}

function deleteProduct(index) {
    if (index >= 0 && index < products.length) {
        const deletedProduct = products.splice(index, 1)[0];
        remainingBudget += deletedProduct.price * deletedProduct.quantity;
        updateUI();
    }
}

updateUI();

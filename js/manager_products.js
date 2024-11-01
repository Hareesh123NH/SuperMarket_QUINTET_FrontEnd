let products = [
    { id: 1, name: "Product 1", category: "Category A", price: 10.99, stock: 100 },
    { id: 2, name: "Product 2", category: "Category B", price: 20.99, stock: 50 },
    { id: 3, name: "Product 3", category: "Category C", price: 15.99, stock: 75 }
];

function populateProducts() {
    const tableBody = document.getElementById('productsTable').querySelector('tbody');
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Populate the table on page load
window.onload = populateProducts;

let clerks = [
    { name: "Alice Brown", email: "alice@example.com" },
    { name: "Bob White", email: "bob@example.com" },
    { name: "Charlie Black", email: "charlie@example.com" }
];

function populateClerks() {
    const tableBody = document.getElementById('clerksTable').querySelector('tbody');
    tableBody.innerHTML = ''; // Clear existing entries
    clerks.forEach((clerk, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${clerk.name}</td>
            <td>${clerk.email}</td>
            <td><button class="remove-btn" onclick="removeClerk(${index})">Remove</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function addClerk(event) {
    event.preventDefault();
    const name = document.getElementById('clerkName').value;
    const email = document.getElementById('clerkEmail').value;
    clerks.push({ name, email });
    populateClerks();
    document.getElementById('addClerkForm').reset();
}

function removeClerk(index) {
    clerks.splice(index, 1); // Remove clerk from the array
    populateClerks(); // Refresh the table
}

function toggleAddClerk() {
    const addClerkDiv = document.querySelector('.add-clerk');
    addClerkDiv.style.display = addClerkDiv.style.display === 'none' ? 'block' : 'none';
}

// Populate the table on page load
window.onload = populateClerks;

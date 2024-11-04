
const links = document.querySelectorAll(".nav-link");
var divtable = document.querySelector(".tablediv");
const message = document.getElementById("logout-message");

const iframe = document.getElementById("otherPage");
const userProfileDetails = document.getElementById("profile-detail");

function auth() {
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        window.location.href = "http://127.0.0.1:5500/index.html";
        return;
    }

    fetch(`http://localhost:8080/clerk/name`, {
        method: 'GET',
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        },
    })
        .then(response => {
            if (response.status == 403) {
                window.location.href = "http://127.0.0.1:5500/index.html";
                return;
            }
            if (!response.ok) throw new Error("Failed to Authentication");
            return response.text();
        })
        .then(data => console.log(data))
        .catch(error => console.error("Error to Authentication", error));


}
auth();

function logout(logoutButton) {
    let countdown = 5; // Start countdown at 5 seconds
    // const logoutButton = document.getElementById("logoutButton");
    logoutButton.disabled = true; // Disable the logout button

    // Update button text with countdown
    const intervalId = setInterval(() => {
        logoutButton.textContent = `Logging out in ${countdown} seconds...`;
        countdown--;

        if (countdown < 0) {
            clearInterval(intervalId); // Stop the interval

            // Clear session storage and redirect to index.html
            sessionStorage.removeItem("auth");
            sessionStorage.removeItem("userId");
            window.location.href = 'http://127.0.0.1:5500/index.html';
        }
    }, 1000); // Update every second
}

iframe.onload = () => {

    const allorders = iframe.contentDocument.getElementById("all-orders");
    const pending = iframe.contentDocument.getElementById("pending-orders");
    const approved = iframe.contentDocument.getElementById("approved-orders");
    const cancel = iframe.contentDocument.getElementById("cancel-orders");

    links.forEach((link) => {

        link.addEventListener("click", (e) => {

            divtable.innerHTML = '';
            const btn = e.target.innerText;
            const temp = document.createElement("div");

            // console.log(btn);

            if (btn === "Pending Orders") {
                divtable.innerHTML = pending.innerHTML;
                const tbody = document.getElementById("table");
                fetchByStatus(tbody, "Pending");

            }
            else if (btn === "Approved Orders") {
                divtable.innerHTML = approved.innerHTML;
                const tbody = document.getElementById("table");
                fetchByStatus(tbody, "Approved");
            }
            else if (btn === "Canceled Orders") {
                divtable.innerHTML = cancel.innerHTML;
                const tbody = document.getElementById("table");
                fetchByStatus(tbody, "Cancelled");
            }

            else if (btn === "All Orders") {
                divtable.innerHTML = allorders.innerHTML;
                const tbody = document.getElementById("table");
                fetchOrders(tbody);
            }
            else if (btn === "Profile") {
                // fetchProfile();
                const details = sessionStorage.getItem("details");
                // console.log(details);
                setUserValues(details);
                divtable.innerHTML = userProfileDetails.innerHTML;
            }

            else if (btn === "Logout") {
                divtable.innerHTML = message.innerHTML;
                logout(e.target);
            }

        });
    });

    divtable.innerHTML = allorders.innerHTML;
    const temp = document.createElement("div");
    temp.innerHTML = allorders.innerHTML;
    const tbody = document.getElementById("table");
    // console.log(tbody);
    fetchOrders(tbody);

}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("approve-order")) {
        const orderId = e.target.getAttribute("data-product-id");
        // console.log(orderId);
        if (orderId) {
            approvedOrder(orderId);
        } else {
            console.error("Order ID is missing.");
        }
    }
    if (e.target.classList.contains("cancel-order")) {
        const orderId = e.target.getAttribute("data-product-id");
        const userId = sessionStorage.getItem("userId"); // Ensure the user ID is stored in sessionStorage

        if (orderId) {
            cancelOrder(orderId);
        } else {
            console.error("Order ID is missing.");
        }
    }

    if (e.target.classList.contains("generate-bill")) {
        bill = iframe.contentDocument.getElementById("generateBill");
        const userId = e.target.getAttribute('data-user-id');
        const userName = e.target.getAttribute('data-user-name');
        const ordersData = e.target.getAttribute("data-user-orders");
        const orders = JSON.parse(ordersData);
        // console.log(orders);

        divtable.innerHTML = bill.innerHTML;
        generateBill(userName, orders);

        console.log(userId, userName);

    }

    if (e.target.classList.contains("cancel-bill")) {
        const approved = iframe.contentDocument.getElementById("approved-orders");
        divtable.innerHTML = approved.innerHTML;
        const tbody = document.getElementById("table");
        fetchByStatus(tbody, "Approved");
    }

    if (e.target.classList.contains("delete-bill")) {
        const ordersData = e.target.getAttribute("data-user-orders");
        const orders = JSON.parse(ordersData);
        orders.forEach((order) => {
            deleteOrder(order.id);
        });
        alert("Deleted Order SuccessFully");
        const cancel = iframe.contentDocument.getElementById("cancel-orders");
        divtable.innerHTML = cancel.innerHTML;
        const tbody = document.getElementById("table");
        fetchByStatus(tbody, "Cancelled");

    }

});

function approvedOrder(orderId) {
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/clerk/approve/${orderId}`, {
        method: 'PUT',
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        },
    })
        .then(response => {
            if (response.status == 400) {
                alert("Already you responded");
                throw new Error("Alreay Responded");
            }
            if (!response.ok) throw new Error("Failed to approve order");
        })
        .then(data => {
            console.log("Order Approved:", data);
            // Optionally, update the cart UI here if needed
            const divtable = document.querySelector(".tablediv");

            const iframe = document.getElementById("otherPage");
            const orders = iframe.contentDocument.getElementById("approved-orders");
            divtable.innerHTML = orders.innerHTML;

            const tbody = document.getElementById("table");
            fetchByStatus(tbody, "Approved");
        })
        .catch(error => console.error("Error Approved to order", error));
}

function cancelOrder(orderId) {
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/clerk/cancel/${orderId}`, {
        method: 'PUT',
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        },
    })
        .then(response => {
            if (response.status == 400) {
                alert("Already you responded");
                throw new Error("Alreay Responded");
            }
            if (!response.ok) throw new Error("Failed to Cancel order");
        })
        .then(data => {
            console.log("Order Cancel:", data);
            // Optionally, update the cart UI here if needed
            const divtable = document.querySelector(".tablediv");

            const iframe = document.getElementById("otherPage");
            const orders = iframe.contentDocument.getElementById("cancel-orders");
            divtable.innerHTML = orders.innerHTML;

            const tbody = document.getElementById("table");
            fetchByStatus(tbody, "Cancelled");
        })
        .catch(error => console.error("Error Approved to order", error));
}

function fetchOrders(tbody) {
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/clerk/orders`, {
        method: 'GET',
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        },
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch orders");
            return response.json();
        })
        .then(data => displayOrders(data, tbody))
        .catch(error => console.error("Error fetching orders:", error));
}

function displayOrders(orders, tbody) {
    const err = document.getElementById("not");
    if (orders.length === 0) {
        err.style.display = "block";
    }
    else {
        err.style.display = "none";
    }

    // console.log(orders);
    tbody.innerHTML = '';

    const tab = divtable.firstElementChild.textContent;

    sorting(orders);

    orders.forEach((order) => {

        // console.log(order);
        const item = order.product;
        const isPending = order.orderStatus.toLowerCase() === "pending";

        const actionCell = isPending
            ? `<td>
                <button class="approve-order" data-product-id="${order.id}">Approve</button>
                <button class="cancel-order" data-product-id="${order.id}">Cancel</button>
           </td>`
            : `<td><i>Already Reacted</i></td>`;

        const row = `
            <tr>
                <td scope="row">${item.name}</td>
                <td>${item.category}</td>
                <td>${order.quantity}</td>
                <td>${order.price}</td>
                <td>${order.orderStatus}</td>
               ${tab === "Approved Orders" || tab === "Cancel Orders" ? "" : actionCell}
            </tr>
        `;
        tbody.innerHTML += row;
    });


}



function displayApproved(orders, tbody) {
    const err = document.getElementById("not");
    if (orders.length === 0) {
        err.style.display = "block";
    }
    else {
        err.style.display = "none";
    }

    tbody.innerHTML = '';

    // Group orders by user ID
    const ordersByUser = orders.reduce((acc, order) => {
        const userId = order.user.id;
        if (!acc[userId]) {
            acc[userId] = { user: order.user, orders: [] };
        }
        acc[userId].orders.push(order);
        return acc;
    }, {});

    const tab = divtable.firstElementChild.textContent;

    sorting(orders);


    // Iterate over each group of orders by user
    Object.values(ordersByUser).forEach(({ user, orders }) => {
        // Insert a header row for the user

        tbody.innerHTML += `
        <tr>
            <th colspan="4">User: - ${user.userProfile.fullName}</th>
             ${tab === "Approved Orders" ? `<th><button class="generate-bill" data-user-id="${user.id}"
                                                data-user-name="${user.userProfile.fullName}"
                                                data-user-orders='${JSON.stringify(orders)}' >Generate Bill</button></th>` :

                `<th><button class="delete-bill"
                                                data-user-orders='${JSON.stringify(orders)}' >Delete</button></th>`}
            
        </tr>
    `;

        // Iterate over the user's orders
        orders.forEach((order) => {
            const item = order.product;

            const row = `
            <tr>
                <td scope="row">${item.name}</td>
                <td>${item.category}</td>
                <td>${order.quantity}</td>
                <td>${order.price}</td>
                <td>${order.orderStatus}</td>
            </tr>
        `;
            tbody.innerHTML += row;
        });
    });

}


function generateBill(customerName, products) {

    const transactionId = "TXN" + Math.floor(Math.random() * 100000000);


    document.getElementById("billCustomerName").innerText = customerName;
    document.getElementById("transactionId").innerText = transactionId;

    const billItemsContainer = document.getElementById("billItems");
    billItemsContainer.innerHTML = ""; // Clear any existing rows


    let totalPrice = 0;

    products.forEach((order, index) => {

        const product = order.product;

        const productPrice = order.price;
        totalPrice += productPrice;

        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${order.quantity}</td>
                <td>${order.unitPrice}</td>
                <td>${productPrice.toFixed(2)}</td>
            `;
        billItemsContainer.appendChild(row);
    });

    const gstAmount = (totalPrice * 0.18).toFixed(2);
    const payableAmount = (totalPrice + parseFloat(gstAmount)).toFixed(2);

    document.getElementById("totalPrice").innerText = totalPrice.toFixed(2);
    document.getElementById("gstAmount").innerText = gstAmount;
    document.getElementById("payableAmount").innerText = payableAmount;
    document.getElementById("bill-orders").setAttribute("orders", JSON.stringify(products));
    document.getElementById("billContainer").style.display = "block";
}

// Mock fetchProducts function (replace this with actual API call if available)
async function fetchProducts(userId) {
    // Simulate fetching products for a user
    return [
        { id: 1, name: "Apple", quantity: 10, unitPrice: 3 },
        { id: 2, name: "Banana", quantity: 5, unitPrice: 2 },
        // Additional products can be added here
    ];
}

function sorting(orders) {

    orders.sort((a, b) => {
        if (a.orderStatus === "Pending" && b.orderStatus !== "Pending") {
            return -1; // a comes before b
        }
        if (a.orderStatus !== "Pending" && b.orderStatus === "Pending") {
            return 1; // b comes before a
        }
        return b.id - a.id;
    });
}

function fetchByStatus(tbody, status) {
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/clerk/orders/${status}`, {
        method: 'GET',
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        },
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch orders");
            return response.json();
        })
        .then((data) => {
            if (status === "Approved" || status === "Cancelled") {
                displayApproved(data, tbody);
            }

            else { displayOrders(data, tbody); }
        })
        .catch(error => console.error("Error fetching orders:", error));
}

function setUserValues(userString) {
    // Regular expressions to extract values
    const userIdMatch = userString.match(/id=(\d+)/);
    const usernameMatch = userString.match(/username='([^']+)'/);
    const fullNameMatch = userString.match(/fullName='([^']+)'/);
    const phoneNumberMatch = userString.match(/phoneNumber='([^']+)'/);
    const addressMatch = userString.match(/Address='([^']+)'/);
    const emailMatch = userString.match(/email='([^']+)'/);

    // Extract values using the matches
    const userId = userIdMatch ? userIdMatch[1] : null;
    const username = usernameMatch ? usernameMatch[1] : null;
    const fullName = fullNameMatch ? fullNameMatch[1] : null;
    const phoneNumber = phoneNumberMatch ? phoneNumberMatch[1] : null;
    const address = addressMatch ? addressMatch[1] : null;
    const email = emailMatch ? emailMatch[1] : null;

    // Set the values in the HTML elements
    document.getElementById("fullName").textContent = fullName;
    document.getElementById("phoneNumber").textContent = phoneNumber;
    document.getElementById("address").textContent = address;
    document.getElementById("email").textContent = email;
    document.getElementById("username").textContent = username;
}

function printBill() {
    const billContent = document.getElementById("billContainer").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = billContent;
    window.print();
    document.body.innerHTML = originalContent;
}

// Function to post the bill data
function postBill(event) {

    event.preventDefault();

    const customerName = document.getElementById("billCustomerName").innerText;
    const transactionId = document.getElementById("transactionId").innerText;
    const totalPrice = document.getElementById("totalPrice").innerText;
    const gstAmount = document.getElementById("gstAmount").innerText;
    const payableAmount = document.getElementById("payableAmount").innerText;

    const billProducts = Array.from(document.getElementById("billItems").children).map(row => ({
        pName: row.cells[1].innerText,
        category: row.cells[2].innerText,
        quantity: row.cells[3].innerText,
        unitPrice: row.cells[4].innerText,
        productPrice: row.cells[5].innerText,
    }));

    const billData = {
        customerName,
        transactionId,
        billProducts,
        totalPrice,
        gstAmount,
        payableAmount
    };

    // console.log(orders);
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/clerk/addBill`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"

        },
        body: JSON.stringify(billData)
    })
        .then(response => {
            if (response.ok) {
                return response.text(); // or response.text() if expecting text
            } else {
                throw new Error("Failed to Addbill");
            }
        })
        .then(data => {
            console.log(data);
            const ordersData = document.getElementById("bill-orders").getAttribute("orders");
            const orders = JSON.parse(ordersData);
            console.log(orders);
            orders.forEach((order) => {
                changeSatus(order.id);
            });
            alert("Bill added successful!");
            const approved = iframe.contentDocument.getElementById("approved-orders");
            divtable.innerHTML = approved.innerHTML;
            const tbody = document.getElementById("table");
            fetchByStatus(tbody, "Approved");

        })
        .catch(error => {
            console.error("Error:", error);
            alert("There was an error addingBill");
        });

}

function changeSatus(orderId) {
    const auth = sessionStorage.getItem("auth");
    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/clerk/generateBill/${orderId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        },
    })
        .then(response => {
            if (response.ok) {
                return response.text(); // or response.text() if expecting text
            } else {
                throw new Error("Failed to generated");
            }
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

function deleteOrder(orderId) {
    const auth = sessionStorage.getItem("auth");
    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/clerk/delete/${orderId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        },
    })
        .then(response => {
            if (response.ok) {
                return response.text(); // or response.text() if expecting text
            } else {
                throw new Error("Failed to Deleting");
            }
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}




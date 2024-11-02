 
const links = document.querySelectorAll(".nav-link");
var divtable = document.querySelector(".tablediv");

 
const iframe = document.getElementById("otherPage");

iframe.onload = () => {

    const allorders=iframe.contentDocument.getElementById("all-orders");
    const pending = iframe.contentDocument.getElementById("pending-orders");
    const approved = iframe.contentDocument.getElementById("approved-orders");
    const cancel = iframe.contentDocument.getElementById("cancel-orders");  

    links.forEach((link) => {

        link.addEventListener("click", (e) => {

            divtable.innerHTML = '';
            const btn = e.target.innerText;
            const temp = document.createElement("div");

            console.log(btn);

            if (btn === "Pending Orders") {
                divtable.innerHTML = pending.innerHTML;
                const tbody = document.getElementById("table");
                fetchByStatus(tbody,"Pending");

            }
            else if (btn === "Approved Orders") {
                divtable.innerHTML = approved.innerHTML;
                const tbody = document.getElementById("table");
                fetchByStatus(tbody,"Approved");
            }
            else if (btn === "Canceled Orders") {
                divtable.innerHTML = cancel.innerHTML;
                const tbody = document.getElementById("table");
                fetchByStatus(tbody,"Cancelled");
            }

            else if(btn==="All Orders"){
                divtable.innerHTML=allorders.innerHTML;
                const tbody = document.getElementById("table");
                fetchOrders(tbody);
            }
        });
    });

    divtable.innerHTML = allorders.innerHTML;
    const temp = document.createElement("div");
    temp.innerHTML = allorders.innerHTML;
    const tbody = document.getElementById("table");
    console.log(tbody);
    fetchOrders(tbody);

}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("approve-order")) {
        const orderId = e.target.getAttribute("data-product-id");
        console.log(orderId);
        if (orderId) {
            approvedOrder(orderId);
        } else {
            console.error("Order ID is missing.");
        }
    }
    if (e.target.classList.contains("cancel-order")) {
        const orderId= e.target.getAttribute("data-product-id");
        const userId = sessionStorage.getItem("userId"); // Ensure the user ID is stored in sessionStorage

        if (orderId) {
            cancelOrder(orderId);
        } else {
            console.error("Order ID is missing.");
        }
    }

});

function approvedOrder(orderId){
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
            fetchByStatus(tbody,"Approved");
        })
        .catch(error => console.error("Error Approved to order", error));
}

function cancelOrder(orderId){
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
            fetchByStatus(tbody,"Cancelled");
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
    const err=document.getElementById("not");
    if(orders.length===0){
         err.style.display="block";
        return;
    }
    else{
        err.style.display="none";
    }
    tbody.innerHTML = '';
    sorting(orders);

    orders.forEach((order) => {
        const item = order.product;
        const isPending = order.orderStatus.toLowerCase() === "pending";
        const row = `
            <tr>
                <td scope="row">${item.name}</td>
                <td>${item.category}</td>
                <td>${parseInt(order.price / item.price, 10)}</td>
                <td>${order.price}</td>
                <td>${order.orderStatus}</td>
                <td><button class="btn approve-order" ${isPending ? "" : "disabled"} data-product-id="${order.id}">Approve</button>
                    <button class="btn cancel-order"  ${isPending ? "" : "disabled"} data-product-id="${order.id}">Cancel</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    })
    // console.log(orders);
}

function sorting(orders){

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

function fetchByStatus(tbody,status){
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
        .then(data => displayOrders(data, tbody))
        .catch(error => console.error("Error fetching orders:", error));
}

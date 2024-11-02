const links = document.querySelectorAll(".nav-link");
var divtable = document.querySelector(".tablediv");

 
const iframe = document.getElementById("otherPage");

iframe.onload = () => {

    const allorders=iframe.contentDocument.getElementById("allOrders");
    const clerks = iframe.contentDocument.getElementById("clerks");
    const emps = iframe.contentDocument.getElementById("emps");
    const register = iframe.contentDocument.getElementById("register");  

    links.forEach((link) => {

        link.addEventListener("click", (e) => {

            divtable.innerHTML = '';
            const btn = e.target.innerText;
            const temp = document.createElement("div");

            console.log(btn);

            if (btn === "All Orders") {
                divtable.innerHTML = allorders.innerHTML;
                const tbody = document.getElementById("table");
                fetchAllOrders(tbody);

            }
            else if (btn === "Clerks") {
                divtable.innerHTML = clerks.innerHTML;
                const tbody = document.getElementById("table");
                fetchAllClerks(tbody);
            }
            else if (btn === "Employees") {
                divtable.innerHTML = emps.innerHTML;
                const tbody = document.getElementById("table");
                fetchAllEmps(tbody);
            }

            else if(btn==="Register"){
                divtable.innerHTML=register.innerHTML;
                const tbody = document.getElementById("table");
                // fetchOrders(tbody);
            }
        });
    });

    divtable.innerHTML = allorders.innerHTML;
    const temp = document.createElement("div");
    temp.innerHTML = allorders.innerHTML;
    const tbody = document.getElementById("table");
    // console.log(tbody);
    fetchAllOrders(tbody);

}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("update")) {
        const userData = e.target.getAttribute("data-worker");
        const form=document.querySelector(".hiddenForm");
        const user=JSON.parse(userData);

        console.log(form);
        form.style.display="block";
        document.getElementById("fullName").value = user.fullName;
        document.getElementById("phoneNumber").value = user.phoneNumber;
        document.getElementById("email").value = user.email;
        document.getElementById("address").value = user.address;

    }
    if(e.target.classList.contains("cancel")){
        const form=document.querySelector(".hiddenForm");
        form.style.display="none";
    }


});

function handleSubmit(event) {
    event.preventDefault(); // Prevents default form submission
    console.log(event);
    // Get form values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const fullName = document.getElementById("fullName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const roleId = parseInt(document.querySelector('input[name="roleId"]:checked').value);

    // Create the request body
    const data = {
        username,
        password,
        fullName,
        phoneNumber,
        email,
        address
    };

    console.log(data);
    // Make the POST request to /manager/register/{roleId}
    const auth=sessionStorage.getItem("auth");

    if(!auth){
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/manager/register/${roleId}`, {
        method: "POST",
        headers: {
            "Authorization":`Basic ${auth}`,
            "Content-Type": "application/json"

        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.text(); // or response.text() if expecting text
        } else {
            throw new Error("Failed to register user");
        }
    })
    .then(data => {
        console.log(data);
        alert("Registration successful!");
        document.getElementById("userForm").reset();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("There was an error registering the user.");
    });
}

function fetchAllOrders(tbody) {

    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch('http://localhost:8080/manager/allorders',{
        method:"GET",
        headers:{
            "Authorization":`Basic ${auth}`,
            'Content-Type':"application/json"
        },
    })
    .then(res=>{
        if(!res.ok) throw new Error("Failed to get Orders");
        return res.json();
    })
    .then((data)=>{
        displayOrders(data,tbody);
    })
    .catch(error=>console.error("Error Fetching orders",error));

    
}


function displayOrders(orders,tbody){

    tbody.innerHTML = '';
    sorting(orders);

    orders.forEach((order) => {
        const item = order.product;
        const user=order.user;
        const row = `
            <tr>
                <td scope="row">${user.userProfile.fullName}</td>
                <td>${user.userProfile.phoneNumber}</td>
                <td>${item.name}</td>
                <td>${parseInt(order.price / item.price, 10)}</td>
                <td>${order.price}</td>
            </tr>
        `;
        tbody.innerHTML += row;
        // console.log(order);
    })
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

function fetchAllClerks(tbody) {

    const auth=sessionStorage.getItem("auth");

    if(!auth){
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch('http://localhost:8080/manager/getClerks',{
        method:"GET",
        headers:{
            "Authorization":`Basic ${auth}`,
            "Content-Type":"application/json"
        },
    })
    .then((res)=>{
        if(!res.ok){
            throw new Error("Failed to get Clerks");
        }
        return res.json();
    })
    .then(data=>{
        displayWorkers(data,tbody);
    })
    .catch(err=>console.error("Error Fetching clerks"));
    
}

function fetchAllEmps(tbody) {

    const auth=sessionStorage.getItem("auth");

    if(!auth){
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch('http://localhost:8080/manager/getEmps',{
        method:"GET",
        headers:{
            "Authorization":`Basic ${auth}`,
            "Content-Type":"application/json"
        },
    })
    .then((res)=>{
        if(!res.ok){
            throw new Error("Failed to get Clerks");
        }
        return res.json();
    })
    .then(data=>{
        displayWorkers(data,tbody);
    })
    .catch(err=>console.error("Error Fetching clerks"));
    
}

function displayWorkers(workers,tbody){

    tbody.innerHTML='';

    workers.forEach(worker=>{
        // console.log(worker);
        const user=worker.userProfile;
        const userData=JSON.stringify(user);
        const row = `
            <tr>
                <td scope="row">${user.fullName}</td>
                <td>${user.phoneNumber}</td>
                <td>${user.email}</td>
                <td>${user.address}</td>
                <td><button class="btn update" data-worker='${userData.replace(/'/g, "\\'")}'>Update</button>
                    <button class="btn">Remove</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    })
}

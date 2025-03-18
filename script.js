// Responsive Navbar Toggle
const navToggle = document.createElement("button");
navToggle.innerText = "☰";
navToggle.style.background = "black";
navToggle.style.color = "white";
navToggle.style.border = "none";
navToggle.style.fontSize = "1.5rem";
navToggle.style.cursor = "pointer";
navToggle.style.display = "none"; 

document.querySelector("header").prepend(navToggle);
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// Show toggle button only on small screens
window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
        navToggle.style.display = "block";
        navLinks.style.display = "none";
    } else {
        navToggle.style.display = "none";
        navLinks.style.display = "flex";
    }
});
window.dispatchEvent(new Event("resize")); 

// Smooth Scroll for navigation links
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 50,
                behavior: "smooth"
            });
        }
    });
});

// Category Filtering
const categories = document.querySelectorAll(".category");
categories.forEach(category => {
    category.addEventListener("click", () => {
        alert(`You selected: ${category.textContent}`);
    });
});

// Sell Form Validation
const sellForm = document.querySelector("form");
sellForm.addEventListener("submit", event => {
    const inputs = sellForm.querySelectorAll("input, textarea");
    let valid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            valid = false;
            input.style.border = "2px solid red";
        } else {
            input.style.border = "2px solid green";
        }
    });

    if (!valid) {
        event.preventDefault();
        alert("Please fill out all fields!");
    }
});
// Simple Login System using Local Storage
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username === "admin" && password === "1234") {
        localStorage.setItem("loggedIn", "true");
        document.getElementById("login-section").style.display = "none";
        document.getElementById("logout-btn").style.display = "block";
        alert("Login Successful!");
    } else {
        document.getElementById("login-status").innerText = "Invalid username or password!";
    }
}

function logout() {
    localStorage.removeItem("loggedIn");
    document.getElementById("login-section").style.display = "block";
    document.getElementById("logout-btn").style.display = "none";
    alert("Logged Out!");
}

// Check if user is already logged in
window.onload = function () {
    if (localStorage.getItem("loggedIn") === "true") {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("logout-btn").style.display = "block";
    }
};
document.getElementById("sell-form").addEventListener("submit", function (event) {
    event.preventDefault();
    
    let name = document.getElementById("product-name").value;
    let price = document.getElementById("product-price").value;
    let desc = document.getElementById("product-desc").value;

    let product = { name, price, desc };
    
    // Get existing products from Local Storage
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(product);

    localStorage.setItem("products", JSON.stringify(products));
    alert("Product added for Sale!");

    // Clear form
    this.reset();
});
function loadProducts() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let productList = document.getElementById("product-list");

    productList.innerHTML = "";

    products.forEach((product, index) => {
        let productDiv = document.createElement("div");
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: ₹${product.price}</p>
            <p>${product.desc}</p>
            <button onclick="buyProduct(${index})">Buy</button>
            <hr>
        `;
        productList.appendChild(productDiv);
    });
}

function buyProduct(index) {
    let products = JSON.parse(localStorage.getItem("products"));
    alert(`You bought ${products[index].name} for ₹${products[index].price}`);
    
    // Remove from Sell List after purchase
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));

    loadProducts();
}

// Load Products on Page Load
window.onload = function () {
    loadProducts();
};

//login signup

function forgotp(){
          alert("Please keep trying until you remember it");
        }
        function login(a){
          x=a.innerText;
          if(x=="Sign up"){
            login_form.style.display="none";
            signup_form.style.display="block";
            a.innerText="Log in";
          }else {
            signup_form.style.display="none";
            login_form.style.display="block";
            a.innerText="Sign up";
          }
        }
        function logincheck(){
          return true;
        }
        function signupcheck(){
          x=document.signupform.loginname.value;
          y=document.signupform.username.value;
          if(y=="")document.signupform.username.value=x;
          return true;
        }

//***new 
function logincheck() {
      
      return true;
    }

    function signupcheck() {
      // Basic validation can go here
      return true;
    }

const swiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: "#next",
    prevEl: "#prev",
  },
});

// Targeting the elements and storing them in variable.
const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const closeBtn = document.querySelector(".close-btn");
const cardList = document.querySelector(".card-list");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartValue = document.querySelector(".cart-value");
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const bars = document.getElementsByClassName(".fa-bars");
const cartPopup = document.getElementById("cartPopup");

const showPopup = (message) => {
  cartPopup.textContent = message;
  cartPopup.classList.add("show");

  setTimeout(() => {
    cartPopup.classList.remove("show");
  }, 2000);
};

// NOTE: Opening and Closing of Cart Tab by clicking on cart icon and closing by pressing close btn
cartIcon.addEventListener("click", () =>
  cartTab.classList.add("cart-tab-active"),
);
closeBtn.addEventListener("click", () =>
  cartTab.classList.remove("cart-tab-active"),
);
hamburger.addEventListener("click", () =>
  mobileMenu.classList.toggle("mobile-menu-active"),
);
hamburger.addEventListener("click", () => bars.classList.toggle("fa-xmark"));

let productList = [];
let cartProduct = [];

// NOTE: Update the Total bill
const updateTotals = () => {
  let totalPrice = 0;
  // NOTE: Updating the Total cart icon
  let totalQuantity = 0;
  document.querySelectorAll(".item").forEach((item) => {
    const quantity = parseInt(
      item.querySelector(".quantity-value").textContent,
    );
    const price = parseFloat(
      item.querySelector(".item-total").textContent.replace("Rs", ""),
    );
    totalPrice = totalPrice + price;
    totalQuantity = totalQuantity + quantity;
  });
  cartTotal.textContent = `Rs${totalPrice.toFixed(2)}`;
  cartValue.textContent = totalQuantity;
};

// NOTE: Making a function to show food item card in menu list.
const showCards = () => {
  productList.forEach((product) => {
    const orderCard = document.createElement("div"); //creating div
    orderCard.classList.add("order-card"); //naming div class="order-card"

    //inserting more divs inside above div
    orderCard.innerHTML = ` 
    <div class="card-image">
      <img src="${product.image}">
    </div>
    <h4>${product.name}</h4>
    <h4 class="price">${product.price}</h4>
    <a href="#" class="btn card-btn">Add to Cart</a>
    `;

    cardList.appendChild(orderCard); //cart-list is a class of a div in our MENU LIST section

    //by clicking the card button it alerts "hi"
    const cardBtn = orderCard.querySelector(".card-btn");
    cardBtn.addEventListener("click", (e) => {
      //passing event
      e.preventDefault(); //stopping the page from reloading, as a click on button reloads the page.
      addToCart(product);
    });
  });
};

const addToCart = (product) => {
  //If food is clicked twice it will add only one time in cart tab not twice...! (Repeatation not allowed)
  const existingProduct = cartProduct.find((item) => item.id === product.id);
  if (existingProduct) {
    showPopup("Item already in cart");
    return;
  }
  // if (existingProduct){
  //   alert('This item is already in your cart!');
  //   return;
  // }
  //if new item it will be pushed to cartProduct.
  cartProduct.push(product);

  //initial quantity of food that is 1 in cart tab.
  let quantity = 1; //let because it varies.
  let price = parseFloat(product.price.replace("Rs", ""));

  //Adding food items to cart tab
  const cartItem = document.createElement("div");
  cartItem.classList.add("item");

  cartItem.innerHTML = `
    <div class="item-image"> 
      <img src="${product.image}" />
    </div>
    <div class="detail">
      <h4>${product.name}</h4>
      <h4 class="item-total">${product.price}</h4>
    </div>
    <div class="flex">
      <a href="#" class="quantity-btn minus">
        <i class="fa-solid fa-minus"></i>
      </a>
      <h4 class="quantity-value">${quantity}</h4>
      <a href="#" class="quantity-btn plus">
        <i class="fa-solid fa-plus"></i>
      </a>
    </div>
  `;

  // cartList.appendChild(cartItem);
  // updateTotals();
  cartList.appendChild(cartItem);
  updateTotals();
  showPopup("Item added to cart");

  const plusBtn = cartItem.querySelector(".plus");
  const quantityValue = cartItem.querySelector(".quantity-value");
  const itemTotal = cartItem.querySelector(".item-total");
  const minusBtn = cartItem.querySelector(".minus");

  plusBtn.addEventListener("click", (e) => {
    e.preventDefault();
    quantity++;
    quantityValue.textContent = quantity;
    itemTotal.textContent = `Rs ${(price * quantity).toFixed(2)}`;
    updateTotals();
  });

  minusBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (quantity > 1) {
      quantity--;
      quantityValue.textContent = quantity;
      itemTotal.textContent = `Rs ${(price * quantity).toFixed(2)}`;
      updateTotals();
    } else {
      cartItem.classList.add("slide-out");

      setTimeout(() => {
        cartItem.remove();
        cartProduct = cartProduct.filter((item) => item.id !== product.id);
        updateTotals();
      }, 300);
    }
  });
};

const initApp = () => {
  fetch("products.json")
    .then((response) => response.json()) //raw data gets convert into JS object
    .then((data) => {
      productList = data; //data gets stored in productList variable
      showCards(); //calling the function
    });
};
initApp(); // calling the fuction

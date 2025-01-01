// js/main.js
const cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  alert(`${name} added to cart!`);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const totalPrice = document.getElementById('total-price');
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.innerText = `${item.name} - $${item.price}`;
    cartItems.appendChild(cartItem);
    total += item.price;
  });

  totalPrice.innerText = `Total: $${total}`;
}

function checkout() {
  alert('Checkout feature coming soon!');
}

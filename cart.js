document.addEventListener("DOMContentLoaded", function() {
    loadCart();

    function loadCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartList = document.getElementById('cartList');
        const totalPriceElement = document.getElementById('totalPrice');
        let totalPrice = 0;
        cartList.innerHTML = '';

        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.name} x${item.quantity} - ${item.price * item.quantity} f cfa
                <button class="remove-item" data-id="${item.id}"> Rétiré❌</button>
            `;
            cartList.appendChild(li);
            totalPrice += item.price * item.quantity;
        });

        totalPriceElement.textContent = `Total: ${totalPrice} f cfa`;
        addRemoveItemListeners();
    }

    function addRemoveItemListeners() {
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = button.getAttribute('data-id');
                removeFromCart(productId);
            });
        });
    }

    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let stockData = JSON.parse(localStorage.getItem('stock')) || {};

        const productIndex = cart.findIndex(item => item.id === productId);
        if (productIndex !== -1) {
            let product = cart[productIndex];
            cart[productIndex].quantity--;

            if (cart[productIndex].quantity === 0) {
                cart.splice(productIndex, 1);
            }

            stockData[productId] = (stockData[productId] || 0) + 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('stock', JSON.stringify(stockData));
            loadCart();
        }
    }
});

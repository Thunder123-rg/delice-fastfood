document.addEventListener("DOMContentLoaded", function() {
    updateCartCount();
    loadStock();

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = button.getAttribute('data-id');
            const productName = button.getAttribute('data-name');
            const productPrice = parseFloat(button.getAttribute('data-price'));   
            const stockElement = document.getElementById(`stock${productId}`);
            let stock = parseInt(stockElement.textContent);
            let stockData = JSON.parse(localStorage.getItem('stock')) || {};

            if (stock > 0) {
                addToCart(productId, productName, productPrice);
                stock--;
                stockElement.textContent = stock;
                stockData[productId] = stock;
                localStorage.setItem('stock', JSON.stringify(stockData));

                showConfirmationMessage(`${productName} ajouté au panier !`);
            } else {
                alert("Désolé, ce produit est en rupture de stock.");
            }
        });
    });

    function addToCart(id, name, price) {
        const cart = getCart();
        const productIndex = cart.findIndex(product => product.id === id);

        if (productIndex !== -1) {
            cart[productIndex].quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
  
    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }
    
    function updateCartCount() {
        const cart = getCart();
        const totalItems = cart.reduce((total, product) => total + product.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;
    }

    function loadStock() {
        let stockData = JSON.parse(localStorage.getItem('stock')) || {};
        Object.keys(stockData).forEach(id => {
            const stockElement = document.getElementById(`stock${id}`);
            if (stockElement) stockElement.textContent = stockData[id];
        });
    }

    function showConfirmationMessage(message) {
        const msg = document.createElement('div');
        msg.textContent = message;
        msg.className = 'confirmation-message';
        document.body.appendChild(msg);

        setTimeout(() => {
            msg.remove();
        }, 2000);
    }
});

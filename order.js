document.addEventListener("DOMContentLoaded", function() {
    loadOrderSummary();

    function loadOrderSummary() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const orderList = document.getElementById('orderList');
        const totalPriceElement = document.getElementById('totalPrice');
        let totalPrice = 0;

        orderList.innerHTML = '';
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} x${item.quantity} - ${item.price * item.quantity} f cfa`;
            orderList.appendChild(li);
            totalPrice += item.price * item.quantity;
        });

        totalPriceElement.textContent = `Total: ${totalPrice} f cfa`;
    }

    const paymentForm = document.getElementById('paymentForm');
    paymentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const numero = document.getElementById('numero').value;
        const address = document.getElementById('address').value;

        if (name.trim() === "" || numero.trim() === "" || address.trim() === "") {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        processPayment(name, numero, address);
    });

    function processPayment(name, numero, address) {
        const paymentMessage = document.getElementById('paymentMessage');
        paymentMessage.innerHTML = `<p>Merci pour votre commande, ${name}!</p>
                                    <p>Nous vous prions de patienté.</p>
                                    <p>Votre commande est prise en charge et elle sera livrée à l'adresse : ${address}</p>
                                    <p>nous pourrons vous appelé sur votre numero( ${numero} ) donc gardez le près de vous</p>`;
                                    

        localStorage.removeItem('cart');
        localStorage.removeItem('stock');
    }
});

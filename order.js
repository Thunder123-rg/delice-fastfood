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
            li.textContent = `${item.name} x${item.quantity} - ${item.price * item.quantity} F CFA`;
            orderList.appendChild(li);
            totalPrice += item.price * item.quantity;
        });

        totalPriceElement.textContent = `Total: ${totalPrice} F CFA`;
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

        sendOrderDetailsByEmail(name, numero, address);
        processPayment(name, numero, address);
    });

    function processPayment(name, numero, address) {
        const paymentMessage = document.getElementById('paymentMessage');
        paymentMessage.innerHTML = `<p>Merci pour votre commande, ${name} !</p>
            <p>Nous vous prions de patienter.</p>
            <p>Votre commande est prise en charge et elle sera livrée à l'adresse : ${address}</p>
            <p>Nous pourrons vous appeler sur votre numéro (${numero}), donc gardez-le près de vous.</p>`;

        localStorage.removeItem('cart');
        localStorage.removeItem('stock');
    }

    function sendOrderDetailsByEmail(name, numero, address) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let orderDetails = `Nom : ${name}\nNuméro : ${numero}\nAdresse : ${address}\n\nCommande:\n`;

        cart.forEach(item => {
            orderDetails += `- ${item.name} x${item.quantity} = ${item.price * item.quantity} F CFA\n`;
        });

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        orderDetails += `\nTotal : ${total} F CFA`;

        console.log("Détails de la commande :", orderDetails); // Debug

        fetch("https://formspree.io/f/xwplyjng", { // Remplace TON_ID_ICI
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                message: orderDetails
            })
        })
        .then(response => {
            if (response.ok) {
                console.log("Commande envoyée !");
            } else {
                console.log("Erreur lors de l'envoi du formulaire.");
            }
        })
        .catch(error => {
            console.error("Erreur réseau :", error);
        });
    }
});

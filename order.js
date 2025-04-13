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

        // Appel de la fonction pour traiter la commande et envoyer les détails par email
        processPayment(name, numero, address);
    });

    function processPayment(name, numero, address) {
        // Message de confirmation pour l'utilisateur
        const paymentMessage = document.getElementById('paymentMessage');
        paymentMessage.innerHTML = `<p>Merci pour votre commande, ${name}!</p>
                                    <p>Nous vous prions de patienter.</p>
                                    <p>Votre commande est prise en charge et elle sera livrée à l'adresse : ${address}</p>
                                    <p>Nous pourrons vous appeler sur votre numéro (${numero}) donc gardez-le près de vous.</p>`;

        // Envoi des détails de la commande par email via Formspree
        sendOrderDetailsByEmail(name, numero, address);

        // Vider le panier après la commande
        localStorage.removeItem('cart');
        localStorage.removeItem('stock');
    }

    function sendOrderDetailsByEmail(name, numero, address) {
        // Récupérer le panier
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let orderDetails = `Nom : ${name}\nNuméro : ${numero}\nAdresse : ${address}\n\nDétails de la commande:\n`;

        cart.forEach(item => {
            orderDetails += `${item.name} x${item.quantity} - ${item.price * item.quantity} f cfa\n`;
        });

        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        orderDetails += `\nTotal : ${totalPrice} f cfa`;

        // Envoi des détails de la commande à Formspree
        fetch("https://formspree.io/f/xwplyjng", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                email: "delicefastfood7@gmail.com", // Tu peux ajouter un champ email ici si tu veux
                message: orderDetails
            }),
        })
        .then(response => {
            if (response.ok) {
                console.log("Commande envoyée avec succès !");
            } else {
                console.log("Erreur lors de l'envoi de la commande.");
            }
        })
        .catch(error => {
            console.log("Erreur:", error);
        });
    }
});

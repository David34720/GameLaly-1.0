class CustomNotification {
    constructor(message, level = 'success', duration = 3000) {
        this.message = message;
        this.level = level;
        this.duration = duration;
        this.notif = null; // Pour stocker l'élément notification
        this.notify();
    }

    create() {
        const div = document.createElement('div');
        div.innerText = this.message;
        div.classList.add('notification');
        div.classList.add(this.level);

        this.notif = div;
    }

    notify() {
        this.create();

        const notificationContainer = document.querySelector('.notifications');
        
        if (!notificationContainer) {
            console.error('Le conteneur .notifications est introuvable');
            return;
        }

        notificationContainer.append(this.notif);

        setTimeout(() => {
            this.notif.remove();
        }, this.duration);
    }
}

// Utilisation de la classe CustomNotification
// setTimeout(() => {
//     new CustomNotification('Bienvenue sur Laly\'s Game !', 'success', 5000);
// }, 200);

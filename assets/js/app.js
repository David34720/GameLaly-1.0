class Notification {
    level;
    message;
    notif;
    duration;

    /**
     *
     * @param {string} message
     * @param {string} level une classe CSS
     * @param {number} duration en ms
     */
    constructor(message, level = 'success', duration = 3e3) {
        this.message = message;
        this.level = level;
        this.duration = duration;
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

        document.querySelector('.notifications').append(this.notif);

        setTimeout(() => {
            document.querySelector('.notification').remove();
        }, this.duration);
    }
}

setTimeout(() => {
    new Notification('toto est content');
}, 1000);
setTimeout(() => {
    new Notification('toto est content', 'warning');
}, 2000);
setTimeout(() => {
    new Notification('toto est content', 'danger');
}, 3000);

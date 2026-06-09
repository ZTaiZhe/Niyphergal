function createRipple(event, button) {
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    button.appendChild(ripple);

    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

function initRipple() {
    document.addEventListener('click', (e) => {
        const button = e.target.closest('.btn-ripple');
        if (button && !button.classList.contains('nav-item')) {
            createRipple(e, button);
        }
    });
}

export { createRipple, initRipple };

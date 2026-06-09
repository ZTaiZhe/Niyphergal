function initFormKeyboardHandler() {
    const inputs = document.querySelectorAll('input, textarea');

    inputs.forEach(el => {
        el.addEventListener('focus', (e) => {
            if (window.matchMedia('(pointer: coarse)').matches) {
                setTimeout(() => {
                    e.target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 300);
            }
        });
    });
}

export { initFormKeyboardHandler };

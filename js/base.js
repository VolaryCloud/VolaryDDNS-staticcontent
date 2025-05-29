const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

setTimeout(() => {
    const flashMessages = document.querySelectorAll('[role="alert"]');
    flashMessages.forEach(message => {
        message.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => {
            message.remove();
        }, 500);
    });
}, 5000);

document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    const cookieConsent = localStorage.getItem('cookie_consent');

    if (cookieConsent === null) {
        cookieBanner.classList.remove('hidden');
    }

    acceptButton.addEventListener('click', function() {
        localStorage.setItem('cookie_consent', 'accepted');
        cookieBanner.classList.add('hidden');
    });
});

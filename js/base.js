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
        setTimeout(() => {
            cookieBanner.classList.remove('hidden');
            setTimeout(() => {
                cookieBanner.classList.remove('opacity-0', 'scale-95');
                cookieBanner.classList.add('opacity-100', 'scale-100');
            }, 50);
        }, 1000);
    }

    acceptButton.addEventListener('click', function() {
        localStorage.setItem('cookie_consent', 'accepted');

        cookieBanner.classList.remove('opacity-100', 'scale-100');
        cookieBanner.classList.add('opacity-0', 'scale-95');

        setTimeout(() => {
            cookieBanner.classList.add('hidden');
        }, 500);
    });
});

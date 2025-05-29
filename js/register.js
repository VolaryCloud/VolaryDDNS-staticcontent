document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');
    const errorDiv = document.getElementById('register-error');
    const errorMsg = document.getElementById('error-message');
    const registerButton = document.getElementById('register-button');
    const subdomainInput = document.getElementById('subdomain');
    const availabilityDiv = document.getElementById('subdomain-availability');
    const availableSpan = document.getElementById('subdomain-available');
    const unavailableSpan = document.getElementById('subdomain-unavailable');
    const invalidSpan = document.getElementById('subdomain-invalid');

    let checkTimeout = null;

    subdomainInput.addEventListener('input', function() {
        if (checkTimeout) {
            clearTimeout(checkTimeout);
        }

        const subdomain = this.value.trim();

        if (!subdomain) {
            availabilityDiv.classList.add('hidden');
            return;
        }

        checkTimeout = setTimeout(function() {
            fetch(`/check-subdomain?subdomain=${encodeURIComponent(subdomain)}`)
                .then(response => response.json())
                .then(data => {
                    availabilityDiv.classList.remove('hidden');
                    availableSpan.classList.add('hidden');
                    unavailableSpan.classList.add('hidden');
                    invalidSpan.classList.add('hidden');

                    if (data.error === 'Invalid format') {
                        invalidSpan.classList.remove('hidden');
                    } else if (data.available) {
                        availableSpan.classList.remove('hidden');
                    } else {
                        unavailableSpan.classList.remove('hidden');
                    }
                })
                .catch(error => {
                    console.error('Error checking subdomain:', error);
                    availabilityDiv.classList.add('hidden');
                });
        }, 500);
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        errorDiv.classList.add('hidden');

        const originalText = registerButton.innerHTML;
        registerButton.disabled = true;
        registerButton.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Creating account...';

        const formData = new FormData(form);

        if (!document.getElementById('terms-consent').checked) {
            errorDiv.textContent = "You must agree to the Terms of Service and Privacy Policy.";
            errorDiv.classList.remove('hidden');
            return false;
        }

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                errorMsg.textContent = data.error;
                errorDiv.classList.remove('hidden');

                registerButton.disabled = false;
                registerButton.innerHTML = originalText;
            } else if (data.success) {
                window.location.href = data.redirect;
            }
        })
        .catch(error => {
            errorMsg.textContent = "An error occurred. Please try again.";
            errorDiv.classList.remove('hidden');

            registerButton.disabled = false;
            registerButton.innerHTML = originalText;
            console.error('Error:', error);
        });
    });
});

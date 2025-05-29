document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const errorDiv = document.getElementById('login-error');
    const errorMsg = document.getElementById('error-message');
    const loginButton = document.getElementById('login-button');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        errorDiv.classList.add('hidden');

        const originalText = loginButton.innerHTML;
        loginButton.disabled = true;
        loginButton.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Signing in...';

        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (response.status === 429) {
                errorMsg.textContent = "Too many login attempts. Please try again later.";
                errorDiv.classList.remove('hidden');
                loginButton.disabled = false;
                loginButton.innerHTML = originalText;
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                errorMsg.textContent = data.error;
                errorDiv.classList.remove('hidden');

                loginButton.disabled = false;
                loginButton.innerHTML = originalText;
            } else if (data.success) {
                window.location.href = data.redirect;
            }
        })
        .catch(error => {
            errorMsg.textContent = "An error occurred. Please try again.";
            errorDiv.classList.remove('hidden');

            loginButton.disabled = false;
            loginButton.innerHTML = originalText;
            console.error('Error:', error);
        });
    });
});

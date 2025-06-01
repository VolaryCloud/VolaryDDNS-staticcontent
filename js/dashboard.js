const csrfToken = document.querySelector('input[name="csrf_token"]').value;

document.addEventListener('DOMContentLoaded', function() {
    const createSubdomainBtn = document.getElementById('create-subdomain-btn');
    const downloadButtons = document.querySelectorAll('.download-script-btn');

    if (createSubdomainBtn) {
        createSubdomainBtn.addEventListener('click', function () {
            showCreateSubdomainModal();
        });
    }

    function showCreateSubdomainModal() {
        const backdrop = document.createElement('div');
        backdrop.className = 'fixed inset-0 bg-gray-500 bg-opacity-75 z-40';
        document.body.appendChild(backdrop);

        const modal = document.createElement('div');
        modal.className = 'fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 max-w-md w-full';
        modal.innerHTML = `
            <div class="mb-4">
                <h3 class="text-lg font-medium text-gray-900">Create New Subdomain</h3>
                <p class="text-sm text-gray-500 mt-1">Enter a name for your subdomain</p>
            </div>
            <form id="create-subdomain-form">
                <div class="mb-4">
                    <label for="subdomain-name" class="block text-sm font-medium text-gray-700">Subdomain Name</label>
                    <div class="mt-1 flex rounded-md shadow-sm">
                        <span class="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            DDNS-
                        </span>
                        <input type="text" name="name" id="subdomain-name"
                               class="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                               placeholder="mysubdomain">
                        <span class="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            .volary.cloud
                        </span>
                    </div>
                    <p id="name-error" class="mt-1 text-sm text-red-600 hidden"></p>
                </div>
                <div class="mt-5 flex justify-end space-x-3">
                    <button type="button" class="cancel-modal-btn px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Create
                    </button>
                </div>
            </form>`;

        document.body.appendChild(modal);

        modal.querySelector('.cancel-modal-btn').addEventListener('click', function () {
            document.body.removeChild(backdrop);
            document.body.removeChild(modal);
        });

        backdrop.addEventListener('click', function () {
            document.body.removeChild(backdrop);
            document.body.removeChild(modal);
        });

        const form = document.getElementById('create-subdomain-form');
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const nameInput = document.getElementById('subdomain-name');
            const nameError = document.getElementById('name-error');
            const name = nameInput.value.trim();

            if (!name) {
                nameError.textContent = "Subdomain name is required";
                nameError.classList.remove('hidden');
                return;
            }

            if (!/^[a-z0-9-]+$/i.test(name)) {
                nameError.textContent = "Subdomain can only contain letters, numbers, and hyphens";
                nameError.classList.remove('hidden');
                return;
            }

            fetch('/api/subdomains/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({name: name}),
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            throw new Error(data.error || 'Failed to create subdomain');
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    window.location.reload();
                })
                .catch(error => {
                    nameError.textContent = error.message;
                    nameError.classList.remove('hidden');
                });
        });
    }

    downloadButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            const subdomainId = this.getAttribute('data-subdomain-id');

            const backdrop = document.createElement('div');
            backdrop.className = 'fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 z-40';
            document.body.appendChild(backdrop);

            const modal = document.createElement('div');
            modal.className = 'fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full';
            modal.innerHTML = `
                <div class="mb-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Choose your operating system</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Select the operating system where you'll run the update script</p>
                </div>
                <div class="space-y-4">
                    <a href="/download-script/unix/${subdomainId}" class="flex items-center p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div class="flex-shrink-0 text-primary-600 dark:text-primary-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-900 dark:text-white">Unix-like Systems</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Linux, macOS, Raspberry Pi</p>
                        </div>
                    </a>
                    <a href="/download-script/global/${subdomainId}" class="flex items-center p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div class="flex-shrink-0 text-primary-600 dark:text-primary-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-900 dark:text-white">Global</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">All OS's</p>
                        </div>
                    </a>
                </div>
                <div class="mt-5 flex justify-end">
                    <button type="button" class="cancel-btn mt-3 px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-colors">
                        Cancel
                    </button>
                </div>
                `;
            document.body.appendChild(modal);

            modal.querySelector('.cancel-btn').addEventListener('click', function () {
                document.body.removeChild(backdrop);
                document.body.removeChild(modal);
            });

            backdrop.addEventListener('click', function () {
                document.body.removeChild(backdrop);
                document.body.removeChild(modal);
            });
        });
    });
});

function showOSGuide(osType) {
    document.querySelectorAll('.os-guide').forEach(guide => {
        guide.classList.add('hidden');
    });

    document.getElementById(`${osType}-guide`).classList.remove('hidden');

    document.querySelectorAll('.os-button').forEach(button => {
        button.classList.replace('bg-blue-600', 'bg-gray-600');
        button.classList.replace('hover:bg-blue-700', 'hover:bg-gray-700');

        button.classList.replace('dark:bg-blue-700', 'dark:bg-gray-700');
        button.classList.replace('dark:hover:bg-blue-800', 'dark:hover:bg-gray-600');
    });

    const clickedButton = event.currentTarget;

    clickedButton.classList.replace('bg-gray-600', 'bg-blue-600');
    clickedButton.classList.replace('hover:bg-gray-700', 'hover:bg-blue-700');

    clickedButton.classList.replace('dark:bg-gray-700', 'dark:bg-blue-700');
    clickedButton.classList.replace('dark:hover:bg-gray-600', 'dark:hover:bg-blue-800');
}

function toggleTokenVisibility(tokenId) {
    const tokenInput = document.getElementById(tokenId);
    if (tokenInput.type === 'password') {
        tokenInput.type = 'text';
    } else {
        tokenInput.type = 'password';
    }
}

function regenerateToken(subdomainId) {
    if (!confirm('Are you sure you want to regenerate the token? The old token will no longer work.')) {
        return;
    }

    fetch(`/regenerate-token/${subdomainId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById(`token-${subdomainId}`).value = data.token;
            alert('Token has been regenerated successfully');
        } else {
            alert(`Error: ${data.error || 'Failed to regenerate token'}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while regenerating the token');
    });
}

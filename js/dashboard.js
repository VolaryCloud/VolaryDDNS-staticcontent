function showOSGuide(osType) {
    document.querySelectorAll('.os-guide').forEach(guide => {
        guide.classList.add('hidden');
    });

    document.getElementById(`${osType}-guide`).classList.remove('hidden');

    document.querySelectorAll('.os-button').forEach(button => {
        button.classList.replace('bg-blue-600', 'bg-gray-600');
        button.classList.replace('hover:bg-blue-700', 'hover:bg-gray-700');
    });

    event.currentTarget.classList.replace('bg-gray-600', 'bg-blue-600');
    event.currentTarget.classList.replace('hover:bg-gray-700', 'hover:bg-blue-700');
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
            'X-CSRFToken': '{{ csrf_token() }}'
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

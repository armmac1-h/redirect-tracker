function displayRedirects() {
        chrome.storage.local.get('redirectHistory', ({ redirectHistory = [] }) => {
                const container = document.getElementById('redirects');
                container.innerHTML = '';

                if (redirectHistory.length === 0) {
                        container.innerHTML = '<div class="empty-state">No redirect history yet</div>';
                        return;
                }

                redirectHistory.reverse().forEach(redirect => {
                        const div = document.createElement('div');
                        div.className = 'redirect-group';

                        div.innerHTML = `
          <div class="redirect-date">${redirect.date}</div>
          <button class="delete-btn" data-id="${redirect.id}">Delete</button>
          <div class="url">From: ${redirect.fromUrl}</div>
          <div class="url">To: ${redirect.toUrl}</div>
          <div class="status">Status: ${redirect.statusCode}</div>
        `;

                        container.appendChild(div);
                });

                // Add delete button listeners
                document.querySelectorAll('.delete-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                                const redirectId = parseInt(e.target.dataset.id);
                                chrome.runtime.sendMessage(
                                        { action: 'deleteRedirect', redirectId },
                                        () => displayRedirects()
                                );
                        });
                });
        });
}

// Clear all button listener
document.getElementById('clearAll').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'clearAll' }, () => displayRedirects());
});

// Initial display
displayRedirects(); 
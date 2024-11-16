document.getElementById('shortenBtn').addEventListener('click', async () => {
    const longUrl = document.getElementById('longUrl').value;

    if (!longUrl) {
        alert('Please enter a URL');
        return;
    }

    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ longUrl }),
        });

        const data = await response.json();

        if (data.shortUrl) {
            const shortUrl = data.shortUrl;
            const shortUrlElement = document.getElementById('shortUrl');
            const shortUrlContainer = document.getElementById('shortUrlContainer'); // Get the container
        
            shortUrlElement.textContent = shortUrl;  // Set the URL
            shortUrlElement.style.display = 'block';  // Make it visible
        
            shortUrlContainer.style.display = 'block'; // Show the container
        
            // Show the copy and open buttons
            const actionsElement = document.querySelector('.actions');
            actionsElement.style.display = 'flex';
        
            // Copy URL functionality
            document.getElementById('copyBtn').onclick = () => {
                navigator.clipboard.writeText(shortUrl).then(() => {
                    alert('URL copied to clipboard!');
                }).catch(() => {
                    alert('Failed to copy URL');
                });
            };
        
            // Open URL functionality
            document.getElementById('openBtn').onclick = () => {
                window.open(shortUrl, '_blank');
            };
        } else {
            console.error('Short URL not received in response');
            alert('Error shortening URL');
        }
    } catch (err) {
        console.error('Error shortening URL:', err);
        alert('Error shortening URL');
    }
});

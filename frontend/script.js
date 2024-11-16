document.getElementById('shortenBtn').addEventListener('click', async () => {
    const longUrl = document.getElementById('longUrl').value;

    if (!longUrl) {
        alert('Please enter a URL');
        return;
    }

    try {
        // Fetch the shortened URL from the backend
        const response = await fetch('https://localhost:5000/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ longUrl }),
        });

        // Check if the response was successful
        if (!response.ok) {
            throw new Error('Failed to shorten URL');
        }

        const data = await response.json();

        // If there is no short URL in the response, handle this case
        if (!data.shortUrl) {
            throw new Error('Invalid response from server');
        }

        // Display the shortened URL
        const shortUrl = data.shortUrl;
        const shortUrlElement = document.getElementById('shortUrl');
        shortUrlElement.textContent = shortUrl;
        shortUrlElement.style.display = 'block';

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

    } catch (err) {
        console.error(err);
        alert('Error shortening URL: ' + err.message);
    }
});

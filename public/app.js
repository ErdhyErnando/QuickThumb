// QuickThumb - Retro Terminal YouTube Thumbnail Grabber
// DOM element references
const urlInput = document.getElementById('url');
const fetchBtn = document.getElementById('fetchBtn');
const resultBox = document.getElementById('result');
const thumbImg = document.getElementById('thumb');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

// YouTube thumbnail quality hierarchy (best to worst)
const qualities = ['maxresdefault', 'hqdefault', 'mqdefault', 'sddefault'];

// Fun retro-themed messages
const messages = {
    fetching: [
        '>>> INITIALIZING THUMB_GRAB.EXE <<<',
        '>>> HACKING THE MAINFRAME <<<',
        '>>> DOWNLOADING THE INTERNET <<<',
        '>>> ACCESSING YOUTUBE SERVERS <<<',
        '>>> EXTRACTING DIGITAL GOODNESS <<<'
    ],
    success: [
        '>>> MISSION ACCOMPLISHED! <<<',
        '>>> THUMBNAIL ACQUIRED! <<<',
        '>>> HACK SUCCESSFUL! <<<',
        '>>> TARGET LOCKED AND LOADED! <<<',
        '>>> DIGITAL TREASURE FOUND! <<<'
    ],
    error: [
        '>>> ERROR: THUMBNAIL NOT FOUND <<<',
        '>>> ABORT: TARGET UNREACHABLE <<<',
        '>>> FAIL: SERVER SAYS NO <<<',
        '>>> 404: THUMB WENT MISSING <<<',
        '>>> OOPS: SOMETHING WENT WRONG <<<'
    ],
    copied: [
        '>>> URL COPIED TO MEMORY <<<',
        '>>> DATA TRANSFERRED <<<',
        '>>> LINK ACQUIRED <<<',
        '>>> CLIPBOARD UPDATED <<<',
        '>>> COPY OPERATION COMPLETE <<<'
    ],
    downloaded: [
        '>>> FILE DOWNLOADED TO DISK <<<',
        '>>> SAVE OPERATION COMPLETE <<<',
        '>>> IMAGE SECURED TO STORAGE <<<',
        '>>> DOWNLOAD SUCCESSFUL <<<',
        '>>> FILE TRANSFER COMPLETE <<<'
    ],
    invalid: [
        '>>> INVALID URL DETECTED <<<',
        '>>> ERROR: NOT A YOUTUBE LINK <<<',
        '>>> ABORT: BAD INPUT <<<',
        '>>> FAIL: URL MALFORMED <<<',
        '>>> SYNTAX ERROR IN URL <<<'
    ]
};

// Get random message from array
function getRandomMessage(type) {
    const msgs = messages[type] || messages.error;
    return msgs[Math.floor(Math.random() * msgs.length)];
}

// Enhanced toast function with retro styling
function toast(msg, type = 'info') {
    const config = {
        text: msg,
        duration: 3000,
        gravity: 'bottom',
        position: 'right',
        className: `toast-${type}`,
        style: {
            background: 'var(--bg)',
            color: type === 'error' ? 'var(--error)' : type === 'success' ? 'var(--fg)' : 'var(--accent)',
            border: `1px solid ${type === 'error' ? 'var(--error)' : type === 'success' ? 'var(--fg)' : 'var(--accent)'}`,
            borderRadius: '0',
            fontFamily: 'Share Tech Mono, monospace',
            textShadow: `0 0 3px ${type === 'error' ? 'var(--error)' : type === 'success' ? 'var(--fg)' : 'var(--accent)'}`,
            boxShadow: `0 0 8px ${type === 'error' ? 'var(--error)' : type === 'success' ? 'var(--fg)' : 'var(--accent)'}`
        }
    };

    Toastify(config).showToast();
}

// Extract YouTube video ID from various URL formats
function getVideoId(str) {
    try {
        const url = new URL(str);

        // Handle youtu.be short links
        if (url.hostname === 'youtu.be') {
            return url.pathname.slice(1).split('?')[0];
        }

        // Handle youtube.com links
        if (url.hostname.includes('youtube.com')) {
            // Standard watch URL
            if (url.pathname === '/watch') {
                return url.searchParams.get('v');
            }
            // Embed URL
            if (url.pathname.startsWith('/embed/')) {
                return url.pathname.split('/embed/')[1].split('?')[0];
            }
        }
    } catch (e) {
        // Invalid URL format
        return null;
    }
    return null;
}

// Check if image loads successfully
function checkImageExists(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
    });
}

// Download image file directly
async function downloadImage(url, filename) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();

        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        toast(getRandomMessage('downloaded'), 'success');
    } catch (error) {
        console.error('Download failed:', error);
        toast('>>> DOWNLOAD FAILED - TRY COPY URL <<<', 'error');
    }
}

// Real-time URL validation
urlInput.addEventListener('input', () => {
    const videoId = getVideoId(urlInput.value.trim());
    fetchBtn.disabled = !videoId;

    // Add visual feedback for valid URLs
    if (videoId) {
        urlInput.style.borderColor = 'var(--fg)';
        urlInput.style.boxShadow = '0 0 5px var(--fg)';
    } else if (urlInput.value.trim()) {
        urlInput.style.borderColor = 'var(--error)';
        urlInput.style.boxShadow = '0 0 5px var(--error)';
    } else {
        urlInput.style.borderColor = 'var(--border)';
        urlInput.style.boxShadow = 'none';
    }
});

// Main fetch functionality
fetchBtn.addEventListener('click', async () => {
    const videoId = getVideoId(urlInput.value.trim());

    if (!videoId) {
        toast(getRandomMessage('invalid'), 'error');
        return;
    }

    // Hide previous results and show loading
    resultBox.classList.add('hidden');
    fetchBtn.disabled = true;
    fetchBtn.textContent = '[PROCESSING] PLEASE_WAIT...';

    toast(getRandomMessage('fetching'), 'info');

    // Try each quality level until one works
    for (const quality of qualities) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;

        const exists = await checkImageExists(thumbnailUrl);

        if (exists) {
            // Success! Display the thumbnail
            thumbImg.src = thumbnailUrl;
            thumbImg.alt = `YouTube thumbnail for video ${videoId}`;

            // Store data for download functionality
            thumbImg.dataset.videoId = videoId;
            thumbImg.dataset.quality = quality;
            thumbImg.dataset.url = thumbnailUrl;

            resultBox.classList.remove('hidden');
            toast(getRandomMessage('success'), 'success');

            // Reset button
            fetchBtn.disabled = false;
            fetchBtn.textContent = '[EXECUTE] FETCH_THUMBNAIL';
            return;
        }
    }

    // No thumbnail found at any quality level
    toast(getRandomMessage('error'), 'error');
    fetchBtn.disabled = false;
    fetchBtn.textContent = '[EXECUTE] FETCH_THUMBNAIL';
});

// Copy URL to clipboard
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(thumbImg.src);
        toast(getRandomMessage('copied'), 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = thumbImg.src;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast(getRandomMessage('copied'), 'success');
    }
});

// Download functionality - actual file download
downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const url = thumbImg.dataset.url;
    const videoId = thumbImg.dataset.videoId;
    const quality = thumbImg.dataset.quality;

    if (url && videoId && quality) {
        const filename = `youtube-thumb-${videoId}-${quality}.jpg`;
        downloadImage(url, filename);
    }
});

// Enter key support
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !fetchBtn.disabled) {
        fetchBtn.click();
    }
});

// Initialize with retro startup message
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        toast('>>> SYSTEM READY - PASTE YOUTUBE URL <<<', 'info');
    }, 500);
});

// Easter egg: Konami code
let konamiCode = [];
const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konami.join(',')) {
        toast('>>> KONAMI CODE ACTIVATED! RETRO MODE ENGAGED! <<<', 'success');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 3000);
    }
}); 
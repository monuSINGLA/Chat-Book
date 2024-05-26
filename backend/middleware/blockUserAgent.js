const blockedSubstrings = [
    'acunetix',      // Example: block any user-agent containing 'acunetix'
    'nikto',         // Example: block any user-agent containing 'nikto'
    'w3af',
    "https://app.pentest-tools.com/"          // Example: block any user-agent containing 'w3af'
    // Add more substrings as needed
];

// Middleware to block requests from user-agents containing specified substrings
function blockScanningTools(req, res, next) {
    const userAgent = req.headers['user-agent'];

    // Check if the request's user-agent contains any of the blocked substrings
    if (userAgent && blockedSubstrings.some(substring => userAgent.toLowerCase().includes(substring))) {
        // Respond with a 403 Forbidden status code
        return res.status(403).send('Forbidden');
    }

    // If the request's user-agent does not contain any blocked substrings, proceed to the next middleware
    next();
}


export default blockScanningTools
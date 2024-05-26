// middleware function to block requests from specific user-agents
function blockUserAgent(req, res, next) {
    const userAgent = req.headers['user-agent'];

    // Check if the request is coming from the Pentest-Tools user-agent
    if (userAgent && userAgent.includes('pentest-tools')) {
        // Respond with a 403 Forbidden status code
        return res.status(403).send('Forbidden');
    }

    // If the request is not from the Pentest-Tools user-agent, proceed to the next middleware
    next();
}

export default blockUserAgent
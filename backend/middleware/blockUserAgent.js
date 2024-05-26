// Middleware to block requests from pentest-tools.com domain
function blockPentestTools(req, res, next) {
    const referer = req.headers['referer'];

    // Check if the request's referer header contains the pentest-tools.com domain
    if (referer && referer.toLowerCase().includes('app.pentest-tools.com')) {
        // Respond with a 403 Forbidden status code
        return res.status(403).send('Forbidden');
    }

    // If the request's referer header does not contain pentest-tools.com, proceed to the next middleware
    next();
}

export default blockPentestTools;
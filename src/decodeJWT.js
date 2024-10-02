function decodeJWT(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token format');
        }
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        return payload.id;
    } catch (err) {
        console.error('Failed to decode JWT:', err);
        throw err;
    }
}

export default decodeJWT;

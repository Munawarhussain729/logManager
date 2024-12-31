
export const authenticate = (req, res, next) => {
    if (!req.session.user) {
        // Redirect to login if the user is not authenticated
        return res.redirect('/login');
    }
    next();
};

export const guestOnly = (req, res, next) => {
    if (req.session.user) {
        // Redirect to dashboard if the user is already logged in
        return res.redirect('/dashboard');
    }
    next();
};

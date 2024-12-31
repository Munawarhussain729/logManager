export const TokenSession = (req, res, next) => {   
    console.log("request session ", req.session);
    
    if (!req.session.user) {
        console.log('User not authenticated');
        // return res.redirect('/login'); // Redirect to login if not authenticated
    }
    console.log('User authenticated:', req.session.user);
    next(); // Continue to the next middleware or route
};

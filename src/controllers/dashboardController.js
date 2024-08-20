
export const getDashboard = (req, res) => {
    res.render('layouts/main', { title: 'Dashboard', contentFile: '../dashboard/dashboard' });
};
    
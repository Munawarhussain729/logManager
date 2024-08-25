import { getTotalHours } from "../utils/helperFunction.js";

export const getDashboard = async (req, res) => {
    const result = await getTotalHours({user_id:1})
    if(!result){
        res.render('layouts/main', { title: 'Dashboard', duration:0, contentFile: '../dashboard/dashboard' });
        return
    }
    console.log("result is ", result?.sum);
    
    res.render('layouts/main', { title: 'Dashboard', duration:result?.sum, contentFile: '../dashboard/dashboard' });
};

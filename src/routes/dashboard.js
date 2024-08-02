    import { Router } from "express";

    const router = Router()

    router.get('/', (req, res) => {
        res.render('dashboard/dashboard', { title: 'Dashboard' })
    })

    export default router
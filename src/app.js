import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import { errorHandler, notFoundHandler } from './middlewares/errorHandlers.js';
import dashboardRouter from './routes/dashboard.js'

dotenv.config();

const app = express()
app.use(bodyParser.json())
app.set('view engine','ejs')
app.set('views', './src/views');

app.use('/dashboard', dashboardRouter)

app.get('/',(req,res)=>{
    return res.send('Hey')
})
app.use(notFoundHandler)
app.use(errorHandler)

export default app
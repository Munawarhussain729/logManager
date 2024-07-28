import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import { errorHandler, notFoundHandler } from './middlewares/errorHandlers.js';


dotenv.config();

const app = express()
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    return res.send('Hey')
})
app.use(notFoundHandler)
app.use(errorHandler)

export default app
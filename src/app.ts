import express from 'express'
import dotenv from 'dotenv'
import bodyParser = require('body-parser');
import { errorHandler, notFoundHandler } from './middlewares/errorHandlers';


dotenv.config();

const app = express()
app.use(bodyParser.json())
app.use(notFoundHandler)
app.use(errorHandler)

export default app
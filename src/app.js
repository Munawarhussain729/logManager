import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { errorHandler, notFoundHandler } from './middlewares/errorHandlers.js';
import dashboardRouter from './routes/dashboard.js';
import authRouter from './routes/auth.js';
import dailyLogRouter from './routes/dailyLogs.js';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const upload = multer(); // Initialize multer without any file storage config

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.none());
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Get the __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', authRouter);
// app.use('/dashboard', dashboardRouter);
// app.use('/', dailyLogRouter);

app.get('/', (req, res) => {
    return res.send('Hey');
});
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

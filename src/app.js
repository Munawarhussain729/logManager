import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { errorHandler, notFoundHandler } from './middlewares/errorHandlers.js';
import dashboardRouter from './routes/dashboard.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Get the __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, 'views')));

app.use('/dashboard', dashboardRouter);

app.get('/', (req, res) => {
    return res.send('Hey');
});
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

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
import session from 'express-session';

dotenv.config();

const app = express();
const upload = multer(); // Initialize multer without any file storage config

// Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.none());
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Session Middleware
app.use(
    session({
        secret: '7A2E96393D6126FC548E61E2A9717',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24, },
    })
);


// Get the __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, 'views')));

// Routes
app.use('/', authRouter);
app.use('/', dashboardRouter);
app.use('/', dailyLogRouter);

// Example Root Route
app.get('/', (req, res) => {
    return res.send('Page not found ');
});

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

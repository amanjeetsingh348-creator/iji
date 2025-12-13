const http = require('http');
const mysql = require('mysql2/promise');

// Database configuration with hardcoded credentials as requested
const dbConfig = {
    host: "shuttle.proxy.rlwy.net",
    user: "root",
    password: "WiGhctjnxmSBDWukfTiCLzvLGrXRmQdt",
    database: "railway",
    port: 36666,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

// Database schema
const schema = `
-- Word Tracker Database Schema
-- Database: word_tracker

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS word_tracker;
USE word_tracker;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Plans table (updated schema)
CREATE TABLE IF NOT EXISTS plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NULL,
    activity_type VARCHAR(100) NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    goal_amount INT NOT NULL DEFAULT 0,
    strategy VARCHAR(50) DEFAULT 'steady',
    intensity VARCHAR(50) DEFAULT 'average',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Plan Days table (daily schedule)
CREATE TABLE IF NOT EXISTS plan_days (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL,
    date DATE NOT NULL,
    target INT NOT NULL DEFAULT 0,
    logged INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
    UNIQUE KEY unique_plan_date (plan_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Checklists table
CREATE TABLE IF NOT EXISTS checklists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NULL,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Checklist Items table
CREATE TABLE IF NOT EXISTS checklist_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    checklist_id INT NOT NULL,
    item_text TEXT NOT NULL,
    is_done BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (checklist_id) REFERENCES checklists(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

let pool;
let server;

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('[ERROR] Unhandled Rejection at:', promise);
    console.error('[ERROR] Reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('[FATAL] Uncaught Exception:', err);
    shutdown();
});

// Graceful shutdown
const shutdown = async () => {
    console.log('[INFO] Shutting down gracefully...');

    if (server) {
        server.close(() => {
            console.log('[INFO] HTTP server closed.');
        });
    }

    if (pool) {
        try {
            await pool.end();
            console.log('[INFO] Database pool closed.');
        } catch (err) {
            console.error('[ERROR] Error closing database pool:', err.message);
        }
    }

    process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Sleep utility for retry logic
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize database with retry logic
async function initializeDatabase(retries = 5) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`[INFO] Attempting database schema initialization (attempt ${attempt}/${retries})...`);

            const connection = await mysql.createConnection(dbConfig);

            try {
                await connection.query(schema);
                console.log('[SUCCESS] Database schema executed successfully.');
                return true;
            } finally {
                await connection.end();
            }
        } catch (err) {
            console.error(`[ERROR] Database schema initialization failed (attempt ${attempt}/${retries}):`, err.message);

            if (attempt < retries) {
                const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                console.log(`[INFO] Retrying in ${waitTime}ms...`);
                await sleep(waitTime);
            } else {
                console.error('[FATAL] All database initialization attempts failed.');
                throw err;
            }
        }
    }
}

// Verify database connection
async function verifyConnection(retries = 5) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`[INFO] Verifying database connection (attempt ${attempt}/${retries})...`);
            await pool.query('SELECT 1');
            console.log('[SUCCESS] Database connection verified.');
            return true;
        } catch (err) {
            console.error(`[ERROR] Database connection verification failed (attempt ${attempt}/${retries}):`, err.message);

            if (attempt < retries) {
                const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                console.log(`[INFO] Retrying in ${waitTime}ms...`);
                await sleep(waitTime);
            } else {
                console.error('[FATAL] All connection verification attempts failed.');
                throw err;
            }
        }
    }
}

// Start the application
async function startApp() {
    try {
        console.log('[INFO] Starting Word Tracker Backend...');
        console.log('[INFO] Node version:', process.version);
        console.log('[INFO] Environment:', process.env.NODE_ENV || 'development');

        // Initialize database schema
        await initializeDatabase();

        // Create connection pool
        console.log('[INFO] Creating database connection pool...');
        pool = mysql.createPool(dbConfig);

        // Verify connection
        await verifyConnection();

        const PORT = process.env.PORT || 3000;

        // Create HTTP server
        server = http.createServer(async (req, res) => {
            // CORS Support for Netlify frontend
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
            res.setHeader('Access-Control-Max-Age', '86400');

            // Handle preflight requests
            if (req.method === 'OPTIONS') {
                res.writeHead(204);
                res.end();
                return;
            }

            // Health check endpoints
            if (req.url === '/health' || req.url === '/status') {
                try {
                    await pool.query('SELECT 1');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        status: 'healthy',
                        uptime: process.uptime(),
                        timestamp: new Date().toISOString(),
                        database: 'connected'
                    }));
                } catch (err) {
                    console.error('[ERROR] Health check failed:', err.message);
                    res.writeHead(503, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        status: 'unhealthy',
                        error: 'Database connection failed',
                        timestamp: new Date().toISOString()
                    }));
                }
                return;
            }

            // Root endpoint
            if (req.url === '/') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Word Tracker API',
                    version: '1.0.0',
                    status: 'running'
                }));
                return;
            }

            // 404 for all other routes
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: 'Not Found',
                path: req.url
            }));
        });

        // Start listening
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`[SUCCESS] Server running on port ${PORT}`);
            console.log(`[INFO] Health check available at: http://0.0.0.0:${PORT}/health`);
        });

        // Handle server errors
        server.on('error', (err) => {
            console.error('[FATAL] Server error:', err);
            process.exit(1);
        });

    } catch (err) {
        console.error('[FATAL] Failed to start application:', err);
        process.exit(1);
    }
}

// Start the application
startApp();

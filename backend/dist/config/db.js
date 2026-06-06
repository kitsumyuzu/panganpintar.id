"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@/config/index");
const promise_1 = __importDefault(require("mysql2/promise"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pool = promise_1.default.createPool({
    host: index_1.config.db.host || 'localhost',
    user: index_1.config.db.user || 'root',
    password: index_1.config.db.password || '',
    database: index_1.config.db.database || 'panganpintar',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true
});
const verifyConnection = async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        const sqlFile = path_1.default.join(__dirname, '../schema.sql');
        const sql = fs_1.default.readFileSync(sqlFile, 'utf-8');
        const statements = sql.split(';').filter(stmt => stmt.trim());
        for (const statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
            }
        }
        connection.release(); // Close connection
        console.log('🌿 [Database] Database connected & tables initialized successfully');
    }
    catch (e) {
        console.error('🌿 [Nofutechnology] Database filed to connect');
        console.error(e.message);
    }
};
verifyConnection();
exports.default = pool;

module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: '123456',
    database: 'meetings_api',
    define: {
        timestamps: true,
        underscored: true,
    },
    pool: {
        max: 50,
        min: 10,
        acquire: 30000,
        idle: 10000,
    },
};
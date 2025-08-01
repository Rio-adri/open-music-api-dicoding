const config = {
    app:{
        host: process.env.HOST,
        port: process.env.PORT,
    },
    jwt: {
        key: process.env.ACCESS_TOKEN_KEY,
        refresh: process.env.REFRESH_TOKEN_KEY,
        age: process.env.ACCESS_TOKEN_AGE,
    },
    rabbitmq: {
        server: process.env.RABBITMQ_SERVER,
    },
    cache: {
        host: process.env.REDIS_SERVER,
    }
}

module.exports = config;
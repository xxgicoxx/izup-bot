const postgresql = {
  username: process.env.POSTGRESQL_USERNAME || 'izup',
  password: process.env.POSTGRESQL_PASSWORD || '123456',
  database: process.env.POSTGRESQL_DATABASE || 'izup',
  host: process.env.POSTGRESQL_HOST || '127.0.0.1',
  dialect: process.env.POSTGRESQL_DIALECT || 'postgres',
};

module.exports = postgresql;

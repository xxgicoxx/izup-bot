const postgresql = {
  username: process.env.IZUP_POSTGRESQL_USERNAME || 'izup',
  password: process.env.IZUP_POSTGRESQL_PASSWORD || '123456',
  database: process.env.IZUP_POSTGRESQL_DATABASE || 'izup',
  host: process.env.IZUP_POSTGRESQL_HOST || '127.0.0.1',
  dialect: process.env.IZUP_POSTGRESQL_DIALECT || 'postgres',
};

module.exports = postgresql;

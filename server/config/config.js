module.exports = {
  'development': {
    'username': process.env.DB_USER || 'root',
    'password': process.env.DB_PASSWORD || '123456',
    'database': process.env.DB_NAME || 'icam',
    'port': process.env.DB_PORT || 3306,
    'host': process.env.DB_HOST || 'mysqldb',
    'dialect': 'mysql'
  },
  'test': {
    'username': process.env.DB_USER || 'root',
    'password': process.env.DB_PASSWORD || '123456',
    'database': process.env.DB_NAME || 'icam',
    'port': process.env.DB_PORT || 3306,
    'host': process.env.DB_HOST || 'mysqldb',
    'dialect': 'mysql'
  },
  'production': {
    'username': process.env.DB_USER || 'root',
    'password': process.env.DB_PASSWORD || '123456',
    'database': process.env.DB_NAME || 'icam',
    'port': process.env.DB_PORT || 3306,
    'host': process.env.DB_HOST || 'mysqldb',
    'dialect': 'mysql'
  }
};

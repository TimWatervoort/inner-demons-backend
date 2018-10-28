module.exports = {
  development: {
    client: `pg`,
    connection: `postgres://localhost/innerdemonsdb`
  },
  test: {},
  production: {
    client: `pg`,
    connection: process.env.DATABASE_URL
  }
}

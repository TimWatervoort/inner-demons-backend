
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments()
    table.string('name').notNullable()
    table.integer('level').notNullable().defaultTo(1)
    table.integer('gold').notNullable().defaultTo(0)
    table.integer('hp').notNullable().defaultTo(10)
    table.integer('xp').notNullable().defaultTo(0)
    table.integer('points_toward_pass').defaultTo(0)
    table.integer('passes').defaultTo(0)
    table.string('image')
    table.timestamps(true, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
}

exports.up = function(knex, Promise) {
  return knex.schema.createTable('monsters_users', function(table) {

    table.increments()
    table.integer('monster_id')
    table.foreign('monster_id').references('monsters.id')

    table.integer('user_id')
    table.foreign('user_id').references('users.id')
  })
}
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('monsters_users')
}

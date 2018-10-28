exports.up = function(knex, Promise) {
  return knex.schema.createTable('monsters_users', function(table) {

    table.increments()
    table.integer('monster_id').notNullable()
    table.foreign('monster_id').references('monsters.id').onDelete('CASCADE')

    table.integer('user_id').notNullable()
    table.foreign('user_id').references('users.id').onDelete('CASCADE')
  })
}
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('monsters_users')
}

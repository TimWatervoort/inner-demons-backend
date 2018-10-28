exports.up = function(knex, Promise) {
  return knex.schema.createTable('weapons_users', function(table) {

    table.increments()
    table.integer('weapon_id').notNullable()
    table.foreign('weapon_id').references('weapons.id').onDelete('CASCADE')

    table.integer('user_id').notNullable()
    table.foreign('user_id').references('users.id').onDelete('CASCADE')
  })
}
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('weapons_users')
}

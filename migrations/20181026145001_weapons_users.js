exports.up = function(knex, Promise) {
  return knex.schema.createTable('weapons_users', function(table) {

    table.increments()
    table.integer('weapon_id')
    table.foreign('weapon_id').references('weapons.id')

    table.integer('user_id')
    table.foreign('user_id').references('users.id')
  })
}
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('weapons_users')
}

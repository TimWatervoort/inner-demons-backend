exports.up = function(knex, Promise) {
  return knex.schema.createTable('tasks', table => {
    table.increments('id')
    table.string('name').notNullable().defaultTo('')
    table.string('description').notNullable().defaultTo('')
    table.integer('gold').notNullable().defaultTo(0)
    table.timestamps(true, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('tasks')
}

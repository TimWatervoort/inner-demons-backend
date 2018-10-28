exports.up = function(knex, Promise) {
  return knex.schema.createTable('monsters', function(table) {

    table.increments()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.integer('attack').notNullable()
    table.integer('hp').notNullable()
    table.string('image').notNullable()
  })
}
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('monsters')
}

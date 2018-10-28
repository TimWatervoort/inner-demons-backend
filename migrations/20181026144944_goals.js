
exports.up = function(knex, Promise) {
  return knex.schema.createTable('goals', table => {
    table.increments('id')
    table.string('name').notNullable().defaultTo('')
    table.integer('xp').notNullable().defaultTo(0)
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('goals')
};


exports.up = function(knex, Promise) {
  return knex.schema.createTable('weapons', table => {
    table.increments();
    table.string('name');
    table.string('description');
    table.integer('attack');
    table.integer('chaos');
    table.string('image');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.createTable('weapons');
};

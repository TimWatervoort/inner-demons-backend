exports.up = function(knex, Promise) {
  return knex.schema.createTable('goals_users', table => {
    table.increments();
    table.integer('goal_id');
    table.foreign('goal_id').references('goals.id');
    table.integer('user_id');
    table.foreign('user_id').references('users.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.scham.dropTableIfExists('goals_users');
};

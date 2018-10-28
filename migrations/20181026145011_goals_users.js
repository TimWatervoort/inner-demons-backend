exports.up = function(knex, Promise) {
  return knex.schema.createTable('goals_users', table => {

    table.increments();
    table.integer('goal_id').notNullable();
    table.foreign('goal_id').references('goals.id').onDelete('CASCADE');

    table.integer('user_id').notNullable();
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
  });
};

exports.down = function(knex, Promise) {
  return knex.scham.dropTableIfExists('goals_users');
};

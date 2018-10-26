exports.up = function(knex, Promise) {
  return knex.schema.createTable('goals_tasks', table => {
    table.increments('id')
    table.integer('goal_id')
    table.foreign('goal_id').references('goals.id')
    table.integer('task_id')
    table.foreign('task_id').references('tasks.id')
    table.timestamps(true, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('goals_tasks')
};

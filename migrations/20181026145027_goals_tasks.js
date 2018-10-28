exports.up = function(knex, Promise) {
  return knex.schema.createTable('goals_tasks', table => {

    table.increments()
    table.integer('goal_id').notNullable()
    table.foreign('goal_id').references('goals.id').onDelete('CASCADE')

    table.integer('task_id').notNullable()
    table.foreign('task_id').references('tasks.id').onDelete('CASCADE')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('goals_tasks')
}

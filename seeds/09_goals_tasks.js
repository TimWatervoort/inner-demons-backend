
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('goals_tasks').del()
    .then(function () {
      // Inserts seed entries
      return knex('goals_tasks').insert([
        {id: 1, goal_id: 1, task_id:1},
        {id: 2, goal_id: 1, task_id:2},
        {id: 3, goal_id: 2, task_id:3},
        {id: 4, goal_id: 2, task_id:4},
        {id: 5, goal_id: 3, task_id:5},
        {id: 6, goal_id: 3, task_id:6}
      ]);
    })
    .then(function() {
        // Moves id column (PK) auto-incrementer to correct value after inserts
        return knex.raw("SELECT setval('goals_tasks_id_seq', (SELECT MAX(id) FROM goals_tasks))")
      })
};

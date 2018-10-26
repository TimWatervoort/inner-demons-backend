
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('goals_users').del()
    .then(function () {
      // Inserts seed entries
      return knex('goals_users').insert([
        {id: 1, goal_id: 1, user_id: 1},
        {id: 2, goal_id: 2, user_id: 2},
        {id: 3, goal_id: 3, user_id: 3}
      ]);
    })
    .then(function() {
      return knex.raw(`SELECT setval('goals_users_id_seq', (SELECT MAX(id) FROM goals_users))`)
    });
};

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('goals').del()
    .then(function() {
      // Inserts seed entries
      return knex('goals').insert([{
          id: 1,
          name: 'Lose Weight',
          experience: 200
        },
        {
          id: 2,
          name: 'Learn to Play Guitar',
          experience: 100
        },
        {
          id: 3,
          name: 'Learn a Language',
          experience: 100
        }
      ]);
    })
    .then(function() {
      return knex.raw(`SELECT setval('goals_id_seq', (SELECT MAX(id) FROM goals))`)
    });
};

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('weapons').del()
    .then(function() {
      // Inserts seed entries
      return knex('weapons').insert([{
          id: 1,
          name: 'Disappointing Glance',
          description: 'The look that hurts the most.',
          attack: 1
        },
        {
          id: 2,
          name: 'Shoe',
          description: 'Just a shoe',
          attack: 1
        },
        {
          id: 3,
          name: 'Fist',
          description: 'Your right hand curled into a ball.  Dude, find a new weapon.',
          attack: 1
        }
      ]);
    })
    .then(function() {
      return knex.raw(`SELECT setval('weapons_id_seq', (SELECT MAX(id) FROM weapons))`)
    });
};

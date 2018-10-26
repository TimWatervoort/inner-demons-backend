exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('tasks').del()
    .then(function() {
      // Inserts seed entries
      return knex('tasks').insert([{
          id: 1,
          name: 'Work out every day',
          description: 'Go to the gym and do things.',
          gold: 10
        },
        {
          id: 2,
          name: 'Diet',
          description: 'Stick to your diet for the day.',
          gold: 10
        },
        {
          id: 3,
          name: 'Practice',
          description: 'Practice your instrument.',
          gold: 10
        },
        {
          id: 4,
          name: 'Learn Something New',
          description: 'Learn a thing.',
          gold: 10
        },
        {
          id: 5,
          name: 'Practice',
          description: 'Find 20 minutes and practice.',
          gold: 10
        },
        {
          id: 6,
          name: 'Learn something new',
          description: 'Learn a new word or phrase.',
          gold: 10
        }
      ]);
    })
    .then(function() {
      return knex.raw(`SELECT setval('tasks_id_seq', (SELECT MAX(id) FROM tasks))`)
    });
};

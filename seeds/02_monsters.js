exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('monsters').del()
    .then(function() {
      // Inserts seed entries
      return knex('monsters').insert([{
          id: 1,
          name: 'Matt Damon',
          description: 'He who brings suffering to the world',
          attack: 5,
          hp: 45,
          image: '/monster/aberration/unseen_horror_new.png'
        },
        {
          id: 2,
          name: 'Skeleton Minion',
          description: 'Spooky horn-playing skeletal monster',
          attack: 2,
          hp: 10,
          image: '/monster/undead/skeletons/skeleton_centaur.png'
        },
        {
          id: 3,
          name: 'Crab',
          description: 'The small creature lumbers across the room, pinching at your toes.',
          attack: 1,
          hp: 5,
          image: '/monster/animals/fire_crab.png'
        }
      ]);
    })
    .then(function() {
      return knex.raw(`SELECT setval('monsters_id_seq', (SELECT MAX(id) FROM monsters))`)
    });
};

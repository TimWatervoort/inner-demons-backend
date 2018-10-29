exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([{
          id: 1,
          name: 'GaryBusey',
          level: 1,
          gold: 10,
          hp: 10,
          xp: 0,
          points_toward_pass: 0,
          passes: 0,
          image: 'https://m.media-amazon.com/images/M/MV5BMTQ2NjM5NjE5NF5BMl5BanBnXkFtZTYwNTk3MjUz._V1_UY317_CR0,0,214,317_AL_.jpg'
        },
        {
          id: 2,
          name: 'NotATim',
          level: 1,
          gold: 10,
          hp: 10,
          xp: 0,
          points_toward_pass: 0,
          passes: 0,
          image: ''
        },
        {
          id: 3,
          name: 'DarkLord420xXx(Tim)',
          level: 1,
          gold: 10,
          hp: 10,
          xp: 0,
          points_toward_pass: 0,
          passes: 0,
          image: ""
        }
      ])
    })
    .then(function() {
      return knex.raw(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`)
    });
};

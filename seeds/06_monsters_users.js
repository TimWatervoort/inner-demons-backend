
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('monsters_users').del()
    .then(function () {
      // Inserts seed entries
      return knex('monsters_users').insert([
        {id: 1, monster_id: 1, user_id: 1},
        {id: 2, monster_id: 2, user_id: 1},
        {id: 3, monster_id: 3, user_id: 2}
      ]);
    })
    .then(function() {
      return knex.raw(`SELECT setval('monsters_users_id_seq', (SELECT MAX(id) FROM monsters_users))`)
    });
};

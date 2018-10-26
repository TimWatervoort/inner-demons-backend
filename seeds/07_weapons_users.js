
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('weapons_users').del()
    .then(function () {
      // Inserts seed entries
      return knex('weapons_users').insert([
        {id: 1, weapon_id: 1, user_id: 1},
        {id: 2, weapon_id: 2, user_id: 2},
        {id: 3, weapon_id: 3, user_id: 3}
      ]);
    })
    .then(function() {
      return knex.raw(`SELECT setval('weapons_users_id_seq', (SELECT MAX(id) FROM weapons_users))`)
    });
};

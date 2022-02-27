
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: "d74fa0fd-c52a-4cd7-a5ec-e9c42813251b",
          login_id: 'email@gmail.com',
          password: '$2a$10$pkoyd3ZF5f6uSiG9Bpxw/u2qy98A4FB2KWYpETph6MLaL7flB2pOy',
          status: 'active',
          created_at: '2021-04-15 13:20:22.660536',
          updated_at: '2021-04-15 13:20:22.660536'},
      ]);
    });
};

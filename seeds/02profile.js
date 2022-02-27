
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('profile').del()
    .then(function () {
      // Inserts seed entries
      return knex('profile').insert([
        {
          id: "b0e0a9fa-7e5d-4fe4-a960-1bea73a44f12",
          sid: "d74fa0fd-c52a-4cd7-a5ec-e9c42813251b",
          first_name: "Marvelous",
          last_name: "Akporowho",
          other_names: "Ifeakachukwu",
          bio: "A Software Engineer",
          profile_picture: "",
          created_at: '2021-04-15 13:20:22.660536',
          updated_at: '2021-04-15 13:20:22.660536'},
      ]);
    });
};

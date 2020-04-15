
exports.up = function(knex) {
  return knex.schema.createTable('chat', table => {
      table.increments()
      table.string('name').notNullable()
      table.string('message').notNullable()
      table.string('room').notNullable()
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('chat')
};

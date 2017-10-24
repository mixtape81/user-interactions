const { knex } = require('./knex.js');
const db = require('./bookshelf.js');
const queries = require('./queries.js');

module.exports.createTables = () => (
  knex.schema.createTableIfNotExists('event_types', (table) => {
    table.increments('id').primary();
    table.string('type');
    table.timestamps(true, true);
  })
    .createTableIfNotExists('sessions', (table) => {
      table.increments('id');
      table.string('hash');
      table.integer('user_id');
      table.timestamps(true, true);
    })
    .createTableIfNotExists('logs', (table) => {
      table.increments('id').primary();
      table.integer('event_id');
      table.integer('user_id'); // ??
      table.integer('session_id');
      table.foreign('session_id').references('sessions.id');
      table.timestamps(true, true);
    })
    .createTableIfNotExists('playlist_views', (table) => {
      table.increments('id');
      table.integer('playlist_id');
      table.integer('genre_id');
      table.integer('log_id');
      table.foreign('log_id').references('logs.id');
      table.timestamps(true, true);
    })
    .createTableIfNotExists('search', (table) => {
      table.increments('id');
      table.string('value');
      table.integer('log_id');
      table.foreign('log_id').references('logs.id');
      table.timestamps(true, true);
    })
    .createTableIfNotExists('song_reactions', (table) => {
      table.increments('id');
      table.integer('song_id');
      table.boolean('liked').nullable();
      table.integer('playlist_id');
      table.integer('genre_id');
      table.integer('log_id');
      table.foreign('log_id').references('logs.id');
      table.timestamps(true, true);
    })
    .createTableIfNotExists('song_responses', (table) => {
      table.increments('id');
      table.integer('song_id');
      table.integer('playlist_id');
      table.integer('genre_id');
      table.boolean('listenedTo');
      table.integer('log_id');
      table.foreign('log_id').references('logs.id');
      table.timestamps(true, true);
    })
);

module.exports.dropTables = () => (
  knex.schema.dropTableIfExists('event_types')
    .then(() => knex.schema.dropTableIfExists('playlist_views'))
    .then(() => knex.raw('DROP TABLE sessions CASCADE'))
    .then(() => knex.schema.dropTableIfExists('search'))
    .then(() => knex.schema.dropTableIfExists('song_reactions'))
    .then(() => knex.schema.dropTableIfExists('song_responses'))
    .then(() => knex.schema.dropTableIfExists('logs'))
);

module.exports.addData = () => (
  queries.addEvents()
);

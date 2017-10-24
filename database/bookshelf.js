const { bookshelf } = require('./knex.js');

// ********************** MODELS *************************** //

const EventType = bookshelf.Model.extend({
  tableName: 'event_types'
});

const PlaylistView = bookshelf.Model.extend({
  tableName: 'playlist_views'
});

const Session = bookshelf.Model.extend({
  tableName: 'sessions'
});

const Search = bookshelf.Model.extend({
  tableName: 'search'
});

const SongReaction = bookshelf.Model.extend({
  tableName: 'song_reactions'
});

const SongResponse = bookshelf.Model.extend({
  tableName: 'song_responses'
});

const Log = bookshelf.Model.extend({
  tableName: 'logs'
});

// ********************* COLLECTIONS *************************//

// const EventTypes = bookshelf.Collection.extend({
//   model: EventType
// });

// const PlaylistViews = bookshelf.Collection.extend({
//   model: PlaylistView
// });

// const Sessions = bookshelf.Collection.extend({
//   model: Session
// });

// const SearchCollection = bookshelf.Collection.extend({
//   model: Search
// });

// const SongReactions = bookshelf.Collection.extend({
//   model: SongReaction
// });

// const SongResponses = bookshelf.Collection.extend({
//   model: SongResponse
// });

// const Logs = bookshelf.Collection.extend({
//   model: Log
// });

module.exports = {
  EventType,
  Log,
  PlaylistView,
  Session,
  Search,
  SongReaction,
  SongResponse
  // EventTypes,
  // PlaylistViews,
  // Sessions,
  // SearchCollection,
  // SongReactions,
  // SongResponses,
  // Logs
};


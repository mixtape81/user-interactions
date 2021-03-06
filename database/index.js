require('../environment.js');
const Sequelize = require('sequelize');

// console.log('environment in db', env.ENV_PATH);

const config = {
  host: process.env.DB_HOSTNAME,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 90
  }
};


const db = new Sequelize(config);

db.authenticate()
  .then(() => console.log('database connected'))
  .catch(err => console.error('Unable to connect to the database:', err));

const EventType = db.define('event_type', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: Sequelize.STRING
});

const Session = db.define('session', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hash: Sequelize.STRING,
  user_id: Sequelize.INTEGER
});

const Log = db.define('log', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: Sequelize.INTEGER,
  date: Sequelize.DATEONLY,
  createdAt: Sequelize.BIGINT
}, {
  timestamps: false,
  indexes: [{ unique: false, fields: ['eventTypeId', 'sessionId'] }]
});

const PlaylistView = db.define('playlist_view', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  playlist_id: Sequelize.INTEGER,
  genre_id: Sequelize.INTEGER,
  date: Sequelize.DATEONLY,
  createdAt: Sequelize.BIGINT
}, {
  timestamps: false,
  indexes: [{ unique: false, fields: ['playlist_id', 'createdAt'] }]
});

const Search = db.define('search', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  value: Sequelize.STRING,
  date: Sequelize.DATEONLY,
  createdAt: Sequelize.BIGINT
}, {
  timestamps: false,
  indexes: [{ unique: false, fields: ['date', 'createdAt'] }]
});

const SongReaction = db.define('song_reaction', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  song_id: Sequelize.INTEGER,
  liked: Sequelize.BOOLEAN,
  playlist_id: Sequelize.INTEGER,
  genre_id: Sequelize.INTEGER,
  date: Sequelize.DATEONLY,
  createdAt: Sequelize.BIGINT
}, {
  timestamps: false,
  indexes: [{ unique: false, fields: ['date', 'createdAt'] }]
});

const SongResponse = db.define('song_response', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  song_id: Sequelize.INTEGER,
  listenedTo: Sequelize.BOOLEAN,
  playlist_id: Sequelize.INTEGER,
  genre_id: Sequelize.INTEGER,
  date: Sequelize.DATEONLY,
  createdAt: Sequelize.BIGINT
}, {
  timestamps: false,
  indexes: [{ unique: false, fields: ['date', 'createdAt'] }]
});

EventType.hasMany(Log);
Log.belongsTo(EventType);

Session.hasMany(Log);
Log.belongsTo(Session);

Log.hasMany(PlaylistView);
PlaylistView.belongsTo(Log);

Log.hasMany(Search);
Search.belongsTo(Log);

Log.hasMany(SongReaction);
SongReaction.belongsTo(Log);

Log.hasMany(SongResponse);
SongResponse.belongsTo(Log);

EventType.sync()
  .then(() => Session.sync())
  .then(() => Log.sync())
  .then(() => PlaylistView.sync())
  .then(() => Search.sync())
  .then(() => SongReaction.sync())
  .then(() => SongResponse.sync())
  .catch(err => console.log('error syncing schema tables', err));

module.exports = {
  db,
  Sequelize,
  EventType,
  Session,
  Log,
  PlaylistView,
  Search,
  SongReaction,
  SongResponse
};


CREATE TABLE games (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  cover TEXT,
  tags TEXT,
  intro TEXT,
  rating REAL DEFAULT 8.5,
  size TEXT,
  date TEXT,
  language TEXT,
  platform TEXT,
  developer TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE game_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER NOT NULL REFERENCES games(id),
  ver TEXT,
  date TEXT,
  size TEXT
);

CREATE TABLE game_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER NOT NULL REFERENCES games(id),
  type TEXT,
  url TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE carousel_slides (
  id TEXT PRIMARY KEY,
  type TEXT,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  image TEXT,
  action TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT,
  avatar TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER NOT NULL REFERENCES games(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  text TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_games_title ON games(title);
CREATE INDEX idx_game_versions_game_id ON game_versions(game_id);
CREATE INDEX idx_game_media_game_id ON game_media(game_id);
CREATE INDEX idx_comments_game_id ON comments(game_id);

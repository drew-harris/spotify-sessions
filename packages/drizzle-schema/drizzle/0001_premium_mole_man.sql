ALTER TABLE sessions ADD `context_timestamp` timestamp DEFAULT (now()) NOT NULL;
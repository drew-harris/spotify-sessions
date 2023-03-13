CREATE TABLE `sessions` (
	`id` varchar(256) PRIMARY KEY NOT NULL,
	`context_uri` text NOT NULL,
	`user_id` varchar(256),
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`external_url` text NOT NULL,
	`track_id` text NOT NULL,
	`track_uri` text NOT NULL,
	`progress_ms` int NOT NULL,
	`track_name` text NOT NULL,
	`artist_name` text NOT NULL,
	`album_name` text NOT NULL,
	`album_art` text NOT NULL,
	`preview_url` text,
	`track_number` int NOT NULL,
	`item` json
);

CREATE TABLE `users` (
	`id` varchar(256) PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`refresh_token` text NOT NULL,
	`access_token` text NOT NULL,
	`expires_at` timestamp NOT NULL
);

ALTER TABLE sessions ADD CONSTRAINT sessions_user_id_users_id_fk FOREIGN KEY (`user_id`) REFERENCES users(`id`) ;
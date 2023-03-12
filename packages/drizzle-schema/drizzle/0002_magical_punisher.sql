CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`refresh_token` text NOT NULL,
	`access_token` text NOT NULL,
	`expires_at` timestamp NOT NULL
);

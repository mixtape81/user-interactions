// -- ---
// -- Globals
// -- ---

// -- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
// -- SET FOREIGN_KEY_CHECKS=0;

// -- ---
// -- Table 'Playlist Views'
// -- 
// -- ---

// DROP TABLE IF EXISTS `Playlist Views`;
    
// CREATE TABLE `Playlist Views` (
//   `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
//   `playlist_id` INTEGER NULL DEFAULT NULL,
//   `user_id` INTEGER NULL DEFAULT NULL,
//   `genre_id` INTEGER NULL DEFAULT NULL,
//   PRIMARY KEY (`id`)
// );

// -- ---
// -- Table 'Logs'
// -- 
// -- ---

// DROP TABLE IF EXISTS `Logs`;
    
// CREATE TABLE `Logs` (
//   `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
//   `id_Event Types` INTEGER NULL DEFAULT NULL,
//   `id_Session` INTEGER NULL DEFAULT NULL,
//   `interaction_id` INTEGER NULL DEFAULT NULL,
//   `user_id` INTEGER NULL DEFAULT NULL,
//   PRIMARY KEY (`id`)
// );

// -- ---
// -- Table 'Event Types'
// -- 
// -- ---

// DROP TABLE IF EXISTS `Event Types`;
    
// CREATE TABLE `Event Types` (
//   `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
//   `Type` CHAR NULL DEFAULT NULL,
//   PRIMARY KEY (`id`)
// );

// -- ---
// -- Table 'Session'
// -- 
// -- ---

// DROP TABLE IF EXISTS `Session`;
    
// CREATE TABLE `Session` (
//   `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
//   `user_id` INTEGER NULL DEFAULT NULL,
//   `hash` INTEGER NULL DEFAULT NULL,
//   PRIMARY KEY (`id`)
// );

// -- ---
// -- Table 'Search'
// -- 
// -- ---

// DROP TABLE IF EXISTS `Search`;
    
// CREATE TABLE `Search` (
//   `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
//   `value` INTEGER NULL DEFAULT NULL,
//   `user_id` INTEGER NULL DEFAULT NULL,
//   PRIMARY KEY (`id`)
// );

// -- ---
// -- Table 'Song Reactions'
// -- 
// -- ---

// DROP TABLE IF EXISTS `Song Reactions`;
    
// CREATE TABLE `Song Reactions` (
//   `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
//   `liked` VARCHAR NULL DEFAULT NULL,
//   `user_id` INTEGER NULL DEFAULT NULL,
//   `playlist_id` INTEGER NULL DEFAULT NULL,
//   PRIMARY KEY (`id`)
// );

// -- ---
// -- Table 'Song Responses'
// -- 
// -- ---

// DROP TABLE IF EXISTS `Song Responses`;
    
// CREATE TABLE `Song Responses` (
//   `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
//   `song_id` INTEGER NULL DEFAULT NULL,
//   `playlist_id` INTEGER NULL DEFAULT NULL,
//   `user_id` INTEGER NULL DEFAULT NULL,
//   `listenedTo` INTEGER NULL DEFAULT NULL,
//   PRIMARY KEY (`id`)
// );

// -- ---
// -- Foreign Keys 
// -- ---

// ALTER TABLE `Logs` ADD FOREIGN KEY (id_Event Types) REFERENCES `Event Types` (`id`);
// ALTER TABLE `Logs` ADD FOREIGN KEY (id_Session) REFERENCES `Session` (`id`);
// ALTER TABLE `Logs` ADD FOREIGN KEY (interaction_id) REFERENCES `Search` (`id`);
// ALTER TABLE `Logs` ADD FOREIGN KEY (interaction_id) REFERENCES `Playlist Views` (`id`);
// ALTER TABLE `Logs` ADD FOREIGN KEY (interaction_id) REFERENCES `Song Reactions` (`id`);
// ALTER TABLE `Logs` ADD FOREIGN KEY (interaction_id) REFERENCES `Song Responses` (`id`);

// -- ---
// -- Table Properties
// -- ---

// -- ALTER TABLE `Playlist Views` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
// -- ALTER TABLE `Logs` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
// -- ALTER TABLE `Event Types` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
// -- ALTER TABLE `Session` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
// -- ALTER TABLE `Search` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
// -- ALTER TABLE `Song Reactions` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
// -- ALTER TABLE `Song Responses` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

// -- ---
// -- Test Data
// -- ---

// -- INSERT INTO `Playlist Views` (`id`,`playlist_id`,`user_id`,`genre_id`) VALUES
// -- ('','','','');
// -- INSERT INTO `Logs` (`id`,`id_Event Types`,`id_Session`,`interaction_id`,`user_id`) VALUES
// -- ('','','','','');
// -- INSERT INTO `Event Types` (`id`,`Type`) VALUES
// -- ('','');
// -- INSERT INTO `Session` (`id`,`user_id`,`hash`) VALUES
// -- ('','','');
// -- INSERT INTO `Search` (`id`,`value`,`user_id`) VALUES
// -- ('','','');
// -- INSERT INTO `Song Reactions` (`id`,`liked`,`user_id`,`playlist_id`) VALUES
// -- ('','','','');
// -- INSERT INTO `Song Responses` (`id`,`song_id`,`playlist_id`,`user_id`,`listenedTo`) VALUES
// -- ('','','','','');
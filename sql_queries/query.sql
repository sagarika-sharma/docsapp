

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE `docsapp`;
CREATE TABLE `docsapp`.`tb_bookings` (
  `booking_id` bigint(20) NOT NULL,
  `driver_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL,
  `customer_id` bigint(20) DEFAULT NULL,
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `started_datetime` datetime DEFAULT NULL,
  `completed_datetime` datetime DEFAULT NULL,
  `booking_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT ' 1 - arrived,2-progress,3-completed ',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `docsapp`.`tb_bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD UNIQUE KEY `marketplace_id_job_id` (`booking_id`) USING BTREE,
  ADD KEY `customer_id` (`customer_id`) USING BTREE,
  ADD KEY `marketplace_user_order_job_status` (`is_deleted`,`user_id`,`booking_status`) USING BTREE,
  ADD KEY `marketplace_user_id_job_delivery` (`is_deleted`,`user_id`) USING BTREE,
  ADD KEY `marketplace_user_id_creation_datetime` (`is_deleted`) USING BTREE,
  ADD KEY `marketplace_user_id_2` (`is_deleted`,`customer_id`) USING BTREE,
  ADD KEY `marketplace_id_job_status` (`is_deleted`,`booking_status`) USING BTREE;


ALTER TABLE `docsapp`.`tb_bookings`
  MODIFY `booking_id` bigint(20) NOT NULL AUTO_INCREMENT;
COMMIT;


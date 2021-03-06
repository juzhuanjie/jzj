-- MySQL Script generated by MySQL Workbench
-- Sun Dec 21 23:21:10 2014
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`t_user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_user` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_user` (
  `user_id` INT NOT NULL,
  `user_type_id` INT NULL COMMENT 'seller\nbuyer\nstored in lookup table\n',
  `user_login` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  `pay_password` VARCHAR(45) NULL COMMENT 'password for payment',
  `mobile` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `qq` VARCHAR(45) NULL,
  `wechat` VARCHAR(45) NULL,
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
COMMENT = 'stores user general info';


-- -----------------------------------------------------
-- Table `mydb`.`t_seller_shop`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_seller_shop` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_seller_shop` (
  `shop_id` INT NOT NULL,
  `platform_id` INT NULL,
  `user_id` INT NULL,
  `url` VARCHAR(2000) NULL,
  `wangwang` VARCHAR(45) NULL,
  `province` VARCHAR(45) NULL,
  `city` VARCHAR(45) NULL,
  `street` VARCHAR(500) NULL,
  `postcode` VARCHAR(45) NULL,
  `comment` VARCHAR(2000) NULL,
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`shop_id`))
ENGINE = InnoDB
COMMENT = 'user/seller’s shops on other platforms. user/buyer does not have shop, they have account stored in t_buyer_account';


-- -----------------------------------------------------
-- Table `mydb`.`t_platform`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_platform` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_platform` (
  `platform_id` INT NOT NULL,
  `platform_name` VARCHAR(45) NULL,
  `platform_url` VARCHAR(500) NULL,
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`platform_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`t_recharge`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_recharge` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_recharge` (
  `recharge_id` INT NOT NULL,
  `amount` BIGINT(8) NULL,
  `points` BIGINT(8) NULL,
  `recharge_time` DATETIME NULL,
  `recharge_type_id` INT NULL COMMENT '押金\n买点\nlookup table',
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`recharge_id`))
ENGINE = InnoDB
COMMENT = 'buy points';


-- -----------------------------------------------------
-- Table `mydb`.`t_user_membership`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_user_membership` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_user_membership` (
  `user_member_id` INT NOT NULL,
  `user_id` INT NULL,
  `membership_type` VARCHAR(45) NULL,
  `cash` BIGINT(8) NULL,
  `points` BIGINT(8) NULL,
  `start_date` DATETIME NULL,
  `end_date` DATETIME NULL,
  `comment` VARCHAR(2000) NULL,
  `status` VARCHAR(45) NULL,
  `create_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`user_member_id`))
ENGINE = InnoDB
COMMENT = 'user membership purchase records';


-- -----------------------------------------------------
-- Table `mydb`.`t_user_bank`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_user_bank` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_user_bank` (
  `user_bank_id` INT NOT NULL,
  `user_id` INT NULL,
  `bank_type` VARCHAR(45) NULL COMMENT '支付宝\n财付通\n银行',
  `account_name` VARCHAR(45) NULL,
  `account_number` VARCHAR(45) NULL,
  `branch` VARCHAR(45) NULL,
  `city` VARCHAR(45) NULL,
  `comment` VARCHAR(2000) NULL,
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`user_bank_id`))
ENGINE = InnoDB
COMMENT = 'user bank account info';


-- -----------------------------------------------------
-- Table `mydb`.`t_cashout`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_cashout` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_cashout` (
  `cashout_id` INT NOT NULL,
  `amount` BIGINT(8) NULL,
  `points` BIGINT(8) NULL,
  `fee` BIGINT(8) NULL,
  `cashout_time` DATETIME NULL,
  `status` INT NULL COMMENT 'request\napproved\ndenied\ndone\n',
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`cashout_id`))
ENGINE = InnoDB
COMMENT = 'record cash out activities';


-- -----------------------------------------------------
-- Table `mydb`.`t_points_transaction`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_points_transaction` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_points_transaction` (
  `points_tran_id` INT NOT NULL,
  `amount` BIGINT(8) NULL,
  `type_id` INT NULL COMMENT 't_lookup',
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  PRIMARY KEY (`points_tran_id`))
ENGINE = InnoDB
COMMENT = 'records transactions on points';


-- -----------------------------------------------------
-- Table `mydb`.`t_user_balance`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_user_balance` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_user_balance` (
  `balance_id` INT NOT NULL,
  `user_id` INT NULL,
  `points` BIGINT(8) NULL,
  `cash` BIGINT(8) NULL,
  `cash_frozen` BIGINT(8) NULL,
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`balance_id`))
ENGINE = InnoDB
COMMENT = 'user account balance';


-- -----------------------------------------------------
-- Table `mydb`.`t_activity`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_activity` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_activity` (
  `activity_id` INT NOT NULL,
  `type_id` INT NULL,
  `title` VARCHAR(200) NULL,
  `desc` VARCHAR(1000) NULL,
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  PRIMARY KEY (`activity_id`))
ENGINE = InnoDB
COMMENT = 'log all kinds of activities';


-- -----------------------------------------------------
-- Table `mydb`.`t_shop_task`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_shop_task` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_shop_task` (
  `task_id` INT NOT NULL,
  `shop_id` INT NULL,
  `product_id` INT NULL COMMENT '数量\n',
  `product_price` BIGINT(8) NULL COMMENT 'price can be different when publish tasks at different times\n',
  `commission` BIGINT(8) NULL,
  `bonus` BIGINT(8) NULL COMMENT 'seller pay extra for performing the task',
  `total_tasks` INT NULL,
  `terminal` VARCHAR(45) NULL COMMENT '手机\nPC\n',
  `task_type_id` INT NULL COMMENT '直通车\n聚划算\nt_task_type',
  `pay_by_id` INT NULL COMMENT '商家\n平台\nstored in lookup table',
  `status` VARCHAR(45) NULL,
  `comment` VARCHAR(45) NULL,
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`task_id`))
ENGINE = InnoDB
COMMENT = 'published tasks';


-- -----------------------------------------------------
-- Table `mydb`.`t_task_buyer`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_task_buyer` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_task_buyer` (
  `task_buyer_id` INT NOT NULL,
  `user_id` INT NULL,
  `task_id` INT NULL,
  `status_id` INT NULL COMMENT 'stored in look up table',
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`task_buyer_id`))
ENGINE = InnoDB
COMMENT = 'tasks owned by a user/buyer';


-- -----------------------------------------------------
-- Table `mydb`.`t_task_buyer_activity`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_task_buyer_activity` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_task_buyer_activity` (
  `tb_activity_id` INT NOT NULL,
  `task_buyer_id` INT NULL,
  `status_id` INT NULL,
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  PRIMARY KEY (`tb_activity_id`))
ENGINE = InnoDB
COMMENT = 'buyer’s activity on a task';


-- -----------------------------------------------------
-- Table `mydb`.`t_featured_task`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_featured_task` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_featured_task` (
  `featured_id` INT NOT NULL,
  `task_id` INT NULL,
  `type_id` INT NULL COMMENT 'type stored in t_lookup',
  `start_time` DATETIME NULL,
  `end_time` DATETIME NULL,
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`featured_id`))
ENGINE = InnoDB
COMMENT = 'mark featured tasks';


-- -----------------------------------------------------
-- Table `mydb`.`t_task_status_history`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_task_status_history` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_task_status_history` (
  `task_status_history_id` INT NOT NULL,
  `status_id` INT NULL,
  `create_time` DATETIME NULL,
  `create_by` VARCHAR(45) NULL,
  PRIMARY KEY (`task_status_history_id`))
ENGINE = InnoDB
COMMENT = 'task status history';


-- -----------------------------------------------------
-- Table `mydb`.`t_post`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_post` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_post` (
  `post_id` INT NOT NULL,
  `post_type` VARCHAR(45) NULL COMMENT '公告\n问题\n',
  `title` VARCHAR(45) NULL,
  `content` BLOB NULL,
  `status_id` INT NULL,
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`post_id`))
ENGINE = InnoDB
COMMENT = 'our official posts';


-- -----------------------------------------------------
-- Table `mydb`.`t_shop_product`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_shop_product` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_shop_product` (
  `product_id` INT NOT NULL,
  `shop_id` INT NULL,
  `product_price` BIGINT(8) NULL COMMENT '数量\n',
  `product_name` VARCHAR(255) NULL,
  `product_desc` VARCHAR(2000) NULL,
  `product_image` VARCHAR(500) NULL,
  `status_id` INT NULL,
  `comment` VARCHAR(2000) NULL,
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`product_id`))
ENGINE = InnoDB
COMMENT = 'product list for tasks';


-- -----------------------------------------------------
-- Table `mydb`.`t_buyer_account`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_buyer_account` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_buyer_account` (
  `buyer_account_id` INT NOT NULL,
  `user_id` INT NULL,
  `account_login` VARCHAR(45) NULL COMMENT 'account login on the other platform',
  `platform_id` VARCHAR(45) NULL,
  `address_id` INT NULL COMMENT 'addresses are stored in t_user_address table',
  `wangwang` VARCHAR(45) NULL COMMENT '旺旺',
  `ww_screenshot` VARCHAR(255) NULL COMMENT '旺旺截图',
  `status_id` INT NULL COMMENT 'status store in t_lookup',
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`buyer_account_id`))
ENGINE = InnoDB
COMMENT = 'this is for storing buyer/user’s shops/accounts on different platforms';


-- -----------------------------------------------------
-- Table `mydb`.`t_user_address`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_user_address` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_user_address` (
  `address_id` INT NOT NULL,
  `user_id` INT NULL,
  `address_type_id` INT NULL COMMENT 'lookup table',
  `recipient` VARCHAR(45) NULL,
  `province` VARCHAR(45) NULL,
  `city` VARCHAR(45) NULL,
  `district` VARCHAR(45) NULL,
  `street_address` VARCHAR(45) NULL,
  `postal_code` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`address_id`))
ENGINE = InnoDB
COMMENT = 'user’s addresses for lookup and reuse';


-- -----------------------------------------------------
-- Table `mydb`.`t_post_published`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_post_published` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_post_published` (
  `post_status_id` INT NOT NULL,
  `post_id` INT NULL,
  `start_time` DATETIME NULL,
  `end_time` DATETIME NULL,
  `display_order` INT NULL COMMENT 'a number determines the display order',
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`post_status_id`))
ENGINE = InnoDB
COMMENT = 'this table determines whether a post is shown';


-- -----------------------------------------------------
-- Table `mydb`.`t_lookup`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_lookup` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_lookup` (
  `lookup_id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `value` INT NULL,
  `type` VARCHAR(45) NULL COMMENT 'cashout_status\nbuyer_account_status\nfeatured_type\n… table name + col name\n',
  `created_time` VARCHAR(45) NULL,
  `created_by` VARCHAR(45) NULL,
  PRIMARY KEY (`lookup_id`))
ENGINE = InnoDB
COMMENT = 'stores all the look up values';


-- -----------------------------------------------------
-- Table `mydb`.`t_task_types`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`t_task_types` ;

CREATE TABLE IF NOT EXISTS `mydb`.`t_task_types` (
  `task_type_id` INT NOT NULL,
  `type_name` VARCHAR(45) NULL,
  `platform_id` INT NULL,
  `commission` BIGINT(8) NULL COMMENT 'different type of tasks have different commissions',
  `created_time` DATETIME NULL,
  `created_by` VARCHAR(45) NULL,
  `lastupdated_time` DATETIME NULL,
  `lastupdated_by` VARCHAR(45) NULL,
  PRIMARY KEY (`task_type_id`))
ENGINE = InnoDB
COMMENT = 'different types of tasks';


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

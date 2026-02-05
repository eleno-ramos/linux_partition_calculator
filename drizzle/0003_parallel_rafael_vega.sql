CREATE TABLE `adminAuth` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` text NOT NULL,
	`lastPasswordChange` timestamp NOT NULL DEFAULT (now()),
	`passwordResetToken` varchar(255),
	`passwordResetExpires` timestamp,
	`googleId` varchar(255),
	`twoFactorEnabled` int NOT NULL DEFAULT 0,
	`twoFactorSecret` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adminAuth_id` PRIMARY KEY(`id`),
	CONSTRAINT `adminAuth_email_unique` UNIQUE(`email`),
	CONSTRAINT `adminAuth_googleId_unique` UNIQUE(`googleId`)
);

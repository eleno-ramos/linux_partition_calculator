CREATE TABLE `auditLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`action` varchar(50) NOT NULL,
	`targetUserId` int,
	`targetUserName` varchar(255),
	`targetUserEmail` varchar(320),
	`oldRole` enum('user','admin'),
	`newRole` enum('user','admin'),
	`reason` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`status` enum('success','failed') NOT NULL DEFAULT 'success',
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLog_id` PRIMARY KEY(`id`)
);

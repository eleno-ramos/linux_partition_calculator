CREATE TABLE `analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`totalVisitors` int NOT NULL DEFAULT 0,
	`totalShares` int NOT NULL DEFAULT 0,
	`totalReviews` int NOT NULL DEFAULT 0,
	`averageRating` varchar(10),
	`topCountries` text,
	`topContinents` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `savedConfigurations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`diskSize` int NOT NULL,
	`ramSize` int NOT NULL,
	`distro` varchar(50) NOT NULL,
	`processor` varchar(50) NOT NULL,
	`firmware` varchar(20) NOT NULL,
	`diskType` varchar(10) NOT NULL,
	`hibernation` int NOT NULL DEFAULT 0,
	`useLVM` int NOT NULL DEFAULT 0,
	`systemPercentage` int NOT NULL DEFAULT 20,
	`includeHome` int NOT NULL DEFAULT 1,
	`username` varchar(255),
	`wifiSSID` varchar(255),
	`wifiPassword` varchar(255),
	`hostname` varchar(255),
	`timezone` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `savedConfigurations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(100) NOT NULL,
	`platform` varchar(50) NOT NULL,
	`sharedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shares_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visitors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ipAddress` varchar(45) NOT NULL,
	`country` varchar(100),
	`continent` varchar(100),
	`countryCode` varchar(2),
	`latitude` varchar(20),
	`longitude` varchar(20),
	`userAgent` text,
	`visitedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visitors_id` PRIMARY KEY(`id`)
);

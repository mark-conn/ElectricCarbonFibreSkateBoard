CREATE TABLE `trips` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`startTime` DATETIME NOT NULL,
`endTime` DATETIME NOT NULL,
`startPoint` VARCHAR(255),
`endPoint` VARCHAR(255),
`averageSpeed` VARCHAR(30),
`powerUsage` VARCHAR(30),
`distance` VARCHAR(30),
PRIMARY KEY (`id`)
)
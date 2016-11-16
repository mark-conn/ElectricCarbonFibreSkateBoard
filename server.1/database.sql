CREATE TABLE `trips` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`startTime` DATETIME NOT NULL,
`endTime` DATETIME NOT NULL,
`startPoint` VARCHAR(255),
`endPoint` VARCHAR(255),
`averageSpeed` DECIMAL(5,2),
`powerUsage` INT(11),
`distance` DECIMAL(5,2),
PRIMARY KEY (`id`)
)

CREATE TABLE `tripSpeeds` (
`id` int(11) NOT NULL AUTO_INCREMENT,
FOREIGN KEY (`tripId`) REFERENCES `trips`(`id`) ON DELETE SET NULL,
`speed` DECIMAL(5,2),
`time` DATETIME
PRIMARY KEY (`id`)
)


PUT FAKE DATA
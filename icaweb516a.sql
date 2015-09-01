-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 05, 2014 at 03:06 AM
-- Server version: 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `icaweb516a`
--

-- --------------------------------------------------------

--
-- Table structure for table `icaweb516a_address`
--

CREATE TABLE IF NOT EXISTS `icaweb516a_address` (
  `idAddress` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `unit` varchar(4) DEFAULT NULL,
  `streetNumber` varchar(5) DEFAULT NULL,
  `streetName` varchar(32) DEFAULT NULL,
  `suburb` varchar(32) DEFAULT NULL,
  `country` varchar(32) DEFAULT NULL,
  `postcode` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`idAddress`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `icaweb516a_cars`
--

CREATE TABLE IF NOT EXISTS `icaweb516a_cars` (
  `idCar` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `modelID` int(10) NOT NULL,
  `photoID` int(10) DEFAULT NULL,
  `year` char(4) NOT NULL,
  `price` double DEFAULT NULL,
  `engineSize` int(10) DEFAULT NULL,
  `kilometres` varchar(10) DEFAULT NULL,
  `transmission` varchar(20) DEFAULT NULL,
  `fuelType` varchar(20) DEFAULT NULL,
  `driveType` varchar(20) DEFAULT NULL,
  `cylinders` int(2) DEFAULT NULL,
  `powerkW` varchar(10) DEFAULT NULL,
  `towingBrakedKg` varchar(10) DEFAULT NULL,
  `inductionTurbo` varchar(32) DEFAULT NULL,
  `bodyType` varchar(20) DEFAULT NULL,
  `seats` int(2) DEFAULT NULL,
  `interiorColour` varchar(20) DEFAULT NULL,
  `exteriorColour` varchar(20) DEFAULT NULL,
  `doors` int(1) DEFAULT NULL,
  `isNewCar` tinyint(1) DEFAULT NULL COMMENT 'new = true, used = false',
  `rego` varchar(10) DEFAULT NULL,
  `vin` varchar(17) DEFAULT NULL,
  `purchaseStatus` int(1) DEFAULT NULL COMMENT '0:available; 1:deposit placed; 2: sold',
  PRIMARY KEY (`idCar`),
  UNIQUE KEY `vin` (`vin`),
  UNIQUE KEY `rego` (`rego`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=39 ;

--
-- Dumping data for table `icaweb516a_cars`
--

INSERT INTO `icaweb516a_cars` (`idCar`, `modelID`, `photoID`, `year`, `price`, `engineSize`, `kilometres`, `transmission`, `fuelType`, `driveType`, `cylinders`, `powerkW`, `towingBrakedKg`, `inductionTurbo`, `bodyType`, `seats`, `interiorColour`, `exteriorColour`, `doors`, `isNewCar`, `rego`, `vin`, `purchaseStatus`) VALUES
(1, 8, 63, '1996', 25000, 777, '', 'Manual', 'Unleaded', '4x4', 0, '', NULL, NULL, 'Cab Chassis', 0, '', '', 2, 0, 'ULM953', '12345678901234567', 0),
(10, 6, 66, '3000', 3000, 0, '', 'Automatic', 'Premium', '4x4 Constant', 6, '', NULL, NULL, 'Cab Chassis', 0, '', '', 3, 0, 'ULM888', '33345678901234567', 0),
(11, 2, 67, '2000', 10000, 700, '', 'Manual', 'Unleaded', '4x4', 6, '', NULL, NULL, 'Cab Chassis', 0, 'Blue', '', 2, 0, 'ABC111', '11145678901234567', 0),
(12, 1, 69, '3000', 20000, 0, '10', 'Manual', 'Unleaded', '4x4', 0, '3000', NULL, NULL, 'Convertible', 0, 'Blue', 'Red', 2, 0, 'ABC123', '11115678901234567', 0),
(13, 6, 72, '1000', 200000, 0, '', 'Manual', 'Unleaded', '4x4', 0, '', NULL, NULL, 'Cab Chassis', 0, '', '', 2, 0, 'QWE123', '99945678901234567', 0),
(19, 1, 81, '1990', 30000, 0, '', 'Manual', 'Unleaded', '4x4', 0, '', NULL, NULL, 'Cab Chassis', 0, '', '', 2, 0, 'ASD111', '11234567890123456', 0),
(20, 1, 75, '2000', 10000, 0, '', 'Manual', 'Unleaded', '4x4', 0, '', NULL, NULL, 'Cab Chassis', 0, '', '', 2, 0, 'QAZ128', '11122278901234567', 0),
(22, 1, 76, '2000', 10000, 0, '', 'Manual', 'Unleaded', '4x4', 0, '', NULL, NULL, 'Cab Chassis', 0, '', '', 2, 0, 'QAZ129', '11122278901234566', 0),
(23, 1, 77, '1990', 30000, 0, '', 'Manual', 'Unleaded', '4x4', 0, '', NULL, NULL, 'Cab Chassis', 0, '', '', 2, 0, 'QAZ-234', '11122278901234559', 0),
(24, 1, 80, '2009', 19029, 0, '', 'Manual', 'Unleaded', '4x4', 0, '', NULL, NULL, 'Cab Chassis', 0, '', '', 2, 0, 'QAZ-123', '11223378901234567', 0),
(31, 10, 83, '1990', 20, 0, '', 'Manual', 'Unleaded', '4x4', 0, '', NULL, NULL, 'Cab Chassis', 0, '', '', 2, 0, 'AQW-563', '99945678901234568', 0),
(36, 12, 85, '1990', 20, 0, '', 'Manual', 'Unleaded', '4x4', 0, '', NULL, NULL, 'Cab Chassis', 0, '', '', 2, 0, 'AQW-562', '99945678901234566', 0);

-- --------------------------------------------------------

--
-- Table structure for table `icaweb516a_car_make`
--

CREATE TABLE IF NOT EXISTS `icaweb516a_car_make` (
  `idCarMake` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`idCarMake`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `icaweb516a_car_make`
--

INSERT INTO `icaweb516a_car_make` (`idCarMake`, `name`) VALUES
(12, 'Ferrari'),
(4, 'Honda'),
(7, 'Mazda'),
(5, 'Nissan'),
(11, 'Porche'),
(6, 'Subaru'),
(10, 'Suzuki'),
(8, 'Toyota'),
(9, 'Volvo');

-- --------------------------------------------------------

--
-- Table structure for table `icaweb516a_car_model`
--

CREATE TABLE IF NOT EXISTS `icaweb516a_car_model` (
  `idCarModel` int(10) NOT NULL AUTO_INCREMENT,
  `carMakeID` int(10) NOT NULL,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`idCarModel`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `icaweb516a_car_model`
--

INSERT INTO `icaweb516a_car_model` (`idCarModel`, `carMakeID`, `name`) VALUES
(1, 4, 'Accord'),
(2, 4, 'Civic'),
(3, 5, 'Pulsar'),
(5, 6, 'Liberty'),
(6, 7, 'Mazda 6'),
(7, 7, 'CX-5'),
(8, 8, 'Corolla'),
(10, 4, 'Prelude'),
(11, 11, 'ddddd'),
(12, 12, 'F40');

-- --------------------------------------------------------

--
-- Table structure for table `icaweb516a_enquiries`
--

CREATE TABLE IF NOT EXISTS `icaweb516a_enquiries` (
  `idEnquiry` int(10) NOT NULL AUTO_INCREMENT,
  `userID` int(10) NOT NULL,
  `dateLodged` datetime NOT NULL,
  `rego` varchar(10) NOT NULL,
  `enquiry` varchar(512) NOT NULL,
  `status` int(2) NOT NULL,
  PRIMARY KEY (`idEnquiry`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;

--
-- Dumping data for table `icaweb516a_enquiries`
--

INSERT INTO `icaweb516a_enquiries` (`idEnquiry`, `userID`, `dateLodged`, `rego`, `enquiry`, `status`) VALUES
(2, 5, '2014-12-03 15:05:27', '', '', 1),
(3, 5, '2014-12-03 15:28:54', '', 'test2', 1),
(5, 9, '2014-12-04 20:53:48', 'ULM953', 'I like this car... Can I have it???', 0),
(6, 9, '2014-12-04 20:54:37', 'QAZ-234', 'I also like this car.... I\\''ll take this one as well...', 0),
(7, 9, '2014-12-04 20:56:08', 'QAZ-234', 'You know what, I\\''ll have at least two of these thanks... At least one for the Mrs as well.... :-)', 0),
(8, 9, '2014-12-04 20:57:30', 'QAZ-234', 'On second thoughts, give me at least a dozen... Brand new with all the bells and whistles... Was thinking of having a rally racing weekend with my mates and I think these cars go great...', 0),
(9, 9, '2014-12-04 20:58:55', 'QAZ-234', 'Oh, I don\\''t think you have my number... It\\''s 0415 583 569. Trying to keep this a surprise.... :-) That other number you have on file is not private....', 0),
(10, 9, '2014-12-04 20:59:18', 'QAZ-234', 'That number again is 0415 583 569', 0),
(11, 9, '2014-12-04 21:00:54', 'QWE123', 'Can I have a few of these cars too please...', 0),
(12, 9, '2014-12-04 21:01:07', 'QWE123', 'They\\''re good for the showroom....', 0),
(13, 9, '2014-12-04 21:02:55', 'QWE123', 'Could I have them clean and sparkling new when I get them?? I like them new or close to brand new if possible. They all has to be in good working condition with everything there...', 0),
(14, 9, '2014-12-04 21:05:06', 'QWE123', 'Sorry about my grammar in the last enquiry. I meant have rather than has. Silly me. We\\''re definitely having more than one car....  This enquiry system is like an email isn\\''t it... I ask for what I like and it get\\''s delivered to me...okay...only the good stuff...', 2),
(15, 9, '2014-12-04 21:08:42', 'QWE123', 'Will keep this one short. I like all those cars please. Those photos are not of the same car are they. I like to have my own copy of all those cars please. Not like that particular itself in the picture but my own car like the one in the picture and better... okay????', 0),
(16, 9, '2014-12-04 21:09:08', 'QWE123', 'Hey are you listening to me??? I said I would like to have that car please????', 0),
(17, 9, '2014-12-04 21:09:35', 'QWE123', 'Sorry, I meant those cars... plural...', 0),
(18, 9, '2014-12-05 11:27:35', '', 'this is a test page....', 0),
(19, 9, '2014-12-05 12:00:17', 'ABC-111', 'I like that car....', 1);

-- --------------------------------------------------------

--
-- Table structure for table `icaweb516a_orders`
--

CREATE TABLE IF NOT EXISTS `icaweb516a_orders` (
  `idOrder` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `carID` int(11) NOT NULL,
  `datetimeOrdered` datetime NOT NULL,
  PRIMARY KEY (`idOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `icaweb516a_photos`
--

CREATE TABLE IF NOT EXISTS `icaweb516a_photos` (
  `idPhoto` int(10) NOT NULL AUTO_INCREMENT,
  `carID` int(10) NOT NULL,
  `name` varchar(64) NOT NULL,
  PRIMARY KEY (`idPhoto`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=86 ;

--
-- Dumping data for table `icaweb516a_photos`
--

INSERT INTO `icaweb516a_photos` (`idPhoto`, `carID`, `name`) VALUES
(63, 1, '1_1417511234.jpg'),
(64, 1, '1_1417511259.jpeg'),
(65, 10, '10_1417511329.jpg'),
(66, 10, '10_1417511381.jpg'),
(67, 11, '11_1417511406.jpg'),
(68, 12, '12_1417511432.jpg'),
(69, 12, '12_1417511462.jpg'),
(70, 13, '13_1417511498.jpg'),
(71, 13, '13_1417511536.jpg'),
(72, 13, '13_1417511586.jpg'),
(73, 19, '19_1417519342.jpg'),
(74, 20, '20_1417519381.jpg'),
(75, 20, '20_1417519423.jpg'),
(76, 22, '22_1417519526.jpg'),
(77, 23, '23_1417519560.jpg'),
(78, 24, '24_1417519596.jpg'),
(79, 24, '24_1417519632.jpg'),
(80, 24, '24_1417519670.jpg'),
(81, 19, '19_1417741058.jpg'),
(82, 31, '31_1417742154.jpg'),
(83, 31, '31_1417742185.jpg'),
(84, 36, '36_1417742218.jpg'),
(85, 36, '36_1417742251.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `icaweb516a_suppliers`
--

CREATE TABLE IF NOT EXISTS `icaweb516a_suppliers` (
  `idSupplier` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `supplierName` varchar(64) NOT NULL,
  `abn` varchar(11) DEFAULT NULL,
  `email` varchar(256) DEFAULT NULL,
  `addressID` int(11) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `mobile` varchar(10) DEFAULT NULL,
  `fax` varchar(10) DEFAULT NULL,
  `contactName` varchar(64) DEFAULT NULL,
  `note` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`idSupplier`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `icaweb516a_users`
--

CREATE TABLE IF NOT EXISTS `icaweb516a_users` (
  `idUser` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userType` int(10) unsigned NOT NULL DEFAULT '0',
  `firstname` varchar(20) DEFAULT NULL,
  `lastname` varchar(20) DEFAULT NULL,
  `email` varchar(256) NOT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `phone2` varchar(10) DEFAULT NULL,
  `addressRegisteredID` int(11) unsigned DEFAULT NULL,
  `addressShippingID` int(11) unsigned DEFAULT NULL,
  `password` char(64) NOT NULL,
  `isLoggedIn` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=26 ;

--
-- Dumping data for table `icaweb516a_users`
--

INSERT INTO `icaweb516a_users` (`idUser`, `userType`, `firstname`, `lastname`, `email`, `phone`, `phone2`, `addressRegisteredID`, `addressShippingID`, `password`, `isLoggedIn`) VALUES
(1, 9, 'Clinton', 'Fong', 'info@clintonfong.com', '0415583569', NULL, NULL, NULL, '7c5c97d7f5975f0619edacb9a115c809bd25a245c91738012e14e6c0f5856914', 0),
(3, 9, 'Manager', 'Boss', 'manager@localhost', '0415583569', NULL, NULL, NULL, '874d72a526ddc08bd967495b1787d5f4fc26ffbdbc47da46df03bea8d73325c7', 0),
(4, 5, 'Staff - promoted??', 'Worker2', 'staff@localhost', '0415583569', NULL, NULL, NULL, '874d72a526ddc08bd967495b1787d5f4fc26ffbdbc47da46df03bea8d73325c7', 0),
(5, 0, 'Customerxxx', 'The lamb update', 'lamb1@localhost', '0415583569', NULL, NULL, NULL, '874d72a526ddc08bd967495b1787d5f4fc26ffbdbc47da46df03bea8d73325c7', 1),
(6, 0, 'Customer2', 'The lamb', 'lamb2@localhost', '0415583569', NULL, NULL, NULL, '874d72a526ddc08bd967495b1787d5f4fc26ffbdbc47da46df03bea8d73325c7', 1),
(9, 0, 'Customer5', 'Target', 'customer1@localhost', '0415583569', NULL, NULL, NULL, '874d72a526ddc08bd967495b1787d5f4fc26ffbdbc47da46df03bea8d73325c7', 0),
(10, 0, 'Customer6', 'Target', 'customer2@localhost', '0415583569', NULL, NULL, NULL, '874d72a526ddc08bd967495b1787d5f4fc26ffbdbc47da46df03bea8d73325c7', 1),
(13, 9, 'Manager1 - promoted', 'Boss??', 'boss1@boss.com', '0415583569', NULL, NULL, NULL, '874d72a526ddc08bd967495b1787d5f4fc26ffbdbc47da46df03bea8d73325c7', 1),
(14, 9, 'Manager2', 'Bossman', 'bossman1@bossman.com', '0415583569', NULL, NULL, NULL, '874d72a526ddc08bd967495b1787d5f4fc26ffbdbc47da46df03bea8d73325c7', 0),
(17, 5, 'Manager3', 'Bossman2', 'bossman2@bossman.com', '0415583569', NULL, NULL, NULL, '874d72a526ddc08bd967495b1787d5f4fc26ffbdbc47da46df03bea8d73325c7', 1),
(19, 9, 'Manager3', 'Bossman3', 'bossman3@bossman.com.au', '0415583569', NULL, NULL, NULL, '874d72a526ddc08bd967495b1787d5f4fc26ffbdbc47da46df03bea8d73325c7', 1),
(21, 5, 'Manageroops', 'Bossman4', 'staff@staff.com', '0415583569', NULL, NULL, NULL, '874d72a526ddc08bd967495b1787d5f4fc26ffbdbc47da46df03bea8d73325c7', 0),
(23, 5, 'Staff10', 'Workerbee', 'workerbee@beehive.com', '0415583569', NULL, NULL, NULL, '874d72a526ddc08bd967495b1787d5f4fc26ffbdbc47da46df03bea8d73325c7', 0),
(24, 5, 'Staff10', 'Workerbee2', 'workerbee2@beehive.com.au', '0415583569', NULL, NULL, NULL, '874d72a526ddc08bd967495b1787d5f4fc26ffbdbc47da46df03bea8d73325c7', 1),
(25, 5, 'Staff11', 'Workerbee3', 'workerbee3@beehive.com.au', '0415583569', NULL, NULL, NULL, '874d72a526ddc08bd967495b1787d5f4fc26ffbdbc47da46df03bea8d73325c7', 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

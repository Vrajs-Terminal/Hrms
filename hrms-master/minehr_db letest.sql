-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 27, 2026 at 07:29 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `minehr_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `Branch`
--

CREATE TABLE `Branch` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'Metro',
  `order_index` int(11) NOT NULL DEFAULT 0,
  `zone_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Branch`
--

INSERT INTO `Branch` (`id`, `name`, `code`, `type`, `order_index`, `zone_id`) VALUES
(4, 'TEST BRANCH', 'TB-01', 'Metro', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Company`
--

CREATE TABLE `Company` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `website` varchar(191) DEFAULT NULL,
  `logo_url` varchar(191) DEFAULT NULL,
  `tax_info` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Company`
--

INSERT INTO `Company` (`id`, `name`, `website`, `logo_url`, `tax_info`) VALUES
(1, 'New Company', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Department`
--

CREATE TABLE `Department` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Department`
--

INSERT INTO `Department` (`id`, `name`, `branch_id`, `order_index`) VALUES
(4, 'Engineering', 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Designation`
--

CREATE TABLE `Designation` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `sub_department_id` int(11) NOT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Designation`
--

INSERT INTO `Designation` (`id`, `name`, `sub_department_id`, `order_index`) VALUES
(1, 'Senior Editor', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `SubDepartment`
--

CREATE TABLE `SubDepartment` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `department_id` int(11) NOT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `SubDepartment`
--

INSERT INTO `SubDepartment` (`id`, `name`, `department_id`, `order_index`) VALUES
(1, 'Engineering Team Alpha', 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'Admin',
  `branch_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id`, `name`, `email`, `password_hash`, `role`, `branch_id`, `department_id`, `createdAt`, `updatedAt`) VALUES
(1, 'System Admin', 'admin@minehr.com', '$2b$10$OLU3UctHX.bdYKS1CFlQs..pHH2vxoUWtRecMg3KMcnbR61.DHU1u', 'Admin', NULL, NULL, '2026-02-25 14:41:20.292', '2026-02-25 14:41:20.292'),
(2, 'Vraj Amin', 'vraj@minehr.com', '$2b$10$E6tYJJLFspcd4nzZNHZZHuftcipUotHmAB9q7Fc7iA4h/kbV1zcQC', 'Admin', NULL, NULL, '2026-02-25 14:54:09.544', '2026-02-25 14:54:09.544');

-- --------------------------------------------------------

--
-- Table structure for table `Zone`
--

CREATE TABLE `Zone` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Zone`
--

INSERT INTO `Zone` (`id`, `name`, `order_index`) VALUES
(1, 'North Zone', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Branch`
--
ALTER TABLE `Branch`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Branch_code_key` (`code`),
  ADD KEY `Branch_zone_id_fkey` (`zone_id`);

--
-- Indexes for table `Company`
--
ALTER TABLE `Company`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Department`
--
ALTER TABLE `Department`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Department_branch_id_fkey` (`branch_id`);

--
-- Indexes for table `Designation`
--
ALTER TABLE `Designation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Designation_name_sub_department_id_key` (`name`,`sub_department_id`),
  ADD KEY `Designation_sub_department_id_fkey` (`sub_department_id`);

--
-- Indexes for table `SubDepartment`
--
ALTER TABLE `SubDepartment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `SubDepartment_name_department_id_key` (`name`,`department_id`),
  ADD KEY `SubDepartment_department_id_fkey` (`department_id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD KEY `User_branch_id_fkey` (`branch_id`),
  ADD KEY `User_department_id_fkey` (`department_id`);

--
-- Indexes for table `Zone`
--
ALTER TABLE `Zone`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Zone_name_key` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Branch`
--
ALTER TABLE `Branch`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Company`
--
ALTER TABLE `Company`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Department`
--
ALTER TABLE `Department`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Designation`
--
ALTER TABLE `Designation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `SubDepartment`
--
ALTER TABLE `SubDepartment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Zone`
--
ALTER TABLE `Zone`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Branch`
--
ALTER TABLE `Branch`
  ADD CONSTRAINT `Branch_zone_id_fkey` FOREIGN KEY (`zone_id`) REFERENCES `Zone` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Department`
--
ALTER TABLE `Department`
  ADD CONSTRAINT `Department_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `Branch` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Designation`
--
ALTER TABLE `Designation`
  ADD CONSTRAINT `Designation_sub_department_id_fkey` FOREIGN KEY (`sub_department_id`) REFERENCES `SubDepartment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `SubDepartment`
--
ALTER TABLE `SubDepartment`
  ADD CONSTRAINT `SubDepartment_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `User_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `Branch` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `User_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

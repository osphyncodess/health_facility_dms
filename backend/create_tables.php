<?php
require_once "../config/db.php";

// Drop tables if exist
$conn->query("DROP TABLE IF EXISTS la_register");
$conn->query("DROP TABLE IF EXISTS treatments_given");
$conn->query("DROP TABLE IF EXISTS conditions");
$conn->query("DROP TABLE IF EXISTS treatments");
$conn->query("DROP TABLE IF EXISTS diseases");
$conn->query("DROP TABLE IF EXISTS patients");
$conn->query("DROP TABLE IF EXISTS villages");
$conn->query("DROP TABLE IF EXISTS users");

// Users table (needed for created_by reference)
$users_sql = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB";

// Diseases Table
$disease_sql = "CREATE TABLE IF NOT EXISTS diseases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  diseaseName VARCHAR(100) NOT NULL UNIQUE,
  diseaseCode CHAR(3) NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_diseaseName (diseaseName),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB";

// Villages Table
$village_sql = "CREATE TABLE IF NOT EXISTS villages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  village VARCHAR(100) NOT NULL UNIQUE,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_village (village),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB";

// Patients Table
$patients_sql = "CREATE TABLE IF NOT EXISTS patients (
    patientID INT AUTO_INCREMENT PRIMARY KEY,
    serialNumber INT NOT NULL UNIQUE,
    date DATE NOT NULL,
    name VARCHAR(100) NULL,
    age INT NOT NULL,
    gender VARCHAR(50) NOT NULL,
    hiv_status VARCHAR(50) NOT NULL,
    villageID INT NOT NULL,
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_serialNumber (serialNumber),
    INDEX idx_date (date),
    INDEX idx_name (name),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB";

// LA Register Table
$la_register_sql = "CREATE TABLE IF NOT EXISTS la_register (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patientID INT,
  la_given VARCHAR(100) NOT NULL UNIQUE,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_la_given (la_given),
  FOREIGN KEY (patientID) REFERENCES patients(patientID) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB";

// Treatments Table
$treatment_sql = "CREATE TABLE IF NOT EXISTS treatments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  treatment VARCHAR(100) NOT NULL UNIQUE,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_treatment (treatment),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB";

// Conditions Table
$conditions_sql = "CREATE TABLE IF NOT EXISTS conditions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patientID INT,
    test VARCHAR(4),
    result VARCHAR(8),
    diseaseID INT,
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_condition_patient (patientID),
    FOREIGN KEY (patientID) REFERENCES patients(patientID) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE (patientID, diseaseID)
) ENGINE=InnoDB";

// Treatments Given Table
$treatments_given = "CREATE TABLE IF NOT EXISTS treatments_given (
  conditionsID INT NOT NULL,
  treatmentID INT NOT NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (conditionsID, treatmentID),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB";

// Execute all queries
$conn->query($users_sql);
$conn->query($patients_sql);
$conn->query($disease_sql);
$conn->query($village_sql);
$conn->query($la_register_sql);
$conn->query($treatment_sql);
$conn->query($conditions_sql);
$conn->query($treatments_given);

echo "Tables with created_by and created_at successfully created!";
$conn->close();
?>
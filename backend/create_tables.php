<?php
require_once "db.php";

// Create Patients Table
$conn->query("DROP TABLE IF EXISTS la_register");
$conn->query("DROP TABLE IF EXISTS treatments_given");
$conn->query("DROP TABLE IF EXISTS conditions");
$conn->query("DROP TABLE IF EXISTS treatments");
$conn->query("DROP TABLE IF EXISTS diseases");
$conn->query("DROP TABLE IF EXISTS patients");
$conn->query("DROP TABLE IF EXISTS villages");

$disease_sql = "CREATE TABLE IF NOT EXISTS diseases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  diseaseName VARCHAR(100) NOT NULL UNIQUE,
  diseaseCode CHAR(3) NULL,
  
  index idx_diseaseName (diseaseName)
) ENGINE=InnoDB";

$village_sql = "CREATE TABLE IF NOT EXISTS villages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  village VARCHAR(100) NOT NULL UNIQUE,
  
  index idx_village (village)
) ENGINE=InnoDB";

$la_register_sql = "CREATE TABLE IF NOT EXISTS la_register (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patientID INT,
  la_given VARCHAR(100) NOT NULL UNIQUE,
  
  index idx_la_given (la_given),
  
  FOREIGN KEY (patientID)
        REFERENCES patients(patientId)
        ON DELETE CASCADE
) ENGINE=InnoDB";

$treatments_given = "CREATE TABLE IF NOT EXISTS treatments_given (
  conditionsID INT NOT NULL,
  treatmentID INT NOT NULL,
  
  PRIMARY KEY (conditionsID, treatmentID)
) ENGINE=InnoDB";

$treatment_sql = "CREATE TABLE IF NOT EXISTS treatments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  treatment VARCHAR(100) NOT NULL UNIQUE,
  
  index idx_treatment (treatment)
) ENGINE=InnoDB";

$patients_sql = "CREATE TABLE IF NOT EXISTS patients (
    patientID INT AUTO_INCREMENT PRIMARY KEY,
    serialNumber VARCHAR(50) NOT NULL UNIQUE,
    date DATE NOT NULL,
    name VARCHAR(100) NULL,
    age INT NOT NULL,
    gender VARCHAR(50) NOT NULL,
    hiv_status VARCHAR(50) NOT NULL,
    villageID INT NOT NULL,

    INDEX idx_serialNumber (serialNumber),
    INDEX idx_date (date),
    INDEX idx_name (name)
) ENGINE=InnoDB";

// Conditions Table
$conditions_sql = "CREATE TABLE IF NOT EXISTS conditions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patientID INT,
    test VARCHAR(4),
    result VARCHAR(8),
    diseaseID INT,

    INDEX idx_condition_patient (patientID),

    FOREIGN KEY (patientID)
        REFERENCES patients(patientId)
        ON DELETE CASCADE,

    UNIQUE (patientID, diseaseID)
) ENGINE=InnoDB";

// Treatments Table
$conn->query($patients_sql);
$conn->query($disease_sql);
$conn->query($la_register_sql);
$conn->query($treatment_sql);

$conn->query($conditions_sql);
$conn->query($treatments_given);
$conn->query($village_sql);

echo "Tables with indexes created successfully!";
$conn->close();
?>

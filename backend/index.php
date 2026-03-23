
<?php 
    $conn = new mysqli();

    $stmt = $conn->prepare("SELECT * FROM condition");

    $result = $stmt->execute()
?>
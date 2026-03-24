<?php include "config.php"; ?>

<!DOCTYPE html>
<html>
<head>
    <title>All Photos</title>
</head>
<body>

<h2>Uploaded Photos</h2>

<?php

$result = $conn->query("SELECT * FROM photos ORDER BY uploaded_at DESC");

$arr = [];
while ($row = $result->fetch_assoc()) {
    echo "<div style='margin:10px; display:inline-block;'>";
    echo "<img src='uploads/" . $row['filename'] . "' width='200'><br>";
    echo "</div>";
  
  array_push($arr, $row);
}

echo json_encode($arr);

?>

<br><br>
<a href="upload.php">Upload More</a>

</body>
</html>
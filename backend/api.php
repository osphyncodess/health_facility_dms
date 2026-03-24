<?php
  include("header_info.php");
  include("config.php");
  $arr = [
      [
      "id" => 1,
      "name" => "Josephy Ng'omba",
      "age" => 10
      ],
      [
        "id" => 2,
        "name" => "Stanley Ng'omba",
        "age" => 77
      ],
      [
        "id" => 3,
        "name" => "Brinley Ng'omba",
        "age" => 26
      ],
      [
        "id" => 4,
        "name" => "Richard Chimutu",
        "age" => 83
      ]
    ];
    
    array_push($arr, [
      "id" => 5,
      "name" => "Catherine Ajida",
      "age" => 22
    ]);
    
    $newArr =[];
    if($_GET){
      foreach ($arr as $item){
        if($item["id"] == $_GET["id"]){
          array_push($newArr, $item);
        }
      };
    };
    
    
    if (!$_GET){
      $newArr = $arr;
    };
    
    $data = [
      "data" =>$newArr,
      "success" => true
    ];
    
    echo json_encode($data);
    
    $sql = "INSERT INTO diseases(diseaseName, diseaseCode) VALUES('Malaria', '56')";
    
    $result = $conn->query($sql);
    
    print_r($conn->insert_id);
?>
<?php
    require_once $_SERVER['DOCUMENT_ROOT'] ."/config/db.php";
    
    $data = json_decode(file_get_contents("php://input", true));

    

    $id = $data->id;
    $what = $data->what;

    $sql = "";

    if($what === 'ario'){
        $sql = "UPDATE conditions set diseaseID = (SELECT id FROM diseases WHERE diseaseName = 'URTI') WHERE id = $id";
    }else{
        $sql = "UPDATE conditions set diseaseID = (SELECT id FROM diseases WHERE diseaseName = 'ARI') WHERE id = $id";
    }

    try{
        $conn->query($sql);
        echo json_encode("Zatheka");
    }catch(Exception $e){
        echo json_encode($e->getMessage());
    }

    

import VillageForm from "../../components/VillageForm";
import { useEffect, useState } from "react";

const CreateVillages = () => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    console.log(response);
  }, [response]);
  return <VillageForm setResponse={setResponse} />;
};

export default CreateVillages;

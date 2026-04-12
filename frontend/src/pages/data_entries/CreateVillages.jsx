import VillageForm from "../../components/VillageForm";
import { useEffect, useState } from "react";

const CreateVillages = () => {
  const [response, setResponse] = useState(null);

  return <VillageForm setResponse={setResponse} />;
};

export default CreateVillages;

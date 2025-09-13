import React from "react";
import CreateProblemForm from "../components/CreateProblemForm";
import { useAuthStore } from "../store/useAuthStore";

const AddProblem = () => {
  return (
    <div>
      <CreateProblemForm />
      {console.log(useAuthStore.getState().authUser)}
    </div>
  );
};

export default AddProblem;
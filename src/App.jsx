import React from "react";
import DataForm from "./components/DataForm";

const App = () => {
  return (
    <div className="p-2">
      <div className="text-xl font-bold mb-4">
        Authors <span className="text-primary">API</span>
      </div>
      <DataForm />
    </div>
  );
};

export default App;

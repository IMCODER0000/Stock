import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CommonRoutes from "./CommonRoutes";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/*" element={<CommonRoutes />} />

      </Routes>
      </BrowserRouter>
  );
}

export default App;

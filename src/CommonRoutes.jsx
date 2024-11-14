
import React from "react";
import { useRoutes } from "react-router-dom";
import Main from "./Main";
import Search from "./Search";
import Content from "./Content";


const CommonRoutes  = () => {
    let element = useRoutes([
      { path: "/", element: <Main /> },

  
    ]);

    return element;
  };
  
  
  export default CommonRoutes ;
  
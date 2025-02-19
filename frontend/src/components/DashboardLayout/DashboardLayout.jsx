import React, { useState } from "react";


import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {


  return (

    
    <>
      <Navbar />
      <div className="flex-1 p-8">{children}</div>
    </>
  );
};

export default DashboardLayout;

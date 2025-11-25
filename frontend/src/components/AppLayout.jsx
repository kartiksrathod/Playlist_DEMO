import React from 'react';
import Sidebar from './Sidebar';

const AppLayout = ({ children, showSearch = false, searchProps = {} }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-20">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;

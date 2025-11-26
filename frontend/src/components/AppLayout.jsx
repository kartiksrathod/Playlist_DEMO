import React from 'react';
import Sidebar from './Sidebar';

const AppLayout = ({ children, showSearch = false, searchProps = {} }) => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />
      <div className="ml-20 pb-24">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;

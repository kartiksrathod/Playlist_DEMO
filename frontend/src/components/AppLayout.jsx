import React from 'react';
import Sidebar from './Sidebar';
import { useTheme } from '@/context/ThemeContext';

const AppLayout = ({ children, showSearch = false, searchProps = {} }) => {
  const { themeConfig } = useTheme();
  
  return (
    <div className={`min-h-screen ${themeConfig.classes.body}`}>
      <Sidebar />
      <div className="ml-20 pb-24">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;

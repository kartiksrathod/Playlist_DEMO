import React from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useTheme } from '@/context/ThemeContext';

const AppLayout = ({ children, showSearch = false, searchProps = {} }) => {
  const { themeConfig } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <div className="ml-20 pb-24 flex-1">
        {children}
      </div>
      <div className="ml-20">
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;

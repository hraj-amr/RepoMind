import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar'; 
import { UserButton } from '@clerk/nextjs';
import { AppSidebar } from './app-sidebar';
import "./globals.css";

type Props = {
  children: React.ReactNode;
};


function SidebarLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <div className='flex'>
        <AppSidebar/> 

        <main className='w-full m-2'>
          <div className='flex items-center gap-2 border border-sidebar-border bg-sidebar shadow rounded-md p-2 px-4'>
            {/* <SearchBar/> */}
            <div className='ml-auto'></div>
            <UserButton /> 
          </div>
          <div className= "h-4">
                {/* main content */}
          </div>
          <div className='border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-scroll h-[calc(100vh-6rem)] p-4'>
                {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default SidebarLayout;
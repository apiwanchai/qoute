import './globals.css'; 
import React from 'react';
import { Inter } from 'next/font/google';

import StyledComponentsRegistry from '../lib/AntdRegistry';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'คำคมๆ',
  description: 'Generated by create next app',
};

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en">
    <body className={inter.className}>
      <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
    </body>
  </html>
);

export default RootLayout;
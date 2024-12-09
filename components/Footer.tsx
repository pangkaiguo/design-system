'use client';

import { useEffect, useState } from 'react';

const Footer = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <footer className='bg-black text-center text-white p-4 border-t border-gray-800 mt-auto'>&copy; {year} Admin Dashboard</footer>;
};
export default Footer;
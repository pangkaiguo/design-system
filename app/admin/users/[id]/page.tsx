'use client';

import React from 'react';
import UserForm from '../components/UserForm';

const EditUserPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params); // Unwrap the params object using React.use()

  return <UserForm id={id} />;
};

export default EditUserPage;
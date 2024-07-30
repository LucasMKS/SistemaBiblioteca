import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

export default function ProfilePage() {
  const [profileInfo, setProfileInfo] = useState({});

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {

            const token = localStorage.getItem('token'); 
            const response = await UserService.getYourProfile(token);
            setProfileInfo(response.ourUsers);
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };


  return (
    <main className='h-screen flex justify-center items-center'>
      <div className="w-full max-w-screen-md rounded-md overflow-hidden border">
        <Card >
          <CardHeader>
            <CardTitle className="text-center">Perfil</CardTitle>
            <CardDescription className="text-center">Visualize informações de seu perfil</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 items-center gap-4">
            <p className="mb-2">Name: {profileInfo.name}</p>
            <p className="mb-2">Matricula: {profileInfo.matricula}</p>
            <p className="mb-2">Email: {profileInfo.email}</p>
            <p>Função: {profileInfo.role}</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

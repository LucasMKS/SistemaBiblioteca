import React, { useState, useEffect } from "react";
import UserService from "../service/UserService";
import { useNavigate } from 'react-router-dom';
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ProfilePage({ onLogout }) {
  const navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState({});
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    matricula: "",
    role: "",
  });

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const handleUpdateClick = (id) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      id: id,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    const confirmLogout = true;
    if (confirmLogout) {
      onLogout();
      navigate('/login');
    }
  };

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await UserService.getYourProfile(token);
      setProfileInfo(response.ourUsers);
      const { id, name, email, matricula, role } = response.ourUsers;
      setUserData({ id, name, email, matricula, role });
    } catch (error) {
      console.error("Error fetching profile information:", error);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await UserService.userUpdateEmail(profileInfo.id, userData, token);
      if (profileInfo.email != userData.email) {
        handleLogout();
      }
      console.log(res);
      fetchProfileInfo();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar usuário");
    }
  };

  return (
    <main className="h-screen flex justify-center items-center">

      <div className="w-full max-w-screen-md rounded-md overflow-hidden border">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Perfil</CardTitle>
            <CardDescription className="text-center">
              Visualize informações do seu perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 items-center gap-4">
            <div className="flex items-center justify-between col-span-2">
              <Label htmlFor="name" className="mb-2">
                Nome: {profileInfo.name}
              </Label>
            </div>
            <div className="flex items-center justify-between col-span-2">
              <Label htmlFor="matricula" className="mb-2">
                Matrícula: {profileInfo.matricula}
              </Label>
            </div>
            <div className="flex items-center justify-between col-span-2">
              <Label htmlFor="role" className="mb-2">
                Email: {profileInfo.email}
              </Label>
            </div>
            <div className="flex items-center justify-between col-span-2">
              <Label htmlFor="role" className="mb-2">
                Função: {profileInfo.role}
              </Label>
              {/* Ação Alterar */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-white" onClick={() => handleUpdateClick(profileInfo.id)} >
                    Alterar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Alterar Informações</DialogTitle>
                    <DialogDescription>
                      Modifique as informações do seu perfil.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={updateUser}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Nome
                        </Label>
                        <Input id="name" name="name" value={userData.name} onChange={handleInputChange} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input id="email" name="email" value={userData.email} onChange={handleInputChange} className="col-span-3" />
                      </div>
                      <Label htmlFor="email" className="text-center text-xs">Alterar o email ira deslogar</Label>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="submit">Salvar</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

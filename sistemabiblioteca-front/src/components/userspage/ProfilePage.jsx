import React, { useState, useEffect } from "react";
import UserService from "../service/UserService";
import { useNavigate } from 'react-router-dom';
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ProfilePage({ onLogout }) {
  const navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState([]);
  const [loanData, setLoanData] = useState([]);
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    matricula: "",
    role: "",
  });
  const [bookData, setBookData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  useEffect(() => {
    if (userData.matricula) {
      fetchLoan(userData.matricula);
    }
  }, [userData.matricula]);

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

  const fetchLoan = async (matricula) => {
    try {
      const token = localStorage.getItem("token");
      const response = await UserService.getLoanByMatricula(matricula, token);
      const loans = response.ourLoanList || [];
      setLoanData(loans);
      fetchBookDataForLoans(loans);
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  const fetchBookDataForLoans = async (loans) => {
    const token = localStorage.getItem("token");
    const bookDataTemp = {};
    for (const loan of loans) {
      if (!bookDataTemp[loan.isbn]) {
        try {
          const response = await UserService.getBookByIsbn(loan.isbn, token);
          bookDataTemp[loan.isbn] = response.book;
        } catch (error) {
          console.error("Error fetching book data for ISBN:", loan.isbn, error);
        }
      }
    }
    setBookData(bookDataTemp);
    setIsLoading(false);
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
      if (profileInfo.email !== userData.email) {
        handleLogout();
      }
      fetchProfileInfo();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar usuário");
    }
  };

  return (
    <main className="flex h-screen justify-center items-center bg-black">
      <div className="flex flex-col items-center">
        <Card className="bg-surfaceContainer-foreground">
          <CardHeader>
            <CardTitle className="text-center">Perfil</CardTitle>
            <CardDescription className="text-center">
              Visualize informações do seu perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 items-center gap-4">
            <div className="flex items-center justify-between col-span-2">
              <Label htmlFor="name" className="mb-2">Nome: {profileInfo.name}</Label>
            </div>
            <div className="flex items-center justify-between col-span-2">
              <Label htmlFor="matricula" className="mb-2">Matrícula: {profileInfo.matricula}</Label>
            </div>
            <div className="flex items-center justify-between col-span-2">
              <Label htmlFor="role" className="mb-2">Email: {profileInfo.email}</Label>
            </div>
            <div className="flex items-center justify-between col-span-2">
              <Label htmlFor="role" className="mb-2">Função: {profileInfo.role}</Label>
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
                        <Label htmlFor="name" className="text-right">Nome</Label>
                        <Input id="name" name="name" value={userData.name} onChange={handleInputChange} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
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
        <div className="flex flex-wrap gap-6 m-6">
          {isLoading ? (
            <Label className="flex text-center text-xl"><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Carregando Emprestimos...</Label>
          ) : (
            Array.isArray(loanData) && loanData.map((loan, index) => (
              <div key={index} className="flex flex-col border p-4 rounded w-72 bg-surface">
                <div className="flex items-center space-x-2 mt-2 mb-2">
                  <Label htmlFor="emprestimo" className="font-bold">Título: </Label>
                  <Label htmlFor="emprestimo" className="">{bookData[loan.isbn]?.titulo}</Label>
                </div>
                <div className="flex items-center space-x-2 mt-2 mb-2">
                  <Label htmlFor="emprestimo" className="font-bold">ISBN: </Label>
                  <Label htmlFor="emprestimo" className="">{loan.isbn}</Label>
                </div>
                <div className="flex items-center space-x-2 mt-2 mb-2">
                  <Label htmlFor="emprestimo" className="font-bold">Empréstimo: </Label>
                  <Label htmlFor="emprestimo">{loan.dataEmprestimo}</Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Label htmlFor="emprestimo" className="font-bold">Devolução: </Label>
                  <Label htmlFor="emprestimo">{loan.dataDevolucao}</Label>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

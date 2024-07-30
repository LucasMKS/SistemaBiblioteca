import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserService from "../service/UserService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loanData, setLoanData] = useState({});
  const { userId } = useParams();

  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    matricula: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await UserService.getAllUsers(token);
      setUsers(response.ourUsersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchLoan = async (matricula) => {
    try {
      const response = await UserService.getLoanByMatricula(matricula);
      console.log(response.ourLoanList); // Adicione isto para verificar a estrutura dos dados
      setLoanData((prevLoanData) => ({
        ...prevLoanData,
        [matricula]: response.ourLoanList || [],
      }));
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?"
      );

      const token = localStorage.getItem("token");
      if (confirmDelete) {
        await UserService.deleteUser(userId, token);
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDataById(userId);
    }
  }, [userId]);

  const fetchUserDataById = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await UserService.getUserById(userId, token);
      const { id, name, email, matricula, role } = response.ourUsers;
      setUserData({ id, name, email, matricula, role });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleUpdateClick = async (userId) => {
    await fetchUserDataById(userId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await UserService.updateUser(userData.id, userData, token);
      fetchUsers();
      console.log(res);
    } catch (error) {
      console.error("Error updating user profile:", error);
      alert(error);
    }
  };

  const deleteLoan = async (matricula, bookIsbn) => {
    try {
      const confirmDelete = window.confirm(
        "Deseja realmente deletar este livro??"
      );
      const token = localStorage.getItem("token");
      if (confirmDelete) {
        await UserService.deleteLoan(matricula, bookIsbn, token);
        fetchLoan(matricula);
      }
    } catch (error) {
      console.error("Erro ao deletar livro:", error);
    }
  };

  return (
    <main className="h-screen flex justify-center items-center">
      <div className="flex">
        <div className="w-full m-24 text-center rounded-md overflow-hidden border bg-background text-slate-200">
          <Table className="shadow-md mx-auto table-fixed w-full rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center" style={{ width: "2%" }}>
                  ID
                </TableHead>
                <TableHead className="text-center">Nome</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Matricula</TableHead>
                <TableHead className="text-center">Role</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-center">{user.id}</TableCell>
                  <TableCell className="text-center">{user.name}</TableCell>
                  <TableCell className="text-center">{user.email}</TableCell>
                  <TableCell className="text-center">
                    {user.matricula}
                  </TableCell>
                  <TableCell className="text-center">{user.role}</TableCell>
                  <TableCell className="text-center justify-center flex">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          className="mr-2"
                          variant="outline"
                          onClick={() => handleUpdateClick(user.id)}
                        >
                          Alterar
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Editar Usuário</SheetTitle>
                          <SheetDescription>
                            Faça alterações no perfil aqui. Clique em salvar
                            quando terminar.
                          </SheetDescription>
                        </SheetHeader>
                        <form onSubmit={handleSubmit}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Nome
                              </Label>
                              <Input
                                type="text"
                                name="name"
                                value={userData.name}
                                onChange={handleInputChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="email" className="text-right">
                                Email
                              </Label>
                              <Input
                                type="text"
                                name="email"
                                value={userData.email}
                                onChange={handleInputChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="matricula" className="text-right">
                                Matricula
                              </Label>
                              <Input
                                type="text"
                                name="matricula"
                                value={userData.matricula}
                                onChange={handleInputChange}
                                className="col-span-3"
                                disabled
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="role" className="text-right">
                                Role
                              </Label>
                              <Input
                                type="text"
                                name="role"
                                value={userData.role}
                                onChange={handleInputChange}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <SheetFooter>
                            <Button
                              className="ml-2"
                              variant="destructive"
                              onClick={() => deleteUser(user.id)}
                            >
                              Delete
                            </Button>
                            <SheetClose asChild>
                              <Button
                                variant="outline"
                                type="submit"
                                className="bg-gray-200 text-black"
                              >
                                Salvar Alterações
                              </Button>
                            </SheetClose>
                          </SheetFooter>
                        </form>
                      </SheetContent>
                    </Sheet>

                    <div>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => fetchLoan(user.matricula)}
                          >
                            Emprestimos
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom">
                          <SheetHeader>
                            <SheetTitle>Emprestimos</SheetTitle>
                            <SheetDescription>
                              Delete os emprestimos do usuario ou altere a data
                              de devolução.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="flex flex-wrap gap-4">
                            {Array.isArray(loanData[user.matricula]) &&
                              loanData[user.matricula].map((loan, index) => (
                                <div
                                  key={index}
                                  className="flex flex-col items-start border p-4 rounded w-64"
                                >
                                  <Label htmlFor="emprestimo" className="mb-2">
                                    ISBN: {loan.isbn}
                                  </Label>
                                  <Label htmlFor="emprestimo" className="mb-2">
                                    Matricula: {loan.alunoMatricula}
                                  </Label>
                                  <Label htmlFor="emprestimo" className="mb-2">
                                    Emprestimo: {loan.dataEmprestimo}
                                  </Label>
                                  <Label htmlFor="emprestimo" className="mb-2">
                                    Devolução: {loan.dataDevolucao}
                                  </Label>
                                  <Button
                                    variant="destructive"
                                    onClick={() =>
                                      deleteLoan(loan.alunoMatricula, loan.isbn)
                                    }
                                    className="mb-2 "
                                  >
                                    DEVOLVIDO
                                  </Button>
                                </div>
                              ))}
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}

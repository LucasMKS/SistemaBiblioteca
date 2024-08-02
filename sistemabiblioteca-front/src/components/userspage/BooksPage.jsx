import React, { useState, useEffect } from "react";
import UserService from "../service/UserService";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ProfilePage({ isAdmin }) {

  const [BooksList, setBooksList] = useState([]);
  const [bookData, setBookData] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    categoria: "",
    quantidade: "",
  });
  const [loanData, setLoanData] = useState({
    alunoMatricula: "",
    isbn: "",
    status: "true",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const { bookIsbn } = useParams();
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLoanMatricula();
    fetchBooks();
  }, []);

  useEffect(() => {
    if (bookIsbn) {
      fetchBookDataByIsbn(bookIsbn);
    }
  }, [bookIsbn]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prevBookData) => ({
      ...prevBookData,
      [name]: value,
    }));
  };

  const handleLoanInputChange = (e) => {
    const { name, value } = e.target;
    setLoanData((prevLoanData) => ({
      ...prevLoanData,
      [name]: value,
    }));
  };

  const handleUpdateClick = (isbn) => {
    setLoanData((prevLoanData) => ({
      ...prevLoanData,
      isbn: isbn,
    }));
    fetchBookDataByIsbn(isbn);
  };

  const fetchLoanMatricula = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await UserService.getYourProfile(token);
      loanData.alunoMatricula = response.ourUsers.matricula;
    } catch (error) {
      setError(response.mensagem);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await UserService.getAllBooks();
      setBooksList(response.ourBookList || []);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      setError("Erro ao buscar livros");
    }
  };

  const fetchBookDataByIsbn = async (bookIsbn) => {
    try {
      const token = localStorage.getItem("token");
      const response = await UserService.getBookByIsbn(bookIsbn, token);
      const { titulo, autor, isbn, categoria, quantidade } = response.book;
      setBookData({ titulo, autor, isbn, categoria, quantidade });
    } catch (error) {
      console.error("Erro ao buscar dados do livro:", error);
    }
  };

  const updateBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await UserService.updateBook(bookData.isbn, bookData, token);
      if (res.statusCode === 200) {
        fetchBooks();
        console.log(res);
      } else {
        setError(res.mensagem);
        console.log(res);
        setTimeout(() => {
          setError("");
        }, 6000);
      }
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
    }
  };

  const registerNewBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await UserService.registerBook(bookData, token);
      if (res.statusCode === 200) {
        fetchBooks();
        setBookData({
          titulo: "",
          autor: "",
          isbn: "",
          categoria: "",
          quantidade: "",
        });
      } else {
        setError(res.mensagem);
        console.log(res);
        setTimeout(() => {
          setError("");
        }, 6000);
      }
    } catch (error) {
      console.error("Erro ao registrar o livro:", error);
      setError("Erro ao registrar o livro. Por favor, tente novamente.");
      setTimeout(() => {
        setError("");
      }, 6000);
    }
  };

  const registerNewLoan = async (e) => {
    e.preventDefault();
    try {
      const res = await UserService.registerLoan(loanData);

      if (res.statusCode === 200) {
        fetchBooks();
      } else {
        setError(res.mensagem);
        console.log(res);
        setTimeout(() => {
          setError("");
        }, 6000);
      }
    } catch (error) {
      console.error("Erro ao registrar o emprestimo:", error);
    }
  };

  const deleteBook = async (bookIsbn) => {
    try {
      const confirmDelete = window.confirm(
        "Deseja realmente deletar este livro??"
      );
      const token = localStorage.getItem("token");
      if (confirmDelete) {
        await UserService.deleteBooks(bookIsbn, token);
        fetchBooks();
      }
    } catch (error) {
      console.error("Erro ao deletar livro:", error);
    }
  };

  // Paginação
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = BooksList.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(BooksList.length / booksPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <main className="h-screen flex flex-col items-center bg-background text-foreground">
      <div className="w-full h-2/6 bg-gradient-to-b">
        <img
          src="https://images.pexels.com/photos/775998/pexels-photo-775998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Imagem de topo"
          className="w-full h-full object-cover saturate-50 backdrop-saturate-200 shadow-xl shadow-gray-900"
        />
      </div>
      <div className="flex mt-12">
        {/* Descrição dos Livros */}
        <div className="w-1/4 p-4 m-4 text-center rounded-md overflow-hidden bg-background text-slate-200">
          <h1 className="text-2xl font-bold mb-4">Livros</h1>
          <p>
            Nesta seção, você encontrará uma ampla seleção de livros. Cada livro é apresentado com informações detalhadas, incluindo título, autor, ISBN, categoria e quantidade disponível.
          </p>
        </div>
        {/* Tabela de Livros */}
        <div className="w-full pb-2 rounded-md overflow-hidden border bg-secondary-foreground text-black">
          <div className="overflow-x-auto">
            <Table className="shadow-md table-fixed w-full rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center text-black" style={{ width: "13%" }}>Título</TableHead>
                  <TableHead className="text-center text-black" style={{ width: "13%" }}>Autor</TableHead>
                  <TableHead className="text-center text-black" style={{ width: "10%" }}>Categoria</TableHead>
                  <TableHead className="text-center text-black" style={{ width: "10%" }}>ISBN</TableHead>
                  <TableHead className="text-center text-black" style={{ width: "8%" }}>Quantidade</TableHead>
                  <TableHead className="text-center text-black" style={{ width: "18%" }}>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBooks.length > 0 ? (
                  currentBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="text-center">{book.titulo}</TableCell>
                      <TableCell className="text-center">{book.autor}</TableCell>
                      <TableCell className="text-center">{book.categoria}</TableCell>
                      <TableCell className="text-center">{book.isbn}</TableCell>
                      <TableCell className="text-center">{book.quantidade}</TableCell>
                      {/* Ação Emprestimo */}
                      <TableCell className="text-center flex justify-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="text-white" onClick={() => handleUpdateClick(book.isbn)}>
                              Empréstimo
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Emprestimo</DialogTitle>
                              <DialogDescription>
                                Confire se o livro desejado esta correto, caso sim clique em Cadastrar.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={registerNewLoan}>
                              <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                  <Label htmlFor="titulo" className="text-right">Livro</Label>
                                  <Input id="titulo" name="titulo" value={bookData.titulo} disabled className="flex-1" />
                                </div>
                                <div className="flex items-center space-x-4">
                                  <Label htmlFor="matricula" className="text-right">Matrícula</Label>
                                  <Input id="matricula" name="alunoMatricula" value={loanData.alunoMatricula} onChange={handleLoanInputChange} className="flex-1" required={isAdmin} disabled={!isAdmin} />
                                </div>
                                <div className="flex items-center space-x-4">
                                  <Label htmlFor="isbn" className="text-right">ISBN</Label>
                                  <Input type="number" id="isbn" name="isbn" value={loanData.isbn} onChange={handleLoanInputChange} className="flex-1" disabled />
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button type="submit" className="mt-6">Cadastrar</Button>
                                </DialogClose>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        {/* Ação Alterar Admin */}
                        {isAdmin && (
                          <>
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="outline" className="text-white" onClick={() => handleUpdateClick(book.isbn)}>
                                  Alterar
                                </Button>
                              </SheetTrigger>
                              <SheetContent>
                                <SheetHeader>
                                  <SheetTitle>Editar Livro</SheetTitle>
                                  <SheetDescription>
                                    Faça alterações no livro selecionado. Clique em 'Salvar Alterações' quando terminar.
                                  </SheetDescription>
                                </SheetHeader>
                                <form onSubmit={updateBook}>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-5 items-center gap-4">
                                      <Label htmlFor="titulo" className="text-right">
                                        Título:
                                      </Label>
                                      <Input type="text" name="titulo" value={bookData.titulo} onChange={handleInputChange} className="col-span-4" />
                                    </div>
                                    <div className="grid grid-cols-5 gap-4 items-center">
                                      <Label htmlFor="autor" className="text-right">
                                        Autor:
                                      </Label>
                                      <Input type="text" name="autor" value={bookData.autor} onChange={handleInputChange} className="col-span-4" />
                                    </div>
                                    <div className="grid grid-cols-5 gap-4 items-center">
                                      <Label htmlFor="isbn" className="text-right">
                                        ISBN:
                                      </Label>
                                      <Input type="number" name="isbn" value={bookData.isbn} onChange={handleInputChange} className="col-span-4" />
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 items-center">
                                      <Label htmlFor="categoria" className="text-right">
                                        Categoria:
                                      </Label>
                                      <Input type="text" name="categoria" value={bookData.categoria} onChange={handleInputChange} className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 items-center">
                                      <Label htmlFor="quantidade" className="text-right">
                                        Quantidade:
                                      </Label>
                                      <Input type="number" name="quantidade" value={bookData.quantidade} onChange={handleInputChange} className="col-span-3" />
                                    </div>
                                  </div>
                                  <SheetFooter>
                                    <SheetClose asChild>
                                      <Button variant="outline" type="submit" className="bg-gray-200 text-black">
                                        Salvar Alterações
                                      </Button>
                                    </SheetClose>
                                  </SheetFooter>
                                </form>
                              </SheetContent>
                            </Sheet>
                            {/* Ação Deletar Admin */}
                            <Button className="ml-2" variant="destructive" onClick={() => deleteBook(book.isbn)}>
                              Deletar
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center">
                      Nenhum livro encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="ml-2 flex-auto">
              {/* Ação adicionar novo livro admin */}
              {isAdmin && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="text-black">
                      Adicionar Novo Livro
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Adicionar Livro</SheetTitle>
                      <SheetDescription>
                        Adicione as informações do novo livro. Clique em salvar quando terminar.
                      </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={registerNewBook}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="titulo" className="text-right">
                            Título
                          </Label>
                          <Input type="text" name="titulo" value={bookData.titulo} onChange={handleInputChange} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="autor" className="text-right">
                            Autor
                          </Label>
                          <Input type="text" name="autor" value={bookData.autor} onChange={handleInputChange} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="isbn" className="text-right">
                            ISBN
                          </Label>
                          <Input type="number" name="isbn" value={bookData.isbn} onChange={handleInputChange} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="categoria" className="text-right">
                            Categoria
                          </Label>
                          <Input type="text" name="categoria" value={bookData.categoria} onChange={handleInputChange} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="quantidade" className="text-right">
                            Quantidade
                          </Label>
                          <Input type="number" name="quantidade" value={bookData.quantidade} onChange={handleInputChange} className="col-span-3" required />
                        </div>
                      </div>
                      <SheetFooter>
                        <SheetClose asChild>
                          <Button variant="outline" type="submit" className="bg-gray-200 text-black" >
                            Salvar Alterações
                          </Button>
                        </SheetClose>
                      </SheetFooter>
                    </form>
                  </SheetContent>
                </Sheet>
              )}
            </div>
            {/* Paginação */}
            <div className="flex items-center">
              <span className="mr-2">
                Página {currentPage} de {totalPages}
              </span>
              <Button className="mx-2 text-white" variant="outline" size="icon" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button className="mx-2 text-white" variant="outline" size="icon" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        {/* Caixa de erro */}
        <div className="w-1/4 p-4 text-center bg-background text-foreground">
          {error && (
            <Alert>
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </main>
  );
}

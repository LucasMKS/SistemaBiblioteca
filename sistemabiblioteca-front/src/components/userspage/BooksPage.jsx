import React, { useState, useEffect } from "react";
import UserService from "../service/UserService";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import bookbanner from "../../assets/bookbanner.png";

export default function ProfilePage({ isAdmin }) {
  const [BooksList, setBooksList] = useState([]);

  const [bookRandom, setBookRandom] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    categoria: "",
    quantidade: "",
  });
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

  const limparCampos = () => {
    setBookData({
      titulo: "",
      autor: "",
      isbn: "",
      categoria: "",
      quantidade: "",
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const { bookIsbn } = useParams();
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLoanMatricula();
    fetchBooks();
    getRandomBook();
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
      console.error("Erro ao buscar livro:", error);
      setError("Erro ao buscar livro");
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

  const getRandomBook = async () => {
    try {
      const response = await UserService.getRandomBook();
      console.log(response);
      setBookRandom(response.book);
    } catch (error) {
      console.error("Erro ao buscar livro aleatório:", error);
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
        limparCampos();
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
    <main className="h-screen flex flex-col items-center bg-backgroundmi text-foreground">
      <div className="w-full h-0 pb-[15%] relative bg-gradient-to-b">
        <img
          src={bookbanner}
          alt="Imagem de topo"
          className="absolute top-0 left-0 w-full h-full object-cover saturate-50 shadow-xl shadow-gray-900"
        />
      </div>

      <div className="flex mt-12 w-full">
        {/* Descrição dos livro */}
        <aside className="w-1/6 p-4 m-4 h-2/4 text-center rounded-md bg-surface text-slate-200 shadow-md shadow-surfaceDim">
          <h1 className="mb-4 font-rubik text-3xl">LIBRISYS</h1>
          <p className="font-karla">
            Librisys é um sistema de biblioteca desenvolvido para facilitar a visualização de livros e a gestão de empréstimos.
          </p>
        </aside>
        {/* Tabela de livro */}
        <div className="flex-1 p-4">
          <div className="overflow-x-auto  rounded-md shadow-md shadow-surfaceDim">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow className="uppercase bg-surfaceDim hover:bg-surfaceDim">
                  <TableHead className="text-center" style={{ width: "13%" }}>Título</TableHead>
                  <TableHead className="text-center" style={{ width: "13%" }}>Autor</TableHead>
                  <TableHead className="text-center" style={{ width: "10%" }}>Categoria</TableHead>
                  <TableHead className="text-center" style={{ width: "10%" }}>ISBN</TableHead>
                  <TableHead className="text-center" style={{ width: "8%" }}>Quantidade</TableHead>
                  <TableHead className="text-center" style={{ width: "18%" }}>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-surfaceDim-foreground ">
                {currentBooks.length > 0 ? (
                  currentBooks.map((book) => (
                    <TableRow key={book.id} className="hover:bg-surfaceDim">
                      <TableCell className="text-center">{book.titulo}</TableCell>
                      <TableCell className="text-center">{book.autor}</TableCell>
                      <TableCell className="text-center">{book.categoria}</TableCell>
                      <TableCell className="text-center">{book.isbn}</TableCell>
                      <TableCell className="text-center">{book.quantidade}</TableCell>
                      {/* Ação Emprestimo */}
                      <TableCell className="text-center flex justify-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="text-white bg-surface" onClick={() => handleUpdateClick(book.isbn)}>
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
                                <Button variant="outline" className="text-white bg-surface" onClick={() => handleUpdateClick(book.isbn)}>
                                  Alterar
                                </Button>
                              </SheetTrigger>
                              <SheetContent>
                                <SheetHeader>
                                  <SheetTitle>Editar livro</SheetTitle>
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
              <TableFooter>
                <TableRow className="bg-surfaceContainerLowest hover:bg-surfaceContainerLowest">
                  <TableCell colSpan={5}>
                    {/* Ação adicionar novo livro admin */}
                    {isAdmin && (
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button className="text-white rounded-xl bg-surfaceDim hover:bg-surfaceDim-foreground" onClick={limparCampos}>
                            Adicionar livro
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Adicionar livro</SheetTitle>
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
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Paginação */}

                    <Button className="mx-2 text-white bg-surfaceDim" size="icon" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="m-1 text-base">
                      {currentPage} / {totalPages}
                    </span>
                    <Button className="mx-2 text-white bg-surfaceDim" size="icon" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
        {/* Caixa de erro */}
        <div className="flex flex-col w-1/6">
          <div className="p-4 m-4 h-80 text-center rounded-md overflow-hidden bg-surface shadow-md shadow-surfaceDim text-slate-200">
              <h1 className="mb-4 font-rubik text-3xl">Sugestão</h1>
              <div className="flex ml-4 mb-2">
                <p className="font-bold mr-2">Titulo:</p>
                <p>{bookRandom.titulo}</p>
              </div>
              <div className="flex ml-4 mb-2">
                <p className="font-bold mr-2">Autor:</p>
                <p>{bookRandom.autor}</p>
              </div>
              <div className="flex ml-4 mb-2">
                <p className="font-bold mr-2">Categoria:</p>
                <p>{bookRandom.categoria}</p>
              </div>
          </div>
          <div className="m-4 mt-0 h-4/5 text-center rounded-xl text-slate-200 ">
            {error && (
              <Alert className="shadow-md shadow-surfaceDim">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

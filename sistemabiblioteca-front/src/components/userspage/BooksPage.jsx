import React, { useState, useEffect } from "react";
import UserService from "../service/UserService";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import bookbanner from "../../assets/bookbanner.png";

export default function Book({ isAdmin }) {
  const [BooksList, setBooksList] = useState([]);
  const [filteredBooksList, setFilteredBooksList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookRandom, setBookRandom] = useState([]);
  const [bookData, setBookData] = useState([]);
  const [loanData, setLoanData] = useState({
    alunoMatricula: "",
    isbn: "",
    status: "true",
  });

  const limparCampos = () => {
    setBookData({
      isbn: ""
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { bookIsbn } = useParams();
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

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

  useEffect(() => {
    setFilteredBooksList(
      BooksList.filter((book) => 
        [book.titulo, book.autor, book.isbn, book.categoria].some((field) => 
          field && field.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [searchTerm, BooksList]);

  const handleClickOpen = (book) => {
    setSelectedBook(book);
    setOpen(true);
  };

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
    setIsLoading(true);
    try {
      const response = await UserService.getAllBooks();
      setBooksList(response.ourBookList || []);
    } catch (error) {
      console.error("Erro ao buscar livro:", error);
      setError("Erro ao buscar livro");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
      
    }
  };

  const fetchBookDataByIsbn = async (bookIsbn) => {
    try {
      const token = localStorage.getItem("token");
      const response = await UserService.getBookByIsbn(bookIsbn, token);
      setBookData(response.book);
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
  const currentBooks = filteredBooksList.slice(indexOfFirstBook, indexOfLastBook); // Use filteredBooksList here
  const totalPages = Math.ceil(filteredBooksList.length / booksPerPage); // Use filteredBooksList length here

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <main className="h-screen flex flex-col items-center text-foreground">
      <div className="w-full h-0 pb-[12%] relative bg-gradient-to-b">
        <img
          src={bookbanner}
          alt="Imagem de topo"
          className="absolute top-0 left-0 w-full h-full object-cover saturate-50 shadow-lg shadow-black"
        />
      </div>
      <div>
        <div className="flex mt-12 w-full">
          {/* Descrição dos livro */}
          <aside className="w-1/6 p-4 m-4 mt-16 h-2/4 text-center rounded-md bg-surface text-slate-200 shadow-md shadow-surfaceDim">
            <h1 className="mb-4 font-rubik text-3xl">LIBRISYS</h1>
            <p className="font-karla">
              Librisys é um sistema de biblioteca desenvolvido para facilitar a visualização de livros e a gestão de empréstimos.
            </p>
          </aside>
          {/* Tabela de livro */}
          <div className="flex-1 p-4 ">
            <div className="flex justify-between mb-2">
              <Input
                type="text"
                placeholder="Pesquisar livros / Clique na linha para mais detalhes."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-1/3"
              />
            </div>
            <div className="overflow-x-auto  rounded-md shadow-md shadow-surfaceDim">
              <Table className="table-fixed">
                {isLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <Label className="flex text-center text-xl"><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Carregando...</Label>
                  </div>
                ) : (
                  <div>
                    <TableHeader>
                      <TableRow className="uppercase bg-surfaceDim hover:bg-surfaceDim">
                        <TableHead className="text-center" style={{ width: "13%" }}>Título</TableHead>
                        <TableHead className="text-center" style={{ width: "13%" }}>Autor</TableHead>
                        <TableHead className="text-center" style={{ width: "10%" }}>Editora</TableHead>
                        <TableHead className="text-center" style={{ width: "10%" }}>ISBN</TableHead>
                        <TableHead className="text-center" style={{ width: "10%" }}>Quantidade</TableHead>
                        <TableHead className="text-center" style={{ width: "18%" }}>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-surfaceDim-foreground ">
                      {
                        currentBooks.map((book) => (
                          <TableRow key={book.isbn} className="hover:bg-surfaceDim">
                            <TableCell className="text-center" onClick={() => handleClickOpen(book)}>{book.titulo}</TableCell>
                            <TableCell className="text-center" onClick={() => handleClickOpen(book)}>{book.autor}</TableCell>
                            <TableCell className="text-center" onClick={() => handleClickOpen(book)}>{book.editora}</TableCell>
                            <TableCell className="text-center" onClick={() => handleClickOpen(book)}>{book.isbn}</TableCell>
                            <TableCell className="text-center" onClick={() => handleClickOpen(book)}>{book.quantidade}</TableCell>
                            {/* Ação Emprestimo */}
                            <TableCell className="text-center flex justify-center space-x-2 ">

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
                                            <Label htmlFor="titulo" className="text-right">Título</Label>
                                            <Input type="text" name="titulo" value={bookData.titulo} onChange={handleInputChange} className="col-span-4" />
                                          </div>
                                          <div className="grid grid-cols-5 gap-4 items-center">
                                            <Label htmlFor="autor" className="text-right">Autor</Label>
                                            <Input type="text" name="autor" value={bookData.autor} onChange={handleInputChange} className="col-span-4" />
                                          </div>
                                          <div className="grid grid-cols-4 gap-4 items-center">
                                            <Label htmlFor="editora" className="text-right">Editora</Label>
                                            <Input type="text" name="editora" value={bookData.editora} onChange={handleInputChange} className="col-span-3" />
                                          </div>
                                          <div className="grid grid-cols-4 gap-4 items-center">
                                            <Label htmlFor="genero" className="text-right">Genero</Label>
                                            <Input type="text" name="genero" value={bookData.genero} onChange={handleInputChange} className="col-span-3" />
                                          </div>
                                          <div className="grid grid-cols-4 gap-4 items-center">
                                            <Label htmlFor="idioma" className="text-right">Idioma</Label>
                                            <Input type="text" name="idioma" value={bookData.idioma} onChange={handleInputChange} className="col-span-3" />
                                          </div>
                                          <div className="grid grid-cols-4 gap-4 items-center">
                                            <Label htmlFor="descricao" className="text-right">Descrição</Label>
                                            <Input type="text" name="descricao" value={bookData.descricao} onChange={handleInputChange} className="col-span-3" />
                                          </div>
                                          <div className="grid grid-cols-5 gap-4 items-center">
                                            <Label htmlFor="isbn" className="text-right">ISBN</Label>
                                            <Input type="number" name="isbn" value={bookData.isbn} onChange={handleInputChange} className="col-span-4" />
                                          </div>
                                          <div className="grid grid-cols-5 gap-4 items-center">
                                            <Label htmlFor="isbn_10" className="text-right">ISBN 10*</Label>
                                            <Input type="number" name="isbn_10" value={bookData.isbn_10} onChange={handleInputChange} className="col-span-4" />
                                          </div>
                                          <div className="grid grid-cols-4 gap-4 items-center">
                                            <Label htmlFor="paginas" className="text-right">Paginas</Label>
                                            <Input type="number" name="paginas" value={bookData.paginas} onChange={handleInputChange} className="col-span-3" />
                                          </div>
                                          <div className="grid grid-cols-4 gap-4 items-center">
                                            <Label htmlFor="ano" className="text-right">Ano</Label>
                                            <Input type="number" name="ano" value={bookData.ano} onChange={handleInputChange} className="col-span-3" />
                                          </div>
                                          <div className="grid grid-cols-4 gap-4 items-center">
                                            <Label htmlFor="rating" className="text-right">Avaliação</Label>
                                            <Input type="number" name="rating" value={bookData.rating} onChange={handleInputChange} className="col-span-3" />
                                          </div>
                                          <div className="grid grid-cols-4 gap-4 items-center">
                                            <Label htmlFor="quantidade" className="text-right">Quantidade</Label>
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
                        ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow className="bg-surfaceContainerLowest hover:bg-surfaceContainerLowest">
                        <TableCell colSpan={5}>
                          {/* Ação adicionar novo livro admin */}
                          {isAdmin && (
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button className="text-white rounded-xl bg-surfaceDim hover:bg-surfaceDim-foreground" onClick={limparCampos}>
                                  Cadastrar livro
                                </Button>
                              </SheetTrigger>
                              <SheetContent>
                                <SheetHeader>
                                  <SheetTitle>Cadastrar livro</SheetTitle>
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
                                      <Label htmlFor="autor" className="text-right">Autor</Label>
                                      <Input type="text" name="autor" value={bookData.autor} onChange={handleInputChange} className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="editora" className="text-right">Editora</Label>
                                      <Input type="text" name="editora" value={bookData.editora} onChange={handleInputChange} className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="genero" className="text-right">Genero</Label>
                                      <Input type="text" name="genero" value={bookData.genero} onChange={handleInputChange} className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="idioma" className="text-right">Idioma</Label>
                                      <Input type="text" name="idioma" value={bookData.idioma} onChange={handleInputChange} className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="descricao" className="text-right">Descrição</Label>
                                      <Input type="text" name="descricao" value={bookData.descricao} onChange={handleInputChange} className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="isbn" className="text-right">ISBN 13</Label>
                                      <Input type="number" name="isbn" value={bookData.isbn} onChange={handleInputChange} className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="isbn_10" className="text-right">ISBN 10*</Label>
                                      <Input type="number" name="isbn_10" value={bookData.isbn_10} onChange={handleInputChange} className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="paginas" className="text-right">Paginas</Label>
                                      <Input type="number" name="paginas" value={bookData.paginas} onChange={handleInputChange} className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="ano" className="text-right">Ano</Label>
                                      <Input type="number" name="ano" value={bookData.ano} onChange={handleInputChange} className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="rating" className="text-right">Avaliação</Label>
                                      <Input type="number" name="rating" value={bookData.rating} onChange={handleInputChange} className="col-span-3" required />
                                    </div>                            
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="quantidade" className="text-right">Quantidade</Label>
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
                  </div>
                )}
              </Table>
            </div>
          </div>
          {/* Caixa de erro */}
          <aside className="w-1/6 p-4 m-4 mt-16 h-2/4 rounded-md bg-surface text-slate-200 shadow-md shadow-surfaceDim">
            <h1 className="mb-4 font-rubik text-3xl text-center">Sugestão</h1>
            <div className="flex ml-4 mb-2">
              <p className="font-bold mr-2">Titulo:</p>
              <p>{bookRandom.titulo}</p>
            </div>
            <div className="flex ml-4 mb-2">
              <p className="font-bold mr-2">Autor:</p>
              <p>{bookRandom.autor}</p>
            </div>
            <div className="flex ml-4 mb-2">
              <p className="font-bold mr-2">Isbn:</p>
              <p>{bookRandom.isbn}</p>
            </div>
          </aside>
        </div>
        <div className="flex m-4 mt-0 h-24 text-center justify-center rounded-xl text-slate-200 ">
          {error && (
            <Alert className="shadow-md shadow-surfaceDim w-1/4">
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do Livro</DialogTitle>
              <DialogDescription>
                Saiba mais sobre o livro.
              </DialogDescription>
            </DialogHeader>
            {selectedBook && (
              <div>
                <div className="flex justify-center mb-4">
                  <Label htmlFor="titulo" className="text-left">{selectedBook.titulo} </Label>
                </div>
                <div className="flex">
                  <Label htmlFor="descricao" className="text-left">{selectedBook.descricao} </Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Label htmlFor="editora" className="text-left text-lg font-bebas">EDITORA:</Label>
                  <Label htmlFor="editora" className="text-left font-medium">{selectedBook.editora} </Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Label htmlFor="idioma" className="text-left text-lg font-bebas">Idioma:</Label>
                  <Label htmlFor="idioma" className="text-left">{selectedBook.idioma} </Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Label htmlFor="ano" className="text-left text-lg font-bebas">Ano:</Label>
                  <Label htmlFor="ano" className="text-left">{selectedBook.ano} </Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Label htmlFor="paginas" className="text-left text-lg font-bebas">Paginas:</Label>
                  <Label htmlFor="paginas" className="text-left">{selectedBook.paginas} </Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Label htmlFor="rating" className="text-left text-lg font-bebas">Avaliação:</Label>
                  <Label htmlFor="rating" className="text-left">{selectedBook.rating} </Label>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

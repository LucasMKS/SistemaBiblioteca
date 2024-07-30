import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChevronRight, ChevronLeft} from "lucide-react"

export default function ProfilePage({ isAdmin }) {
  const [BooksList, setBooksList] = useState([]); // Lista de livros
  const [error, setError] = useState(null); // Estado de erro
  const [bookData, setBookData] = useState({
    titulo: '',
    autor: '',
    isbn: '',
    categoria: '',
    quantidade: ''
  });

  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [booksPerPage] = useState(5); // Número de livros por página
  const navigate = useNavigate();
  const { bookIsbn } = useParams(); // Parâmetro de ISBN do livro

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await UserService.getAllBooks();
      console.log('Livros buscados:', response);
      setBooksList(response.ourBookList || []);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      setError('Erro ao buscar livros');
    }
  };

  useEffect(() => {
    if (bookIsbn) {
      fetchBookDataByIsbn(bookIsbn);
    }
  }, [bookIsbn]);

  const fetchBookDataByIsbn = async (bookIsbn) => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.getBookByIsbn(bookIsbn, token);
      const { titulo, autor, isbn, categoria, quantidade } = response.book;
      setBookData({ titulo, autor, isbn, categoria, quantidade });
    } catch (error) {
      console.error('Erro ao buscar dados do livro:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prevBookData) => ({
      ...prevBookData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await UserService.updateBook(bookData.isbn, bookData, token);
      console.log(res);
      fetchBooks();
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      alert('Erro ao atualizar livro');
    }
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await UserService.registerBook(bookData, token);
      console.log(res);
      fetchBooks();
      setBookData({
        titulo: '',
        autor: '',
        isbn: '',
        categoria: '',
        quantidade: ''
      });
    } catch (error) {
      console.error('Erro ao adicionar livro:', error);
      alert('Erro ao adicionar livro');
    }
  };

  const handleUpdateClick = async (isbn) => {
    await fetchBookDataByIsbn(isbn);
  };

  const deleteBook = async (bookIsbn) => {
    try {
      const confirmDelete = window.confirm('Deseja realmente deletar este livro??');
      const token = localStorage.getItem('token');
      if (confirmDelete) {
        await UserService.deleteBooks(bookIsbn, token);
        fetchBooks();
      }
    } catch (error) {
      console.error('Erro ao deletar livro:', error);
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
    <main className='h-screen flex flex-col items-center bg-background text-foreground'>
      <div className="w-full h-1/4 bg-gradient-to-b">
        <img src="https://images.pexels.com/photos/775998/pexels-photo-775998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Imagem de topo"
         className="w-full h-full object-cover saturate-50 backdrop-saturate-200 shadow-xl shadow-gray-900" />
      </div>

      {isAdmin && (
        <Sheet>
          <SheetTrigger asChild className="mt-12">
            <Button variant="link" className="text-white">Adicionar Novo Livro</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Adicionar Livro</SheetTitle>
              <SheetDescription>
                Adicione informações do novo livro. Clique em salvar quando terminar.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleNewSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="titulo" className="text-right">
                    Título
                  </Label>
                  <Input type="text" name="titulo" value={bookData.titulo} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="autor" className="text-right">
                    Autor
                  </Label>
                  <Input type="text" name="autor" value={bookData.autor} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isbn" className="text-right">
                    ISBN
                  </Label>
                  <Input type="number" name="isbn" value={bookData.isbn} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoria" className="text-right">
                    Categoria
                  </Label>
                  <Input type="text" name="categoria" value={bookData.categoria} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantidade" className="text-right">
                    Quantidade
                  </Label>
                  <Input type="number" name="quantidade" value={bookData.quantidade} onChange={handleInputChange} className="col-span-3" />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline" type="submit" className="bg-gray-200 text-black" >Salvar Alterações</Button>
                  
                </SheetClose>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      )}

      <div className="flex mt-12">
        <div className="w-1/4 p-4 m-4 text-center pb-2 rounded-md overflow-hidden border bg-background text-slate-200">
          <h1 className="text-2xl font-bold mb-4">Livros</h1>
          <p>Nesta seção, você encontrará uma ampla seleção de livros. Cada livro é apresentado com informações detalhadas, incluindo título, autor, ISBN, categoria e quantidade disponível. </p>
        </div>
        
        <div className="w-11/12 pb-2 rounded-md overflow-hidden border bg-secondary-foreground text-black">
          <div className="overflow-x-auto">
          <Table className="shadow-md table-fixed w-full rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center text-black" style={{ width: '2%' }}>ID</TableHead>
                <TableHead className="text-center text-black" style={{ width: '15%' }}>Título</TableHead>
                <TableHead className="text-center text-black" style={{ width: '13%' }}>Autor</TableHead>
                <TableHead className="text-center text-black" style={{ width: '15%' }}>Categoria</TableHead> 
                <TableHead className="text-center text-black" style={{ width: '10%' }}>ISBN</TableHead>
                <TableHead className="text-center text-black" style={{ width: '10%' }}>Quantidade</TableHead>
                <TableHead className="text-center text-black" style={{ width: '15%' }} >Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBooks.length > 0 ? (
                currentBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="text-center">{book.id}</TableCell>
                    <TableCell className="text-center">{book.titulo}</TableCell>
                    <TableCell className="text-center">{book.autor}</TableCell>
                    <TableCell className="text-center">{book.categoria}</TableCell>
                    <TableCell className="text-center">{book.isbn}</TableCell>
                    <TableCell className="text-center">{book.quantidade}</TableCell>
                    {isAdmin && (
                      <TableCell className="text-center text-white justify-center flex">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline" onClick={() => handleUpdateClick(book.isbn)}>Alterar</Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Editar Livro</SheetTitle>
                              <SheetDescription>
                                Faça alterações no seu perfil aqui. Clique em salvar quando terminar.
                              </SheetDescription>
                            </SheetHeader>
                            <form onSubmit={handleSubmit}>
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
                                  <Button variant="outline" type="submit" className="bg-gray-200 text-black">Salvar Alterações</Button>
                                </SheetClose>
                              </SheetFooter>
                            </form>
                          </SheetContent>
                        </Sheet>
                        <Button className="ml-2" variant="destructive" onClick={() => deleteBook(book.isbn)}>Deletar</Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="6" className="text-center">Nenhum livro encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="text-end mt-4 px-4">
        <span>Página {currentPage} de {totalPages}</span>
          <Button className="mx-2 text-white" variant="outline" size="icon" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button  className="mx-2 text-white" variant="outline" size="icon" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
             <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        </div>
        <div className="w-1/4 p-4 text-center bg-background text-foreground">
          <p>Texto ao lado direito da tabela</p>
        </div>
      </div>
    </main>
  );
}

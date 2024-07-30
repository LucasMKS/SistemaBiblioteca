import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../service/UserService";
import { LogIn, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import amicoImg from "../../assets/Library-amico.svg";
import broImg from "../../assets/Library-bro.svg";
import cuateImg from "../../assets/Library-cuate.svg";
import panaImg from "../../assets/Library-pana.svg";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores

    try {
        const userData = await UserService.login(email, password);

        if (userData.token) {
            localStorage.setItem("token", userData.token);
            localStorage.setItem("role", userData.role);
            onLogin();
            navigate("/books");
        } else {
            setError(userData.mensagem);
        }
    } catch (error) {
        setError(error.response?.data?.mensagem || "Erro ao fazer login");
    }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await UserService.register(userData);
      console.log(res);
      if (res.statusCode === 200) {
        setUserData({
          name: "",
          email: "",
          password: "",
        });
      } else {
        setError(res.mensagem);
      }
    } catch (error) {
      setError(error.response?.data?.mensagem || "Erro ao cadastrar");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <main className="h-screen flex w-full">
      <section className="flex flex-col items-center justify-center bg-background h-full max-w-3xl w-full p-4">
        <Card className="w-3/5">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tighter text-center">
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email" className="text-lg flex">
                  Email
                  <Mail className="ml-2" />
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="mt-2"
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="password" className="text-lg flex">
                  Password <LockKeyhole className="ml-2" />
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="mt-2"
                />
              </div>
              <Button type="submit" className="mt-6 w-full">
                Entrar
                <LogIn className="ml-2" />
              </Button>
            </form>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-6 w-full">
                  Cadastrar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar</DialogTitle>
                  <DialogDescription>
                    Cadastre-se no sistema bibliotecário. Sua matrícula poderá
                    ser conferida no perfil após logado.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleNewSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nome
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Senha
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="submit">Cadastrar</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
          <CardFooter>
          {error && (
              <Alert>
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </Card>
      </section>
      <div className="bg-secondary-foreground w-full h-full flex flex-col items-center justify-center p-16">
        <div>
          <h1 className="text-4xl font-bold text-center text-primary">
            Sistema Bibliotecário
          </h1>
        </div>
        <Carousel
          className="w-full max-w-xl"
          plugins={[Autoplay({ delay: 3500 })]}
        >
          <CarouselContent>
            <CarouselItem>
              <div className="flex aspect-square bh-background rounded p-8">
                <img src={amicoImg} alt="Sistema Bibliotecario" />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="flex aspect-square bh-background rounded p-8">
                <img src={broImg} alt="Sistema Bibliotecario" />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="flex aspect-square bh-background rounded p-8">
                <img src={cuateImg} alt="Sistema Bibliotecario" />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="flex aspect-square bh-background rounded p-8">
                <img src={panaImg} alt="Sistema Bibliotecario" />
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </main>
  );
}

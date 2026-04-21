import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Mail, Lock, User, Loader } from "lucide-react";
import { useAppDispatch } from "@/hooks/hooks";
import { useSignIn, useSignUp } from "@/api/authApi";
import { toast } from "sonner";
import { setUser } from "@/redux/slice/authSlice";

interface IFormData {
  fullName: string;
  email: string;
  password: string;
  role: string;
  imageUrl: string;
}

export default function AuthComponent() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<IFormData>({
    fullName: "",
    email: "",
    password: "",
    role: "",
    imageUrl: "",
  });

  const dispatch = useAppDispatch();

  const { mutateAsync: login, isPending: isLoginLoading } = useSignIn();
  const { mutateAsync: register, isPending: isRegisterLoading } = useSignUp();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      try {
        const imageUrl = URL.createObjectURL(file);
        setFormData((prevData) => ({
          ...prevData,
          imageUrl,
        }));
        setUploadImage(file);
        e.target.value = "";
      } catch (error) {
        console.error("Error creating object URL:", error);
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const loginData = new FormData();
    loginData.append("email", email);
    loginData.append("password", password);

    const response = await login(loginData);
    dispatch(setUser(response));
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadImage) {
      toast.error("No image uploaded");
      return;
    }

    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    const signUpData = new FormData();
    signUpData.append("fullName", formData.fullName);
    signUpData.append("email", formData.email);
    signUpData.append("password", formData.password);
    signUpData.append("imageUrl", uploadImage);

    const response = await register(signUpData);
    dispatch(setUser(response));
  };

  return (
    <Dialog>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-lg">
          Log In
        </Button>
      </DialogTrigger>

      {/* Content */}
      <DialogContent className="sm:max-w-md bg-card border-border text-card-foreground rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">
            Welcome to Buyzaar!
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Please log in to your account or sign up to get started.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <Tabs defaultValue="login" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-muted rounded-lg p-1">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login">
            <form className="space-y-4 mt-6" onSubmit={handleLoginSubmit}>
              <div className="grid gap-2 w-full">
                <Label htmlFor="email" className="text-foreground">
                  Email ID
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-500" />
                  <Input
                    id="email"
                    placeholder="Enter your Email ID"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background border-input rounded-lg text-foreground focus:border-violet-500 focus:ring-violet-500"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2 w-full">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-500" />
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 bg-background border-input rounded-lg text-foreground focus:border-violet-500 focus:ring-violet-500"
                    required
                  />
                </div>
              </div>

              <DialogFooter className="flex justify-between mt-6">
                <DialogClose asChild>
                  <Button variant="secondary" className="rounded-lg">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isLoginLoading}>
                  {isLoginLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Log In"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* SIGNUP */}
          <TabsContent value="signup">
            <form className="space-y-3 mt-6" onSubmit={handleSignUpSubmit}>
              {/* Avatar Upload */}

              <div className="flex justify-center">
                <input
                  type="file"
                  id="fileInput"
                  name="imageUrl"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer w-24 h-24 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center transition duration-300 ease-in-out hover:bg-gray-100"
                  aria-label="Upload Image"
                >
                  {uploadImage ? (
                    <img
                      src={formData.imageUrl}
                      alt="Uploaded"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-muted-foreground text-center">
                      Upload Image
                    </span>
                  )}
                </label>
              </div>

              <div className="grid gap-2 w-full">
                <Label htmlFor="fullName" className="text-foreground">
                  FullName
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-500" />
                  <Input
                    id="fullName"
                    placeholder="Enter your Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="pl-10 bg-background border-input rounded-lg text-foreground focus:border-violet-500 focus:ring-violet-500"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="pl-10 bg-background border-input rounded-lg text-foreground focus:border-violet-500 focus:ring-violet-500"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500 w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pl-10 bg-background border-input rounded-lg text-foreground focus:border-violet-500 focus:ring-violet-500"
                    required
                  />
                </div>
              </div>

              <DialogFooter className="flex justify-between mt-6">
                <DialogClose asChild>
                  <Button variant="secondary" className="rounded-lg">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isRegisterLoading}>
                  {isRegisterLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

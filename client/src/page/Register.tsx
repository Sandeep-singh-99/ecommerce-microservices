import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader, ArrowLeft, ImagePlus } from 'lucide-react';
import { useAppDispatch } from '@/hooks/hooks';
import { useSignUp } from '@/api/authApi';
import { setUser } from '@/redux/slice/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    imageUrl: ''
  });
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mutateAsync: register, isPending } = useSignUp();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      try {
        const imageUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, imageUrl }));
        setUploadImage(file);
      } catch (error) {
        console.error("Error creating object URL:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!uploadImage) {
      toast.error('Please upload a profile image');
      return;
    }

    const signUpData = new FormData();
    signUpData.append('fullName', formData.fullName);
    signUpData.append('email', formData.email);
    signUpData.append('password', formData.password);
    signUpData.append('imageUrl', uploadImage);

    try {
      const response = await register(signUpData);
      dispatch(setUser(response));
      navigate('/');
    } catch (error) {
      // Error handled by mutate
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background p-4 py-12">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden relative">
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
        </div>
        
        <div className="p-8 pt-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500 mb-2">
              Create Account
            </h1>
            <p className="text-muted-foreground">Join Buyzaar and start shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-6">
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
                className="cursor-pointer w-24 h-24 rounded-full border-2 border-dashed border-border flex items-center justify-center transition-colors hover:border-violet-500 hover:bg-muted relative overflow-hidden group"
              >
                {uploadImage ? (
                  <>
                    <img src={formData.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImagePlus className="h-6 w-6 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center">
                    <ImagePlus className="h-6 w-6 mb-1" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Upload</span>
                  </div>
                )}
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base shadow-lg shadow-primary/20 mt-6" disabled={isPending}>
              {isPending ? <Loader className="animate-spin h-5 w-5" /> : "Sign Up"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-500 font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

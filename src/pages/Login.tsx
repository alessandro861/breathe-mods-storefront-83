
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { LockKeyhole, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAdmin } from '@/hooks/useAdmin';
import { validateLogin, saveUserSession, getCurrentUser } from '@/services/userService';

// Define the validation schema
const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login: loginAsAdmin, isAdmin } = useAdmin();

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      navigate('/');
    }
  }, [navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);

    try {
      // Check if the login is for admin
      if (values.email === 'admin@gmail.com' && values.password === 'Admin1234!') {
        console.log("Attempting admin login...");
        
        // Use the admin login function
        const success = loginAsAdmin('ADMIN1234!');
        
        if (success) {
          console.log("Admin login successful");
          
          // Save user session
          saveUserSession(values.email);
          
          toast({
            title: "Admin login successful!",
            description: "You now have administrative privileges.",
          });
          
          // Redirect to home page after successful login
          navigate("/admin");
          return;
        } else {
          console.error("Admin login failed");
          throw new Error("Admin login failed");
        }
      } else {
        // Regular user login flow
        console.log("Attempting regular user login...");
        // Check if user exists and password is correct
        const isValid = validateLogin(values.email, values.password);
        
        if (isValid) {
          // Save user session
          saveUserSession(values.email);
          
          toast({
            title: "Login successful!",
            description: "Welcome back to the mods community.",
          });
          
          // Redirect to home page after successful login
          navigate("/");
        } else {
          throw new Error("Invalid credentials");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="container max-w-md mx-auto py-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">Log in to your account</p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          type="email" 
                          placeholder="Enter your email" 
                          className="pl-10" 
                          disabled={isLoading}
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          className="pl-10" 
                          disabled={isLoading}
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Login;

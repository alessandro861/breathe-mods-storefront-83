
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { LockKeyhole, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateResetToken, resetPassword } from '@/services/userService';

// Define the validation schema
const resetPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Extract email and token from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  // Validate the token on component mount
  const isValid = email && token ? validateResetToken(email, token) : false;

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!email || !token || !isValid) {
      toast({
        variant: "destructive",
        title: "Lien invalide",
        description: "Le lien de réinitialisation est invalide ou a expiré.",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Update the password
      const success = resetPassword(email, token, values.password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (success) {
        setIsSuccessful(true);
        toast({
          title: "Mot de passe réinitialisé",
          description: "Votre mot de passe a été réinitialisé avec succès.",
        });
      } else {
        throw new Error("Failed to reset password");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Réinitialisation échouée",
        description: "Une erreur s'est produite. Veuillez réessayer.",
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
          <h1 className="text-3xl font-bold mb-2">Réinitialiser votre mot de passe</h1>
          <p className="text-gray-400">Créez un nouveau mot de passe pour votre compte</p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          {!isValid && !isSuccessful ? (
            <div className="text-center py-6">
              <div className="mb-4 text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lien invalide</h3>
              <p className="text-gray-400 mb-6">
                Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.
              </p>
              <Link to="/forgot-password">
                <Button>Demander un nouveau lien</Button>
              </Link>
            </div>
          ) : isSuccessful ? (
            <div className="text-center py-6">
              <div className="mb-4 text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mot de passe réinitialisé</h3>
              <p className="text-gray-400 mb-6">
                Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
              <Link to="/login">
                <Button>Se connecter</Button>
              </Link>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouveau mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            type="password" 
                            placeholder="Entrez votre nouveau mot de passe" 
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            type="password" 
                            placeholder="Confirmez votre nouveau mot de passe" 
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-primary hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default ResetPassword;

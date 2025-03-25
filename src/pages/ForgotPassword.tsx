
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateResetToken } from '@/services/userService';

// Define the validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetCode, setResetCode] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);

    try {
      // Generate a reset token if the user exists
      const token = generateResetToken(values.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      
      // In a real application, we would send an email with the reset link
      // For demo purposes, we'll display the token on screen if the user exists
      setResetCode(token);
      
      toast({
        title: "Lien de réinitialisation envoyé",
        description: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation de mot de passe.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Demande échouée",
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
          <p className="text-gray-400">Nous vous enverrons un lien pour réinitialiser votre mot de passe</p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          {!isSubmitted ? (
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
                            placeholder="Entrez votre email" 
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
                  {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center py-4">
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
              <h3 className="text-xl font-semibold mb-2">Vérifiez votre email</h3>
              <p className="text-gray-400 mb-4">
                Nous avons envoyé un lien de réinitialisation de mot de passe à votre adresse email.
              </p>
              
              {resetCode && (
                <div className="mb-4 p-3 bg-gray-800 rounded-md">
                  <p className="text-sm text-gray-300 mb-1">Pour démonstration uniquement :</p>
                  <p className="font-mono text-green-400 select-all break-all">{resetCode}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Dans une application réelle, ce code serait envoyé par email
                  </p>
                </div>
              )}
              
              <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                Essayer avec un autre email
              </Button>
            </div>
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

export default ForgotPassword;

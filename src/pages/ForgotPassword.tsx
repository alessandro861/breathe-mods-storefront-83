
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateOTPCode } from '@/services/userService';

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
  const [otpCode, setOtpCode] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);

    try {
      // Generate an OTP code if the user exists
      const code = generateOTPCode(values.email);
      
      // Simulate API call (email sending)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      
      // For demo purposes, we'll show the OTP code
      if (code) {
        setOtpCode(code);
        setResetEmail(values.email);
      }
      
      toast({
        title: "Code de vérification envoyé",
        description: "Si un compte existe avec cet email, vous recevrez un code de vérification.",
      });
      
      // Redirect to OTP verification page
      navigate(`/verify-otp?email=${encodeURIComponent(values.email)}`);
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
          <p className="text-gray-400">Nous vous enverrons un code de vérification pour réinitialiser votre mot de passe</p>
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
                {isLoading ? "Envoi en cours..." : "Envoyer le code de vérification"}
              </Button>
              
              {otpCode && (
                <div className="mt-4 p-3 bg-gray-800 rounded-md">
                  <p className="text-sm text-gray-300 mb-1">Pour démonstration uniquement :</p>
                  <p className="font-mono text-green-400 select-all text-center text-2xl">{otpCode}</p>
                  <p className="text-xs text-gray-400 mt-1 text-center">
                    Dans une application réelle, ce code serait envoyé par email
                  </p>
                </div>
              )}
            </form>
          </Form>

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


import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateOTPCode, createResetTokenAfterOTP } from '@/services/userService';
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// Define the validation schema
const otpSchema = z.object({
  otp: z.string().min(6, {
    message: "Le code OTP doit contenir 6 chiffres.",
  }),
});

type OTPFormValues = z.infer<typeof otpSchema>;

const VerifyOTP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Extract email from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  
  useEffect(() => {
    // Redirect if no email in URL
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email manquant",
        description: "Veuillez demander un nouveau code de réinitialisation.",
      });
      navigate('/forgot-password');
    }
  }, [email, navigate, toast]);
  
  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: OTPFormValues) {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email manquant",
        description: "Veuillez demander un nouveau code de réinitialisation.",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Validate OTP
      const isValid = validateOTPCode(email, values.otp);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isValid) {
        // Create a reset token and redirect to reset password page
        const token = createResetTokenAfterOTP(email);
        navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${token}`);
        
        toast({
          title: "Code vérifié",
          description: "Vous pouvez maintenant réinitialiser votre mot de passe.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Code invalide",
          description: "Le code saisi est invalide ou a expiré.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Vérification échouée",
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
          <h1 className="text-3xl font-bold mb-2">Vérification du code</h1>
          <p className="text-gray-400">
            Entrez le code à 6 chiffres envoyé à {email ? email : "votre email"}
          </p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code de vérification</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        render={({ slots }) => (
                          <InputOTPGroup className="gap-2 justify-center">
                            {slots.map((slot, i) => (
                              <InputOTPSlot 
                                key={i} 
                                className="w-12 h-12 text-lg" 
                                {...slot} 
                                index={i}
                              />
                            ))}
                          </InputOTPGroup>
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Vérification en cours..." : "Vérifier le code"}
              </Button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400 mb-2">
                  Vous n'avez pas reçu de code ?
                </p>
                <Link to={`/forgot-password`}>
                  <Button variant="link" size="sm">
                    Demander un nouveau code
                  </Button>
                </Link>
              </div>
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

export default VerifyOTP;

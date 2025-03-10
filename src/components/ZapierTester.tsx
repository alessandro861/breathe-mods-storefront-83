
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Zap, Info } from 'lucide-react';

interface ZapierTesterProps {
  className?: string;
}

const ZapierTester: React.FC<ZapierTesterProps> = ({ className }) => {
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem('zapier-webhook-url') || '';
  });
  const [discordUsername, setDiscordUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast({
        title: "URL manquante",
        description: "Veuillez entrer l'URL du webhook Zapier",
        variant: "destructive",
      });
      return;
    }

    if (!discordUsername) {
      toast({
        title: "Nom d'utilisateur manquant",
        description: "Veuillez entrer un nom d'utilisateur Discord",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("[Zapier Test] Sending test request to:", webhookUrl);
      console.log("[Zapier Test] Discord username:", discordUsername);
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Important pour éviter les erreurs CORS
        body: JSON.stringify({
          discordUsername: discordUsername,
          timestamp: new Date().toISOString(),
          action: "test_zapier_integration",
          source: "zapier_tester_component"
        }),
      });
      
      console.log("[Zapier Test] Request sent");
      
      // Comme nous utilisons no-cors, on ne peut pas avoir de statut de réponse
      toast({
        title: "Requête envoyée",
        description: "La requête a été envoyée à Zapier. Vérifiez l'historique de votre Zap pour confirmer qu'elle a été traitée.",
      });
      
      // Enregistrer l'URL pour une utilisation future
      localStorage.setItem('zapier-webhook-url', webhookUrl);
      
    } catch (error) {
      console.error("[Zapier Test] Error:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de l'envoi de la requête",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" /> 
          Testeur d'intégration Zapier
        </CardTitle>
        <CardDescription>
          Testez votre webhook Zapier pour l'attribution de rôles Discord
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleTest} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="zapierWebhookUrl">URL du Webhook Zapier</Label>
            <Input
              id="zapierWebhookUrl"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.zapier.com/hooks/catch/..."
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Entrez l'URL du webhook fournie par Zapier lors de la configuration de votre Zap.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="discordUsername">Nom d'utilisateur Discord</Label>
            <Input
              id="discordUsername"
              value={discordUsername}
              onChange={(e) => setDiscordUsername(e.target.value)}
              placeholder="Votre nom d'utilisateur Discord"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Entrez un nom d'utilisateur Discord pour tester l'attribution de rôle.
            </p>
          </div>
          
          <div className="bg-blue-500/10 p-3 rounded-md flex items-start space-x-2">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium text-blue-600">Important</p>
              <p className="mt-1 text-xs">
                Dans Zapier, assurez-vous d'utiliser <code className="bg-gray-100 rounded px-1">{'{{data.discordUsername}}'}</code> pour récupérer le nom d'utilisateur 
                Discord envoyé par cette application.
              </p>
            </div>
          </div>
        </form>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleTest} 
          disabled={isLoading || !webhookUrl || !discordUsername}
          className="w-full"
        >
          {isLoading ? "Envoi en cours..." : "Tester le webhook Zapier"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ZapierTester;

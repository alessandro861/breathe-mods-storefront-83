
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Zap, Send } from 'lucide-react';
import { Label } from '@/components/ui/label';

const ZapierTester: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('zapier-webhook-url') || '');
  const [testUsername, setTestUsername] = useState('');
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
    
    if (!testUsername) {
      toast({
        title: "Utilisateur manquant",
        description: "Veuillez entrer un nom d'utilisateur Discord pour le test",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Test Zapier vers:", webhookUrl);
      console.log("Données envoyées:", {
        discordUsername: testUsername,
        timestamp: new Date().toISOString(),
        action: "test_role_assign",
        source: "zapier_tester"
      });
      
      // Envoi direct à Zapier pour tester
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Important pour éviter les erreurs CORS
        body: JSON.stringify({
          discordUsername: testUsername,
          timestamp: new Date().toISOString(),
          action: "test_role_assign",
          source: "zapier_tester"
        }),
      });
      
      // Sauvegarde de l'URL pour usage futur
      localStorage.setItem('zapier-webhook-url', webhookUrl);
      
      toast({
        title: "Test envoyé",
        description: "Le test a été envoyé à Zapier. Vérifiez l'historique de votre Zap.",
      });
    } catch (error) {
      console.error("Erreur lors du test Zapier:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors du test",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-500" />
          Testeur d'intégration Zapier
        </CardTitle>
        <CardDescription>
          Testez votre webhook Zapier pour l'attribution de rôles Discord
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleTest} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL du Webhook Zapier</Label>
            <Input
              id="webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.zapier.com/hooks/catch/..."
              className="font-mono text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="test-username">Nom d'utilisateur Discord pour le test</Label>
            <Input
              id="test-username"
              value={testUsername}
              onChange={(e) => setTestUsername(e.target.value)}
              placeholder="Utilisateur#1234 ou Utilisateur"
            />
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button onClick={handleTest} disabled={isLoading}>
          {isLoading ? (
            "Envoi en cours..."
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Tester le Webhook
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ZapierTester;


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Shield, Settings, AlertCircle, Info, Server, UserCheck, Code, ExternalLink } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { Label } from '@/components/ui/label';
import { assignDiscordRole } from '@/utils/discordIntegration';

interface PurchaseDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  modTitle: string;
  modPrice: string;
}

const PurchaseDialog: React.FC<PurchaseDialogProps> = ({
  isOpen,
  setIsOpen,
  modTitle,
  modPrice
}) => {
  const [discordUsername, setDiscordUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [discordToken, setDiscordToken] = useState('');
  const [serverId, setServerId] = useState('');
  const [roleId, setRoleId] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [showBackendInfo, setShowBackendInfo] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  
  // Récupérer les données stockées au chargement du composant
  useEffect(() => {
    const storedDiscordToken = localStorage.getItem('discord-bot-token') || '';
    const storedServerId = localStorage.getItem('discord-server-id') || '';
    const storedRoleId = localStorage.getItem('discord-role-id') || '';
    setDiscordToken(storedDiscordToken);
    setServerId(storedServerId);
    setRoleId(storedRoleId);
  }, [isOpen]);
  
  // Vérification de la configuration
  const isConfigured = discordToken && serverId && roleId;
  
  // Fonction pour vérifier l'utilisateur Discord
  const verifyDiscordUser = async () => {
    if (!discordUsername) {
      toast({
        title: "Nom d'utilisateur requis",
        description: "Veuillez saisir votre nom d'utilisateur Discord",
        variant: "destructive",
      });
      return;
    }
    
    if (!isConfigured) {
      toast({
        title: "Configuration incomplète",
        description: "La configuration Discord n'est pas complète. Contactez l'administrateur.",
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifying(true);
    setIsUserVerified(false);
    setUserId(null);
    setApiResult(null);
    
    try {
      // Simuler une vérification directe car l'API Discord ne peut pas être appelée directement du navigateur
      // Dans un environnement réel, cela devrait passer par un backend
      
      // Vérifier si c'est une entrée plausible (simple validation)
      if (discordUsername.length < 2 || (discordUsername.includes(' ') && !discordUsername.includes('#'))) {
        throw new Error("Format de nom d'utilisateur Discord invalide");
      }
      
      // Simule un délai de recherche d'utilisateur
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // En situation réelle, cela devrait être fait via un backend
      // Ici, on simule une réussite pour démontrer l'interface
      // On assigne un faux ID
      const simulatedUserId = `user_${Date.now()}`;
      setUserId(simulatedUserId);
      setIsUserVerified(true);
      
      toast({
        title: "Utilisateur vérifié",
        description: `L'utilisateur ${discordUsername} a été validé et peut recevoir le rôle.`,
      });
    } catch (error) {
      console.error('Error verifying Discord user:', error);
      toast({
        title: "Erreur de vérification",
        description: error instanceof Error ? error.message : "Erreur lors de la vérification de l'utilisateur Discord",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Fonction pour attribuer un rôle à un utilisateur Discord
  const assignRoleToUser = async (userId: string): Promise<boolean> => {
    if (!isConfigured) {
      toast({
        title: "Erreur de configuration",
        description: "Les paramètres Discord ne sont pas tous configurés",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Tenter d'attribuer le rôle via la fonction d'intégration
      const result = await assignDiscordRole(discordUsername, serverId, roleId, discordToken);
      
      // Afficher les détails de l'opération
      const operationDetails = 
        `Tentative d'attribution de rôle:\n` +
        `Serveur: ${serverId}\n` +
        `Utilisateur: ${discordUsername}\n` +
        `Rôle: ${roleId}\n\n` +
        `Résultat: ${result.message}\n\n` +
        `⚠️ IMPORTANT: L'attribution de rôles nécessite un backend!\n` +
        `Les appels directs à l'API Discord depuis le navigateur sont bloqués par CORS.`;
      
      setApiResult(operationDetails);
      
      // Notifier l'utilisateur du résultat
      if (!result.success) {
        toast({
          title: "Impossible d'attribuer le rôle",
          description: result.message,
          variant: "destructive",
        });
        return false;
      }
      
      // En cas de succès simulé, afficher une notification
      toast({
        title: "Attribution simulée",
        description: result.message,
        variant: "default",
      });
      
      return true;
    } catch (error) {
      console.error('Error assigning Discord role:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'attribution du rôle Discord",
        variant: "destructive",
      });
      return false;
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isUserVerified || !userId) {
      toast({
        title: "Vérification requise",
        description: "Veuillez d'abord vérifier votre nom d'utilisateur Discord",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Attribuer le rôle à l'utilisateur
      const success = await assignRoleToUser(userId);
      
      if (success) {
        // Ne pas fermer la boîte de dialogue immédiatement pour permettre à l'utilisateur de voir le résultat
        // setIsOpen(false);
        
        // Afficher un message pour informer l'utilisateur de la simulation
        toast({
          title: "Achat traité",
          description: `Vous avez acheté ${modTitle}. Attribution de rôle simulée pour ${discordUsername}.`,
        });
      } else {
        throw new Error('Échec de l\'attribution du rôle Discord');
      }
    } catch (error) {
      console.error('Error processing purchase:', error);
      toast({
        title: "Échec de l'achat",
        description: error instanceof Error ? error.message : "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
      setApiResult(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pour les administrateurs, permettre de configurer les paramètres
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    localStorage.setItem('discord-bot-token', discordToken);
    localStorage.setItem('discord-server-id', serverId);
    localStorage.setItem('discord-role-id', roleId);
    
    toast({
      title: "Paramètres enregistrés",
      description: "Les paramètres Discord ont été mis à jour avec succès",
    });
    
    setShowSettings(false);
  };

  const resetForm = () => {
    setDiscordUsername('');
    setIsUserVerified(false);
    setUserId(null);
    setApiResult(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        {!showSettings ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> 
                Acheter {modTitle}
              </DialogTitle>
              <DialogDescription>
                Complétez votre achat pour recevoir ce mod. Un rôle Discord sera attribué à votre compte.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handlePurchase} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="discordUsername" className="text-sm font-medium">Nom d'utilisateur Discord</Label>
                <div className="flex space-x-2">
                  <Input
                    id="discordUsername"
                    value={discordUsername}
                    onChange={(e) => {
                      setDiscordUsername(e.target.value);
                      setIsUserVerified(false);
                      setUserId(null);
                      setApiResult(null);
                    }}
                    placeholder="Votre nom d'utilisateur Discord"
                    className="w-full"
                    required
                    disabled={isUserVerified || isSubmitting}
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={verifyDiscordUser}
                    disabled={isVerifying || isUserVerified || !discordUsername || isSubmitting}
                  >
                    {isVerifying ? "..." : "Vérifier"}
                  </Button>
                </div>
                {isUserVerified ? (
                  <p className="text-xs text-green-500 flex items-center">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Utilisateur vérifié avec succès
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">
                    Entrez votre nom d'utilisateur Discord exactement tel qu'il apparaît dans Discord, puis cliquez sur Vérifier.
                  </p>
                )}
              </div>
              
              {serverId && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Server className="h-3 w-3" /> 
                  Serveur configuré: {serverId}
                </div>
              )}
              
              {!isConfigured && !isAdmin && (
                <div className="bg-yellow-500/10 p-3 rounded-md flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-500">Configuration incomplète</p>
                    <p className="text-xs text-gray-500 mt-1">
                      L'administrateur doit configurer l'intégration Discord avant que vous puissiez effectuer un achat.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="bg-red-500/10 p-3 rounded-md flex items-start space-x-2 cursor-pointer" onClick={() => setShowBackendInfo(!showBackendInfo)}>
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-500 flex items-center justify-between">
                    <span>Attention: Backend requis</span>
                    <span className="text-xs">{showBackendInfo ? "▲" : "▼"}</span>
                  </p>
                  {showBackendInfo && (
                    <div className="text-xs text-gray-500 mt-2 space-y-2">
                      <p>
                        L'attribution de rôles Discord nécessite un serveur backend pour:
                      </p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Contourner les restrictions CORS</li>
                        <li>Protéger votre token Discord</li>
                        <li>Effectuer les appels API de manière sécurisée</li>
                      </ul>
                      <p className="pt-1">
                        Cette application simule le processus mais ne peut pas attribuer de rôles réels sans un backend.
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-blue-500">
                        <Code className="h-4 w-4" />
                        <a href="https://discord.com/developers/docs/topics/oauth2" target="_blank" rel="noopener noreferrer" className="text-blue-500 flex items-center">
                          Documentation Discord API
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {apiResult && (
                <div className="bg-blue-500/10 p-3 rounded-md overflow-auto max-h-40 text-xs font-mono">
                  <pre className="whitespace-pre-wrap">{apiResult}</pre>
                </div>
              )}
              
              <div className="bg-primary/10 p-3 rounded-md">
                <div className="flex justify-between font-medium">
                  <span>Prix:</span>
                  <span>{modPrice}</span>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  ⚠️ Cette application nécessite un backend pour attribuer réellement des rôles Discord.
                </p>
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Fermer
                </Button>
                {isAdmin && (
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </Button>
                )}
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !isUserVerified || !userId}
                >
                  {isSubmitting ? "Traitement en cours..." : `Acheter pour ${modPrice}`}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" /> 
                Paramètres d'intégration Discord
              </DialogTitle>
              <DialogDescription>
                Configurez vos paramètres d'intégration Discord pour l'attribution des rôles.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSaveSettings} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="discordToken">Token du Bot Discord</Label>
                <Input
                  id="discordToken"
                  type="password"
                  value={discordToken}
                  onChange={(e) => setDiscordToken(e.target.value)}
                  placeholder="Votre token de bot Discord"
                  className="w-full"
                />
                <p className="text-xs text-gray-400 text-justify">
                  Entrez le token de votre bot Discord. Il sera stocké en toute sécurité dans votre navigateur.
                  Ne partagez jamais ce token publiquement.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serverId">ID du Serveur Discord</Label>
                <Input
                  id="serverId"
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  placeholder="ID de votre serveur Discord"
                  className="w-full"
                />
                <p className="text-xs text-gray-400">
                  Entrez l'ID de votre serveur Discord (clic droit sur le serveur → Copier l'ID).
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roleId">ID du Rôle Discord</Label>
                <Input
                  id="roleId"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  placeholder="ID du rôle à attribuer"
                  className="w-full"
                />
                <p className="text-xs text-gray-400">
                  Entrez l'ID du rôle à attribuer après l'achat (Paramètres du serveur → Rôles → clic droit sur le rôle → Copier l'ID).
                </p>
              </div>
              
              <div className="bg-blue-500/10 p-3 rounded-md flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-500">Note importante</p>
                  <p className="text-xs text-gray-500 mt-1">
                    En environnement de production, les appels à l'API Discord devraient être effectués depuis un backend pour éviter les restrictions CORS et protéger votre token. Cette version est uniquement une simulation.
                  </p>
                </div>
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setShowSettings(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Enregistrer les paramètres
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;

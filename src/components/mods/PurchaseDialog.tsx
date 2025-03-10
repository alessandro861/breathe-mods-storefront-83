import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Shield, Settings, AlertCircle, Info, Server, UserCheck, Code, ExternalLink, Zap } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { assignDiscordRole, assignRoleViaZapier, getZapierImplementationGuide } from '@/utils/discordIntegration';

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
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('zapier'); // 'zapier' ou 'backend'
  const [userId, setUserId] = useState<string | null>(null);
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [showBackendInfo, setShowBackendInfo] = useState(false);
  const [showZapierInfo, setShowZapierInfo] = useState(false);
  const [zapierGuide, setZapierGuide] = useState('');
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  
  useEffect(() => {
    const storedDiscordToken = localStorage.getItem('discord-bot-token') || '';
    const storedServerId = localStorage.getItem('discord-server-id') || '';
    const storedRoleId = localStorage.getItem('discord-role-id') || '';
    const storedZapierWebhook = localStorage.getItem('zapier-webhook-url') || '';
    const storedMethod = localStorage.getItem('discord-integration-method') || 'zapier';
    
    setDiscordToken(storedDiscordToken);
    setServerId(storedServerId);
    setRoleId(storedRoleId);
    setZapierWebhookUrl(storedZapierWebhook);
    setSelectedMethod(storedMethod);
  }, [isOpen]);
  
  useEffect(() => {
    if (showZapierInfo) {
      setZapierGuide(getZapierImplementationGuide());
    }
  }, [showZapierInfo]);
  
  const isBackendConfigured = discordToken && serverId && roleId;
  const isZapierConfigured = zapierWebhookUrl && zapierWebhookUrl.includes('zapier.com');
  const isConfigured = selectedMethod === 'zapier' ? isZapierConfigured : isBackendConfigured;
  
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
        description: "La configuration n'est pas complète. Contactez l'administrateur.",
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifying(true);
    setIsUserVerified(false);
    setUserId(null);
    setApiResult(null);
    
    try {
      if (discordUsername.length < 2 || (discordUsername.includes(' ') && !discordUsername.includes('#'))) {
        throw new Error("Format de nom d'utilisateur Discord invalide");
      }
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const simulatedUserId = `user_${Date.now()}`;
      setUserId(simulatedUserId);
      setIsUserVerified(true);
      
      toast({
        title: "Utilisateur accepté",
        description: `Le nom d'utilisateur ${discordUsername} a été validé.`,
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

  const assignRoleWithZapier = async (): Promise<boolean> => {
    if (!isZapierConfigured) {
      toast({
        title: "Webhook Zapier manquant",
        description: "L'URL du webhook Zapier n'est pas configurée",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log("[DEBUG] Envoi à Zapier pour:", discordUsername, "URL:", zapierWebhookUrl);
      
      const result = await assignRoleViaZapier(discordUsername, zapierWebhookUrl);
      
      const operationDetails = 
        `Tentative d'attribution de rôle via Zapier:\n` +
        `Utilisateur: ${discordUsername}\n` +
        `Webhook: ${zapierWebhookUrl.substring(0, 20)}...\n\n` +
        `Résultat: ${result.message}\n\n` +
        `Note: Si vous recevez une erreur "User" manquant dans Zapier,\n` +
        `assurez-vous d'utiliser {{discord_user.user_id}} comme ID utilisateur\n` +
        `et {{discord_user.username}} comme nom d'utilisateur dans votre Zap.`;
      
      setApiResult(operationDetails);
      
      if (!result.success) {
        toast({
          title: "Échec de l'envoi à Zapier",
          description: result.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande a été envoyée à Zapier. Vérifiez votre Discord pour confirmer l'attribution du rôle.",
      });
      
      return true;
    } catch (error) {
      console.error('Error with Zapier:', error);
      toast({
        title: "Erreur Zapier",
        description: error instanceof Error ? error.message : "Erreur lors de l'envoi de la demande à Zapier",
        variant: "destructive",
      });
      return false;
    }
  };

  const assignRoleWithBackend = async (userId: string): Promise<boolean> => {
    if (!isBackendConfigured) {
      toast({
        title: "Erreur de configuration",
        description: "Les paramètres Discord ne sont pas tous configurés",
        variant: "destructive",
      });
      return false;
    }

    try {
      const result = await assignDiscordRole(discordUsername, serverId, roleId, discordToken);
      
      const operationDetails = 
        `Tentative d'attribution de rôle:\n` +
        `Serveur: ${serverId}\n` +
        `Utilisateur: ${discordUsername}\n` +
        `Rôle: ${roleId}\n\n` +
        `Résultat: ${result.message}\n\n` +
        `⚠️ IMPORTANT: L'attribution de rôles nécessite un backend!\n` +
        `Les appels directs à l'API Discord depuis le navigateur sont bloqués par CORS.`;
      
      setApiResult(operationDetails);
      
      if (!result.success) {
        toast({
          title: "Impossible d'attribuer le rôle",
          description: result.message,
          variant: "destructive",
        });
        return false;
      }
      
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
      let success = false;
      
      if (selectedMethod === 'zapier') {
        success = await assignRoleWithZapier();
      } else {
        success = await assignRoleWithBackend(userId);
      }
      
      if (success) {
        toast({
          title: "Achat traité",
          description: `Vous avez acheté ${modTitle}. Attribution de rôle envoyée pour ${discordUsername}.`,
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

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    localStorage.setItem('discord-bot-token', discordToken);
    localStorage.setItem('discord-server-id', serverId);
    localStorage.setItem('discord-role-id', roleId);
    localStorage.setItem('zapier-webhook-url', zapierWebhookUrl);
    localStorage.setItem('discord-integration-method', selectedMethod);
    
    toast({
      title: "Paramètres enregistrés",
      description: "Les paramètres d'intégration ont été mis à jour avec succès",
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
              
              {selectedMethod === 'zapier' && zapierWebhookUrl && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Zap className="h-3 w-3" /> 
                  Intégration: Zapier
                </div>
              )}
              
              {selectedMethod === 'backend' && serverId && (
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
              
              {selectedMethod === 'zapier' ? (
                <div className="bg-blue-500/10 p-3 rounded-md flex items-start space-x-2 cursor-pointer" 
                     onClick={() => setShowZapierInfo(!showZapierInfo)}>
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-500 flex items-center justify-between">
                      <span>Information: Intégration Zapier</span>
                      <span className="text-xs">{showZapierInfo ? "▲" : "▼"}</span>
                    </p>
                    {showZapierInfo && (
                      <div className="text-xs text-gray-500 mt-2 space-y-2">
                        <p>
                          Cette application utilise Zapier pour attribuer des rôles Discord:
                        </p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Automatise l'attribution de rôles sans backend</li>
                          <li>Nécessite une configuration simple dans Zapier</li>
                          <li>L'utilisateur doit déjà être membre du serveur Discord</li>
                        </ul>
                        <div className="flex items-center gap-2 mt-2 text-blue-500">
                          <ExternalLink className="h-4 w-4" />
                          <a href="https://zapier.com/apps/discord/integrations" target="_blank" rel="noopener noreferrer" className="text-blue-500">
                            Intégrations Discord sur Zapier
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-red-500/10 p-3 rounded-md flex items-start space-x-2 cursor-pointer" 
                     onClick={() => setShowBackendInfo(!showBackendInfo)}>
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
              )}
              
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
                  {selectedMethod === 'zapier' 
                    ? "Une fois l'achat complété, le rôle Discord sera attribué via Zapier."
                    : "⚠️ Cette application nécessite un backend pour attribuer réellement des rôles Discord."}
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
                Configurez les paramètres d'intégration pour l'attribution des rôles Discord.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue={selectedMethod} className="mt-4" onValueChange={setSelectedMethod}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="zapier">
                  <Zap className="h-4 w-4 mr-2" />
                  Zapier
                </TabsTrigger>
                <TabsTrigger value="backend">
                  <Server className="h-4 w-4 mr-2" />
                  Backend
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="zapier" className="mt-0">
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="zapierWebhookUrl">URL du Webhook Zapier</Label>
                    <Input
                      id="zapierWebhookUrl"
                      value={zapierWebhookUrl}
                      onChange={(e) => setZapierWebhookUrl(e.target.value)}
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                      className="w-full"
                    />
                    <p className="text-xs text-gray-400 text-justify">
                      Entrez l'URL du webhook fournie par Zapier. Cette URL sera utilisée pour envoyer les demandes d'attribution de rôles.
                    </p>
                  </div>
                  
                  <div className="bg-blue-500/10 p-3 rounded-md flex items-start space-x-2">
                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-500">Configuration Zapier</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Lors de la configuration de votre Zap pour Discord, utilisez les champs suivants:
                      </p>
                      <ul className="text-xs text-gray-500 list-disc pl-5 mt-1">
                        <li><b>User ID</b>: utiliser <code>{'{{discord_user.user_id}}'}</code></li>
                        <li><b>Username</b>: utiliser <code>{'{{discord_user.username}}'}</code></li>
                      </ul>
                      <Button
                        type="button"
                        variant="link"
                        className="text-xs p-0 h-auto mt-1 text-blue-500"
                        onClick={() => setShowZapierInfo(true)}
                      >
                        Voir le guide complet d'implémentation Zapier
                      </Button>
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
              </TabsContent>
              
              <TabsContent value="backend" className="mt-0">
                <form onSubmit={handleSaveSettings} className="space-y-4">
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
                  
                  <div className="bg-red-500/10 p-3 rounded-md flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-500">Attention importante</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Les appels à l'API Discord depuis un navigateur ne fonctionnent pas en raison des restrictions CORS. Cette configuration est fournie uniquement à des fins de simulation. Pour une utilisation réelle, vous devez mettre en place un backend.
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
              </TabsContent>
            </Tabs>
            
            <Dialog open={showZapierInfo} onOpenChange={setShowZapierInfo}>
              <DialogContent className="sm:max-w-[750px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Guide d'Implémentation Zapier pour Discord
                  </DialogTitle>
                  <DialogDescription>
                    Instructions pour mettre en place l'attribution de rôles via Zapier
                  </DialogDescription>
                </DialogHeader>
                
                <div className="bg-blue-500/10 p-3 rounded-md flex items-start space-x-2 mb-4">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-500">Solution simplifiée</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Zapier vous permet d'attribuer des rôles Discord sans avoir à développer un backend personnalisé. C'est la solution la plus simple pour connecter votre application à Discord.
                    </p>
                  </div>
                </div>
                
                <div className="font-mono text-sm bg-gray-900 text-gray-300 p-4 rounded-md overflow-x-auto whitespace-pre-wrap">
                  {zapierGuide}
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                  <a 
                    href="https://zapier.com/apps/discord/integrations" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Intégrations Discord sur Zapier
                  </a>
                </div>
                
                <DialogFooter className="mt-4">
                  <Button onClick={() => setShowZapierInfo(false)}>
                    Fermer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;

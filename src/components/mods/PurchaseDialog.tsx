
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
import { Shield, Settings } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

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
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  
  // Récupérer les données stockées au chargement du composant
  useEffect(() => {
    if (isAdmin) {
      const storedDiscordToken = localStorage.getItem('discord-bot-token') || '';
      const storedServerId = localStorage.getItem('discord-server-id') || '';
      const storedRoleId = localStorage.getItem('discord-role-id') || '';
      setDiscordToken(storedDiscordToken);
      setServerId(storedServerId);
      setRoleId(storedRoleId);
    }
  }, [isAdmin]);
  
  // Fonction pour récupérer l'ID utilisateur Discord à partir du nom d'utilisateur
  const getDiscordUserId = async (username: string): Promise<string | null> => {
    if (!discordToken) {
      toast({
        title: "Erreur de configuration",
        description: "Le token Discord n'est pas configuré",
        variant: "destructive",
      });
      return null;
    }

    try {
      // Récupérer les membres du serveur
      const response = await fetch(`https://discord.com/api/v10/guilds/${serverId}/members?limit=1000`, {
        headers: {
          Authorization: `Bot ${discordToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Discord API error:', await response.text());
        throw new Error('Erreur lors de la recherche de l\'utilisateur sur Discord');
      }

      const members = await response.json();
      
      // Chercher l'utilisateur par son nom complet (inclut le discriminant #1234 si présent)
      const foundMember = members.find((member: any) => {
        const memberUsername = member.user.username;
        const memberGlobalName = member.user.global_name;
        
        return memberUsername === username || 
               memberGlobalName === username ||
               `${memberUsername}#${member.user.discriminator}` === username;
      });

      if (foundMember) {
        return foundMember.user.id;
      } else {
        throw new Error('Utilisateur non trouvé sur ce serveur Discord');
      }
    } catch (error) {
      console.error('Error finding Discord user:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la recherche de l'utilisateur Discord",
        variant: "destructive",
      });
      return null;
    }
  };

  // Fonction pour attribuer un rôle à un utilisateur Discord
  const assignRoleToUser = async (userId: string): Promise<boolean> => {
    if (!discordToken || !serverId || !roleId) {
      toast({
        title: "Erreur de configuration",
        description: "Les paramètres Discord ne sont pas tous configurés",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await fetch(`https://discord.com/api/v10/guilds/${serverId}/members/${userId}/roles/${roleId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${discordToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Discord API error:', await response.text());
        throw new Error('Erreur lors de l\'attribution du rôle Discord');
      }

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
    if (!discordUsername) {
      toast({
        title: "Nom d'utilisateur Discord requis",
        description: "Veuillez saisir votre nom d'utilisateur Discord pour recevoir votre rôle",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Récupérer l'ID utilisateur Discord
      const userId = await getDiscordUserId(discordUsername);
      
      if (!userId) {
        throw new Error('Impossible de trouver cet utilisateur Discord');
      }
      
      // Attribuer le rôle à l'utilisateur
      const success = await assignRoleToUser(userId);
      
      if (success) {
        setIsOpen(false);
        
        // Afficher un message de succès
        toast({
          title: "Achat réussi !",
          description: `Vous avez acheté ${modTitle}. Un rôle Discord a été attribué à ${discordUsername}.`,
        });
        
        // Réinitialiser le formulaire
        setDiscordUsername('');
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
                <label htmlFor="discordUsername" className="text-sm font-medium">Nom d'utilisateur Discord</label>
                <Input
                  id="discordUsername"
                  value={discordUsername}
                  onChange={(e) => setDiscordUsername(e.target.value)}
                  placeholder="ex: username ou username"
                  className="w-full"
                  required
                />
                <p className="text-xs text-gray-400">
                  Entrez votre nom d'utilisateur Discord exactement tel qu'il apparaît dans Discord.
                </p>
              </div>
              
              <div className="bg-primary/10 p-3 rounded-md">
                <div className="flex justify-between font-medium">
                  <span>Prix:</span>
                  <span>{modPrice}</span>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Après l'achat, vous recevrez un rôle Discord qui vous donnera accès au téléchargement du mod.
                </p>
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Annuler
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
                <Button type="submit" disabled={isSubmitting}>
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
                <label htmlFor="discordToken" className="text-sm font-medium">Token du Bot Discord</label>
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
                <label htmlFor="serverId" className="text-sm font-medium">ID du Serveur Discord</label>
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
                <label htmlFor="roleId" className="text-sm font-medium">ID du Rôle Discord</label>
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

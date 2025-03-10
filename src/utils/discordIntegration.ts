
/**
 * Fonction d'intégration Discord pour l'attribution de rôles
 * 
 * IMPORTANT: Cette fonction ne peut pas fonctionner directement depuis un navigateur
 * en raison des restrictions CORS. Elle est destinée à être utilisée par un backend.
 */
export const assignDiscordRole = async (
  discordUsername: string,
  serverId: string,
  roleId: string,
  botToken: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Vérifier si nous sommes dans un navigateur
    const isRunningInBrowser = typeof window !== 'undefined';
    
    if (isRunningInBrowser) {
      console.log('[Discord Integration] Exécution depuis un navigateur détectée');
      return { 
        success: false, 
        message: "L'attribution de rôles Discord nécessite un backend. Les appels directs à l'API Discord depuis le navigateur ne sont pas possibles à cause des restrictions CORS." 
      };
    }
    
    // Cette partie serait exécutée sur un serveur backend (Node.js, Vercel Functions, etc.)
    console.log(`[Discord Integration] Assigning role ${roleId} to ${discordUsername} on server ${serverId}`);
    
    // Implémentation pour un environnement serveur
    // 1. Obtenir l'ID de l'utilisateur à partir de son nom
    const userResponse = await fetch(`https://discord.com/api/v10/guilds/${serverId}/members/search?query=${encodeURIComponent(discordUsername)}`, {
      headers: {
        Authorization: `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      throw new Error(`Erreur lors de la recherche de l'utilisateur: ${errorData.message || userResponse.statusText}`);
    }
    
    const members = await userResponse.json();
    if (!members.length) {
      throw new Error(`Utilisateur ${discordUsername} non trouvé sur le serveur`);
    }
    
    const userId = members[0].user.id;
    
    // 2. Attribuer le rôle à l'utilisateur
    const roleResponse = await fetch(`https://discord.com/api/v10/guilds/${serverId}/members/${userId}/roles/${roleId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!roleResponse.ok) {
      const errorData = await roleResponse.json();
      throw new Error(`Erreur lors de l'attribution du rôle: ${errorData.message || roleResponse.statusText}`);
    }
    
    return { success: true, message: `Rôle attribué avec succès à ${discordUsername}` };
  } catch (error) {
    console.error('Error assigning Discord role:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erreur inconnue lors de l'attribution du rôle Discord" 
    };
  }
};

/**
 * Guide d'implémentation du backend pour l'attribution de rôles Discord
 */
export const getBackendImplementationGuide = (): string => {
  return `
# Guide d'implémentation du backend Discord

Pour mettre en place une attribution réelle de rôles Discord, suivez ces étapes:

## 1. Créer une application Discord et un bot
- Visitez https://discord.com/developers/applications
- Créez une nouvelle application
- Dans la section "Bot", créez un bot et copiez son token
- Activez les intents privilégiés si nécessaire

## 2. Inviter le bot sur votre serveur
- Dans "OAuth2 > URL Generator", sélectionnez les scopes: bot, applications.commands
- Sélectionnez les permissions: "Manage Roles", "Send Messages"
- Utilisez l'URL générée pour inviter le bot sur votre serveur
- Assurez-vous que le rôle du bot est au-dessus des rôles qu'il doit attribuer

## 3. Créer un backend (options)
- Option 1: Serveur Node.js (Express)
- Option 2: Fonction serverless (Vercel, Netlify, Supabase)
- Option 3: Service API (AWS Lambda, Google Cloud Functions)

## 4. Exemple de code backend (Express)
\`\`\`javascript
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Configuration
app.use(cors({ origin: 'https://votre-site.com' })); // Limitez à votre domaine
app.use(express.json());

// Endpoint d'attribution de rôle
app.post('/api/discord/assign-role', async (req, res) => {
  try {
    const { discordUsername, serverId, roleId } = req.body;
    const botToken = process.env.DISCORD_BOT_TOKEN; // Stocké dans les variables d'environnement
    
    // Utiliser la même logique que dans discordIntegration.ts
    const userResponse = await fetch(
      \`https://discord.com/api/v10/guilds/\${serverId}/members/search?query=\${encodeURIComponent(discordUsername)}\`,
      {
        headers: {
          Authorization: \`Bot \${botToken}\`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Vérification et traitement de la réponse...
    
    res.json({ success: true, message: 'Rôle attribué avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(port, () => {
  console.log(\`Serveur démarré sur le port \${port}\`);
});
\`\`\`

## 5. Sécurisez votre API
- Utilisez HTTPS
- Implémentez une authentification (JWT, API key)
- Limitez les requêtes (rate limiting)
- Ne stockez JAMAIS le token bot côté client

## 6. Mettez à jour le frontend
Modifiez PurchaseDialog.tsx pour appeler votre API backend au lieu de la fonction directe.
`;
};

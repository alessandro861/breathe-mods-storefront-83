
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
 * Fonction pour envoyer une demande d'attribution de rôle via Zapier
 * Cette méthode contourne les limitations CORS en utilisant Zapier comme intermédiaire
 */
export const assignRoleViaZapier = async (
  discordUsername: string,
  webhookUrl: string
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!webhookUrl) {
      throw new Error("L'URL du webhook Zapier est requise");
    }

    if (!discordUsername) {
      throw new Error("Le nom d'utilisateur Discord est requis");
    }

    console.log(`[Zapier Integration] Sending role assignment request for ${discordUsername}`);
    console.log(`[DEBUG] Webhook URL: ${webhookUrl}`);
    console.log(`[DEBUG] Payload:`, JSON.stringify({
      discordUsername: discordUsername,
      timestamp: new Date().toISOString(),
      action: "assign_role"
    }));
    
    // Envoi des données à Zapier via un webhook - la version modifiée s'assure
    // que la propriété discordUsername est correctement envoyée
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors", // Évite les erreurs CORS
      body: JSON.stringify({
        discordUsername: discordUsername, // Cette clé doit correspondre à celle attendue par Zapier ({{data.discordUsername}})
        timestamp: new Date().toISOString(),
        action: "assign_role"
      }),
    });

    // Comme nous utilisons mode: "no-cors", nous ne pouvons pas vérifier la réponse
    // Nous supposons donc que la requête a réussi si aucune erreur n'a été levée
    return { 
      success: true, 
      message: `Demande d'attribution de rôle envoyée pour ${discordUsername} via Zapier. Vérifiez l'historique de votre Zap pour confirmer le traitement.` 
    };
  } catch (error) {
    console.error('Error with Zapier webhook:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erreur lors de l'envoi de la demande à Zapier" 
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

## 7. Solution alternative avec Zapier
Si vous préférez une solution sans backend:

1. Créez un compte Zapier (https://zapier.com)
2. Créez un nouveau Zap avec un déclencheur "Webhook by Zapier"
3. Comme action, utilisez l'intégration Discord pour ajouter un rôle à un utilisateur
4. Configurez les détails nécessaires (token bot, serveur ID, etc.)
5. Activez le Zap et copiez l'URL du webhook
6. Utilisez cette URL dans votre application avec la fonction assignRoleViaZapier()
`;
};

/**
 * Guide d'implémentation Zapier pour l'attribution de rôles Discord
 */
export const getZapierImplementationGuide = (): string => {
  return `
# Guide d'implémentation Zapier pour l'attribution de rôles Discord

Zapier peut servir d'intermédiaire entre votre application et Discord, ce qui vous évite de créer un backend personnalisé.

## Étapes de configuration:

### 1. Créez un compte Zapier
- Inscrivez-vous sur https://zapier.com si vous n'avez pas encore de compte

### 2. Créez un nouveau Zap
- Dans le tableau de bord Zapier, cliquez sur "Create Zap"

### 3. Configurez le déclencheur
- Choisissez "Webhooks by Zapier" comme application déclencheur
- Sélectionnez "Catch Hook" comme événement déclencheur
- Configurez le webhook et copiez l'URL générée par Zapier

### 4. Configurez l'action Discord
- Choisissez "Discord" comme application d'action
- Sélectionnez "Add Role to User" comme action
- Connectez votre compte Discord si ce n'est pas déjà fait
- Configurez les détails:
  * Serveur: Sélectionnez votre serveur Discord
  * Utilisateur: Utilisez la valeur reçue du webhook ({{webhook.data.discordUsername}})
  * Rôle: Sélectionnez le rôle à attribuer

### 5. Testez votre Zap
- Cliquez sur "Test & Continue" pour vérifier que tout fonctionne
- Zapier vous demandera d'envoyer des données à votre webhook pour tester

### 6. Activez votre Zap
- Une fois testé avec succès, activez votre Zap

### 7. Intégrez dans votre application
- Utilisez l'URL du webhook dans votre application
- Configurez-la dans les paramètres d'intégration Discord

## Exemple de structure de données à envoyer:
\`\`\`json
{
  "discordUsername": "Utilisateur#1234",
  "timestamp": "2023-06-15T12:34:56Z",
  "action": "assign_role"
}
\`\`\`

## Points importants:
- L'utilisateur doit déjà être membre du serveur Discord
- Zapier a des limites sur le nombre de tâches par mois selon votre forfait
- Le nom d'utilisateur Discord doit être exact (avec le discriminant si applicable)
`;
};

/**
 * Fonction pour générer un guide étape par étape pour configurer Zapier
 */
export const getZapierSetupSteps = (): { title: string; steps: { text: string; image?: string }[] }[] => {
  return [
    {
      title: "Créer un compte Zapier",
      steps: [
        {
          text: "Rendez-vous sur https://zapier.com et créez un compte si vous n'en avez pas déjà un"
        },
        {
          text: "Une fois connecté, accédez au tableau de bord Zapier"
        }
      ]
    },
    {
      title: "Créer un nouveau Zap",
      steps: [
        {
          text: "Cliquez sur 'Create Zap' dans le coin supérieur gauche"
        },
        {
          text: "Dans la section 'Trigger', recherchez et sélectionnez 'Webhooks by Zapier'"
        },
        {
          text: "Choisissez 'Catch Hook' comme type de déclencheur et cliquez sur 'Continue'"
        },
        {
          text: "Pour 'Pick off a Child Key', vous pouvez laisser vide car nous utiliserons toutes les données"
        },
        {
          text: "Cliquez sur 'Continue' puis sur 'Test trigger'"
        },
        {
          text: "Zapier vous fournira une URL de webhook unique. Copiez cette URL, vous en aurez besoin dans votre application"
        }
      ]
    },
    {
      title: "Configurer l'action Discord",
      steps: [
        {
          text: "Dans la section 'Action', recherchez et sélectionnez 'Discord'"
        },
        {
          text: "Choisissez 'Add Role to User' comme type d'action"
        },
        {
          text: "Connectez votre compte Discord si ce n'est pas déjà fait"
        },
        {
          text: "Sélectionnez votre serveur Discord dans la liste déroulante"
        },
        {
          text: "Pour 'Username', cliquez sur le bouton '+' et sélectionnez 'discordUsername' dans les données du webhook"
        },
        {
          text: "Sélectionnez le rôle à attribuer dans la liste déroulante"
        },
        {
          text: "Cliquez sur 'Continue' puis sur 'Test & Continue'"
        }
      ]
    },
    {
      title: "Finaliser et activer",
      steps: [
        {
          text: "Vérifiez que le test a réussi. Si ce n'est pas le cas, revérifiez votre configuration"
        },
        {
          text: "Donnez un nom à votre Zap, par exemple 'Attribution de rôle Discord depuis mon site web'"
        },
        {
          text: "Cliquez sur 'Publish' pour activer votre Zap"
        },
        {
          text: "Retournez dans votre application et collez l'URL du webhook dans les paramètres d'intégration Discord"
        }
      ]
    }
  ];
};

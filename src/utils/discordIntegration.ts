
/**
 * Utilitaires pour l'intégration Discord
 */

/**
 * Envoie une notification à un webhook Discord
 * @param webhookUrl - URL du webhook Discord
 * @param message - Message à envoyer (objet qui sera converti en JSON)
 * @returns Promise<boolean> - true si succès, false sinon
 */
export const sendDiscordWebhook = async (
  webhookUrl: string,
  message: any
): Promise<boolean> => {
  try {
    if (!webhookUrl) {
      console.error("L'URL du webhook Discord est requise");
      return false;
    }

    console.log(`[Discord] Envoi d'une notification au webhook: ${webhookUrl}`);
    console.log(`[Discord] Contenu:`, message);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (response.ok) {
      console.log('[Discord] Notification envoyée avec succès');
      return true;
    } else {
      console.error(`[Discord] Échec de l'envoi (${response.status}): ${await response.text()}`);
      return false;
    }
  } catch (error) {
    console.error('[Discord] Erreur lors de l\'envoi:', error);
    return false;
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

    console.log(`[Zapier] Envoi d'une demande d'attribution de rôle pour ${discordUsername}`);
    
    // Envoi des données à Zapier via un webhook
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors", // Pour éviter les erreurs CORS
      body: JSON.stringify({
        discordUsername: discordUsername,
        timestamp: new Date().toISOString(),
        action: "assign_role"
      }),
    });

    // Avec mode: "no-cors", on ne peut pas vérifier la réponse
    return { 
      success: true, 
      message: `Demande d'attribution de rôle envoyée pour ${discordUsername} via Zapier.` 
    };
  } catch (error) {
    console.error('[Zapier] Erreur:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erreur lors de l'envoi de la demande à Zapier" 
    };
  }
};

/**
 * Crée un message formaté pour Discord
 * @param modTitle - Titre du mod
 * @param discordUsername - Nom d'utilisateur Discord
 * @param serverIP - IP du serveur
 * @param price - Prix
 * @param pingUserId - ID utilisateur Discord à mentionner (optionnel)
 * @returns Object - Message formaté pour Discord
 */
export const createDiscordPurchaseMessage = (
  modTitle: string,
  discordUsername: string,
  serverIP: string,
  price: string,
  pingUserId?: string
) => {
  let content = `**Nouvelle Commande: ${modTitle}**\nDiscord: ${discordUsername}\nServeur IP: ${serverIP}\nPrix: ${price.replace(/<br\/>/g, " - ")}`;
  
  // Ajouter une mention si un ID est fourni
  if (pingUserId) {
    content = `<@${pingUserId}> ${content}`;
  }
  
  return {
    content: content,
    username: "Breathe Mods Bot",
    avatar_url: "https://cdn-icons-png.flaticon.com/512/1067/1067357.png"
  };
};

// Instructions pour configurer un webhook Discord
export const getDiscordWebhookInstructions = (): string => {
  return `
# Configuration d'un webhook Discord

1. Ouvrez votre serveur Discord
2. Allez dans les paramètres du serveur > Intégrations > Webhooks
3. Cliquez sur "Nouveau webhook"
4. Donnez un nom au webhook (ex: "Notifications d'achat")
5. Sélectionnez le canal où vous voulez recevoir les notifications
6. Copiez l'URL du webhook et collez-la dans les paramètres Discord de l'application
`;
};

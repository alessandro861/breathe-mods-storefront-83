
/**
 * Discord integration utilities
 */

/**
 * Sends a notification to a Discord webhook
 * @param webhookUrl - Discord webhook URL
 * @param message - Message to send (object that will be converted to JSON)
 * @returns Promise<boolean> - true if success, false if failure
 */
export const sendDiscordWebhook = async (
  webhookUrl: string,
  message: any
): Promise<boolean> => {
  try {
    if (!webhookUrl) {
      console.error("[Discord] Webhook URL is empty or null");
      return false;
    }

    // Check if it's a valid Discord webhook URL
    if (!webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      console.error("[Discord] Invalid webhook URL format:", webhookUrl.substring(0, 15) + "...");
      return false;
    }

    console.log(`[Discord] Sending notification to webhook: ${webhookUrl.substring(0, 40)}...`);
    
    // Log first 100 chars of content if it exists
    if (message && message.content) {
      console.log(`[Discord] Message preview: ${message.content.substring(0, 100)}${message.content.length > 100 ? '...' : ''}`);
    }

    // Fixed issue: ensure proper JSON serialization for the body
    const jsonBody = JSON.stringify(message);
    console.log("[Discord] Request body size:", jsonBody.length, "bytes");

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonBody,
    });

    console.log("[Discord] Response status:", response.status);

    if (response.ok) {
      console.log('[Discord] Notification sent successfully');
      return true;
    } else {
      const errorText = await response.text();
      console.error(`[Discord] Failed to send (${response.status}): ${errorText}`);
      
      // Log more details about the error for debugging
      if (response.status === 429) {
        console.error('[Discord] Rate limit exceeded. Try again later.');
      } else if (response.status === 404) {
        console.error('[Discord] Webhook not found. Check if the URL is correct.');
      } else if (response.status === 400) {
        console.error('[Discord] Bad request. Message format might be invalid.');
        console.error('[Discord] Message that caused the error:', JSON.stringify(message));
      }
      
      return false;
    }
  } catch (error) {
    console.error('[Discord] Error sending notification:', error);
    return false;
  }
};

/**
 * Function to send a role assignment request via Zapier
 * This method bypasses CORS limitations by using Zapier as an intermediary
 */
export const assignRoleViaZapier = async (
  discordUsername: string,
  webhookUrl: string
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!webhookUrl) {
      throw new Error("Zapier webhook URL is required");
    }

    if (!discordUsername) {
      throw new Error("Discord username is required");
    }

    console.log(`[Zapier] Sending role assignment request for ${discordUsername}`);
    
    // Send data to Zapier via a webhook
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors", // To avoid CORS errors
      body: JSON.stringify({
        discordUsername: discordUsername,
        timestamp: new Date().toISOString(),
        action: "assign_role"
      }),
    });

    // With mode: "no-cors", we can't check the response
    return { 
      success: true, 
      message: `Role assignment request sent for ${discordUsername} via Zapier.` 
    };
  } catch (error) {
    console.error('[Zapier] Error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Error sending request to Zapier" 
    };
  }
};

/**
 * Creates a formatted message for Discord
 * @param modTitle - Mod title
 * @param discordUsername - Discord username
 * @param serverName - Server name
 * @param serverIP - Server IP
 * @param serverPort - Server port
 * @param price - Price
 * @param pingUserId - Discord user ID to mention (optional)
 * @returns Object - Formatted message for Discord
 */
export const createDiscordPurchaseMessage = (
  modTitle: string,
  discordUsername: string,
  serverName: string,
  serverIP: string,
  serverPort: string,
  price: string,
  pingUserId?: string
) => {
  // Format the content with important information in bold
  let content = `**New Order: ${modTitle}**\n` +
    `Discord: **${discordUsername}**\n` +
    `Server Name: **${serverName}**\n` +
    `Server IP: **${serverIP}**\n` + 
    `Server Port: **${serverPort}**\n` +
    `Price: **${price.replace(/<br\/>/g, " - ")}**`;
  
  // Add a mention if an ID is provided
  if (pingUserId) {
    content = `<@${pingUserId}> ${content}`;
  }
  
  return {
    content: content,
    username: "Breathe Mods Bot",
    avatar_url: "https://cdn-icons-png.flaticon.com/512/1067/1067357.png"
  };
};

/**
 * Creates a formatted message for ticket notifications
 * @param ticketId - Ticket ID
 * @param ticketTitle - Ticket title
 * @param userEmail - User's email
 * @returns Object - Formatted message for Discord
 */
export const createDiscordTicketMessage = (
  ticketId: number,
  ticketTitle: string,
  userEmail: string
) => {
  return {
    content: `🎫 **New Support Ticket #${ticketId}**\nTitle: **${ticketTitle}**\nUser: **${userEmail}**`,
    username: "Breathe Support Bot",
    avatar_url: "https://cdn-icons-png.flaticon.com/512/1067/1067357.png"
  };
};

// Instructions for setting up a Discord webhook
export const getDiscordWebhookInstructions = (): string => {
  return `
# Setting up a Discord webhook

1. Open your Discord server
2. Go to server settings > Integrations > Webhooks
3. Click on "New webhook"
4. Give the webhook a name (e.g., "Purchase Notifications")
5. Select the channel where you want to receive notifications
6. Copy the webhook URL and paste it in the Discord settings of the application
`;
};

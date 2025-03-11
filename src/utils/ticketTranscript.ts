
import { TicketMessage } from "@/components/tickets/TicketChat";
import { sendDiscordWebhook } from "./discordIntegration";

/**
 * Formats a ticket transcript for Discord
 * @param ticketId - Ticket ID
 * @param ticketTitle - Ticket title
 * @param userName - User's name
 * @param userEmail - User's email
 * @param messages - Array of ticket messages
 * @returns Formatted string for Discord
 */
export const formatTicketTranscript = (
  ticketId: number,
  ticketTitle: string,
  userName: string,
  userEmail: string,
  messages: TicketMessage[]
): string => {
  // Format header with ticket info
  let transcript = `# Ticket Transcript #${ticketId}\n\n`;
  transcript += `**Title:** ${ticketTitle}\n`;
  transcript += `**User:** ${userName || "Unknown"}\n`;
  transcript += `**Email:** ${userEmail || "Unknown"}\n`;
  transcript += `**Closed on:** ${new Date().toLocaleString()}\n\n`;
  
  // Format messages
  transcript += "## Conversation\n\n";
  
  messages.forEach(message => {
    const sender = message.sender === "user" ? "User" : "Admin";
    transcript += `**${sender}** (${message.timestamp}):\n`;
    transcript += `${message.content}\n\n`;
  });
  
  return transcript;
};

/**
 * Sends a ticket transcript to Discord
 * @param ticketId - Ticket ID
 * @param ticketTitle - Ticket title
 * @param userName - User's name
 * @param userEmail - User's email
 * @param messages - Array of ticket messages
 * @returns Promise<boolean> - true if success, false if failure
 */
export const sendTicketTranscriptToDiscord = async (
  ticketId: number,
  ticketTitle: string,
  userName: string,
  userEmail: string,
  messages: TicketMessage[]
): Promise<boolean> => {
  try {
    // Check if transcript webhooks are enabled
    const transcriptEnabled = localStorage.getItem('transcript-enabled') === 'true';
    if (!transcriptEnabled) {
      console.log("[Transcript] Ticket transcripts are disabled");
      return false;
    }
    
    // Get the webhook URL
    const webhookUrl = localStorage.getItem('transcript-webhook-url');
    if (!webhookUrl) {
      console.error("[Transcript] No webhook URL configured for ticket transcripts");
      return false;
    }
    
    // Format the transcript
    const transcript = formatTicketTranscript(
      ticketId,
      ticketTitle,
      userName,
      userEmail,
      messages
    );
    
    // Send to Discord
    console.log("[Transcript] Sending ticket transcript to Discord");
    
    const success = await sendDiscordWebhook(webhookUrl, {
      content: `📝 **Ticket #${ticketId} Closed - Transcript**`,
      username: "Breathe Ticket Transcript",
      embeds: [
        {
          title: `Ticket #${ticketId}: ${ticketTitle}`,
          description: transcript.length > 4000 
            ? transcript.substring(0, 3997) + "..." 
            : transcript,
          color: 3447003, // Blue color
          timestamp: new Date().toISOString(),
          footer: {
            text: "Breathe Support System"
          }
        }
      ]
    });
    
    return success;
  } catch (error) {
    console.error("[Transcript] Error sending ticket transcript:", error);
    return false;
  }
};

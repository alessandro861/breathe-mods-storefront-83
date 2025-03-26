
import { TicketPriority } from "@/components/tickets/TicketChat";

/**
 * Returns a color code based on ticket priority
 */
export const getPriorityColor = (priority: TicketPriority): string => {
  switch (priority) {
    case "high":
      return "#f87171"; // Red
    case "normal":
      return "#fbbf24"; // Yellow
    case "low":
      return "#60a5fa"; // Blue
    default:
      return "#9ca3af"; // Gray
  }
};

/**
 * Gets a Discord embed color code based on ticket priority
 */
export const getDiscordPriorityColor = (priority: TicketPriority): number => {
  switch (priority) {
    case "high":
      return 16711680; // Red
    case "normal":
      return 16750848; // Yellow
    case "low":
      return 255; // Blue
    default:
      return 9807270; // Gray
  }
};

/**
 * Gets the icon name for a priority
 */
export const getPriorityIcon = (priority: TicketPriority): string => {
  switch (priority) {
    case "high":
      return "alert-octagon";
    case "normal":
      return "alert-triangle";
    case "low":
      return "alert-circle";
    default:
      return "info";
  }
};

/**
 * Returns a description for each priority level
 */
export const getPriorityDescription = (priority: TicketPriority): string => {
  switch (priority) {
    case "high":
      return "Critical issue requiring immediate attention";
    case "normal":
      return "Standard request with normal processing time";
    case "low":
      return "Minor request that can be handled when resources allow";
    default:
      return "No priority specified";
  }
};

/**
 * Sorts tickets by priority (high first, then normal, then low)
 */
export const sortTicketsByPriority = <T extends { priority?: TicketPriority }>(
  tickets: T[]
): T[] => {
  return [...tickets].sort((a, b) => {
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    const aPriority = a.priority || "normal";
    const bPriority = b.priority || "normal";
    
    return priorityOrder[aPriority] - priorityOrder[bPriority];
  });
};

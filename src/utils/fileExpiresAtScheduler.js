import cron from "node-cron";
import { prisma } from "../index.js";
import dayjs from "dayjs"; // For comparing dates (optional but useful)
import { FILE_STATUS } from "./constant.js";

// Cron job to check and update expired files every hour
export const fileExpiresAtScheduler = (logger) => {
  // */1 * * * * for every 1 minute
  // */5 * * * * * for every 5 seconds
  // */5 * * * * for every 5 minutes
  // 0 * * * * for every hour

  cron.schedule("*/1 * * * *", async () => {
    try {
      logger.info("[Cron Job] Checking for expired share links...");

      // Get all share links where expiresAt is before the current time and resource is not already expired
      const expiredShareLinks = await prisma.sharedLink.findMany({
        where: {
          expiresAt: {
            lte: dayjs().toDate(), // Get share links where expiresAt is less than or equal to the current time
          },
        },
        include: {
          resource: true, // Include the resource data to update its status later
        },
      });

      if (expiredShareLinks.length > 0) {
        const updatePromises = expiredShareLinks.map((shareLink) => {
          const resourceId = shareLink.resource.id;

          // Update the resource's status to 'expired' if it's not already expired
          return prisma.resource.update({
            where: { id: resourceId },
            data: {
              status: FILE_STATUS.EXPIRED,
            },
          });
        });

        // Execute all update promises for the expired resources
        await Promise.all(updatePromises);

        logger.info(
          `[Cron Job] Marked ${expiredShareLinks.length} resource(s) as expired due to expired share links.`
        );
      }
    } catch (error) {
      logger.error(
        "[Cron Job] Error during share link expiration check:",
        error
      );
    }
  });
};

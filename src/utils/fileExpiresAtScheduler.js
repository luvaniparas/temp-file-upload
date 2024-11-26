import cron from "node-cron";
import { prisma } from "../index.js";
import dayjs from "dayjs"; // For comparing dates (optional but useful)

// Cron job to check and update expired files every hour
export const fileExpiresAtScheduler = (logger) => {
  // */5 * * * * * for every 5 seconds
  // */5 * * * * for every 5 minutes
  // 0 * * * * for every hour

  // executes after every 1 minutes
  cron.schedule("*/1 * * * * ", async () => {
    try {
      logger.info("[Cron Job] Checking for expired files...");

      // Get all files where expiresAt is before the current time and status is not already expired
      const expiredFiles = await prisma.file.findMany({
        where: {
          expiresAt: {
            lte: dayjs().toDate(), // Get files where expiresAt is less than or equal to the current time
          },
          status: {
            not: "expired", // Only check files that haven't already been marked as expired
          },
        },
      });

      if (expiredFiles.length > 0) {
        // Update status to 'expired' for all expired files
        const updatePromises = expiredFiles.map((file) => {
          return prisma.file.update({
            where: { id: file.id },
            data: { status: "expired" },
          });
        });

        // Execute all update promises
        await Promise.all(updatePromises);

        logger.info(
          `[Cron Job] Marked ${expiredFiles.length} file(s) as expired.`
        );
      }
    } catch (error) {
      logger.error("[Cron Job] Error during file expiration check:", error);
    }
  });
};

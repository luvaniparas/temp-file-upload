import cron from "node-cron";
import { prisma } from "../index.js";
import dayjs from "dayjs"; // For comparing dates (optional but useful)

// Cron job to check and update expired files every hour
export const fileExpiresAtScheduler = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("[Cron Job] Checking for expired files...");

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

        console.log(
          `[Cron Job] Marked ${expiredFiles.length} file(s) as expired.`
        );
      }
    } catch (error) {
      console.error("[Cron Job] Error during file expiration check:", error);
    }
  });
};

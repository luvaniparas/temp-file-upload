import { prisma } from "../index.js";

export const createLink = async (data) => {
  return await prisma.sharedLink.create({ data });
};

export const deleteShareLinksByResourceId = async (resourceId, userId) => {
  await prisma.sharedLink.deleteMany({
    where: { resourceId, sharedBy: userId },
  });
};

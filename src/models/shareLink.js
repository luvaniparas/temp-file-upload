import { prisma } from "../index.js";

export const createLink = async (data) => {
  return await prisma.sharedLink.create({ data });
};

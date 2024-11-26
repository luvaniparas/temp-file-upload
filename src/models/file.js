import { prisma } from "../index.js";

export const createFile = async (data) => {
  try {
    return await prisma.file.create({
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

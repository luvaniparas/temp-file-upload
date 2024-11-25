import { prisma } from "../../src/index.js";
export const findUserByEmail = async (email) => {
  const user = await prisma.user.findFirst({
    where: { email },
  });
  return user;
};

export const createUser = async (input) => {
  const user = await prisma.user.create({
    data: input,
  });
  return user;
};

import { prisma } from "../index.js";

export const createFile = async (data) => {
  return await prisma.file.create({
    data,
  });
};

export const getUserResources = async (userId, status) => {
  return await prisma.file.findMany({
    where: {
      createdById: userId,
      status,
    },
  });
};

export const getResourceById = async (id) => {
  return await prisma.file.findUnique({
    where: {
      id: id,
    },
  });
};

export const deleteResourceById = async (id) => {
  return await prisma.file.delete({
    where: {
      id,
    },
  });
};

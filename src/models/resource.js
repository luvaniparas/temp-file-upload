import { prisma } from "../index.js";

export const createResource = async (data) => {
  return await prisma.resource.create({
    data,
  });
};

export const getUserResources = async (userId, status) => {
  return await prisma.resource.findMany({
    where: {
      createdById: userId,
      status,
    },
  });
};

export const getResourceById = async (id) => {
  return await prisma.resource.findUnique({
    where: {
      id: id,
    },
  });
};

export const deleteResourceById = async (id) => {
  return await prisma.resource.delete({
    where: {
      id,
    },
  });
};

import { PrismaClient, Prisma } from "@prisma/client";
import { UserNotFoundError } from "../../errors/dbErrors";

const prisma = new PrismaClient();

export type FileSearchParams = {
  name?: string;
  skip?: number;
  take?: number;
};

class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(email: string) {
    return prisma.user.create({ data: { email } });
  }

  async uploadFiles(email: string, files: Prisma.FileUncheckedCreateInput[]) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    const filesWithUserId = files.map((file) => ({
      ...file,
      userId: user.id,
    }));

    const createdFiles = await prisma.file.createMany({
      data: filesWithUserId,
    });

    return createdFiles;
  }

  async getFilesByUserEmail(
    email: string,
    filters: FileSearchParams,
    selectExternalDbId = false,
  ) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    const { name, skip = 0, take = 10 } = filters;

    const files = await prisma.file.findMany({
      where: {
        userId: user.id,
        ...(name && {
          name: {
            contains: name,
          },
        }),
      },
      skip,
      take,
      select: {
        id: true,
        name: true,
        data_uploaded: true,
        external_db_id: selectExternalDbId,
      },
    });

    const totalCount = await prisma.file.count({
      where: {
        userId: user.id,
        ...(name && {
          name: {
            contains: name,
          },
        }),
      },
    });

    return {
      files,
      totalCount,
    };
  }

  async deleteFilesByUserEmailAndFileIds(email: string, fileIds: string[]) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    const files = await prisma.file.deleteMany({
      where: {
        userId: user.id,
        id: {
          in: fileIds,
        },
      },
    });

    return files;
  }
}

export const userRepository = new UserRepository();

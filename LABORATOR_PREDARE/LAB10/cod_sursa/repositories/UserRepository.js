// Lab 10: Additional Repository Examples

const prisma = require('../../config/prisma');

/**
 * UserRepository - Data access for users
 */
class UserRepository {
  constructor(prismaClient = null) {
    this.prisma = prismaClient || prisma;
  }

  async findAll() {
    return await this.prisma.user.findMany({
      where: { isDeleted: false },
      include: { plan: true }
    });
  }

  async findById(userId) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: { plan: true }
    });
  }

  async findByEmail(email) {
    return await this.prisma.user.findUnique({
      where: { email: email }
    });
  }

  async create(userData) {
    return await this.prisma.user.create({
      data: userData
    });
  }

  async update(userId, updateData) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: updateData
    });
  }

  async delete(userId) {
    // Soft delete
    return await this.prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true, deletedAt: new Date() }
    });
  }
}

/**
 * FileRepository - Data access for files
 */
class FileRepository {
  constructor(prismaClient = null) {
    this.prisma = prismaClient || prisma;
  }

  async findAll() {
    return await this.prisma.file.findMany({
      where: { isDeleted: false }
    });
  }

  async findById(fileId) {
    return await this.prisma.file.findUnique({
      where: { id: fileId }
    });
  }

  async findByUser(userId) {
    return await this.prisma.file.findMany({
      where: { userId: userId, isDeleted: false }
    });
  }

  async create(fileData) {
    return await this.prisma.file.create({
      data: fileData
    });
  }

  async delete(fileId) {
    return await this.prisma.file.update({
      where: { id: fileId },
      data: { isDeleted: true, deletedAt: new Date() }
    });
  }

  async countByUser(userId) {
    return await this.prisma.file.count({
      where: { userId: userId, isDeleted: false }
    });
  }

  async getTotalSizeByUser(userId) {
    const result = await this.prisma.file.aggregate({
      where: { userId: userId, isDeleted: false },
      _sum: { fileSize: true }
    });
    
    return result._sum.fileSize || 0;
  }
}

module.exports = { UserRepository, FileRepository };

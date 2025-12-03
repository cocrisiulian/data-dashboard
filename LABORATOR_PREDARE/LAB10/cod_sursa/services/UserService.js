// Lab 10: Additional Service Examples - User Service and File Service

/**
 * UserService - Business logic for user management
 */
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    
    // Business logic: Hide sensitive data
    return users.map(user => ({
      ...user,
      password: undefined, // Never return password
      isActive: !user.isDeleted,
      accountAge: this.calculateAccountAge(user.createdAt)
    }));
  }

  async getUserById(userId) {
    const user = await this.userRepository.findById(userId);
    
    if (!user || user.isDeleted) {
      throw new Error('User not found');
    }

    return {
      ...user,
      password: undefined
    };
  }

  calculateAccountAge(createdAt) {
    const days = Math.floor((Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  }
}

/**
 * FileService - Business logic for file management
 */
class FileService {
  constructor(fileRepository, userRepository) {
    this.fileRepository = fileRepository;
    this.userRepository = userRepository;
  }

  async uploadFile(userId, fileData) {
    // Business validation: Check user's plan limits
    const user = await this.userRepository.findById(userId);
    const userFiles = await this.fileRepository.countByUser(userId);
    
    if (user.plan && userFiles >= user.plan.maxFiles) {
      throw new Error(`File limit reached. Your plan allows ${user.plan.maxFiles} files.`);
    }

    // Business logic: Calculate storage used
    const storageUsed = await this.fileRepository.getTotalSizeByUser(userId);
    const maxStorage = this.getMaxStorageForPlan(user.plan);
    
    if (storageUsed + fileData.fileSize > maxStorage) {
      throw new Error('Storage limit exceeded');
    }

    return await this.fileRepository.create(fileData);
  }

  getMaxStorageForPlan(plan) {
    // Business rule: Storage based on plan
    const baseStorage = 100 * 1024 * 1024; // 100MB
    return plan ? baseStorage * (plan.maxFiles / 10) : baseStorage;
  }
}

module.exports = { UserService, FileService };

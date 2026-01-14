const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestFile() {
  try {
    const file = await prisma.file.create({
      data: {
        userId: '04a7e08b-00c7-435e-b1d6-e77685e3ad8a',
        fileName: 'test-data.csv',
        fileType: 'text/csv',
        fileSize: 1024,
        filePath: '/uploads/test-data.csv'
      }
    });
    console.log('File created:', JSON.stringify(file, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestFile();

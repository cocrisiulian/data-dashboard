/**
 * Migration Script: Move existing files to user-specific folders
 * 
 * This script moves all existing uploaded files from uploads/ to uploads/:userId/
 * Run once after implementing user-specific file storage
 * 
 * Usage: node migrate-files-to-user-folders.js
 */

const prisma = require('./config/prisma');
const fs = require('fs');
const path = require('path');

async function migrateFiles() {
  console.log('Starting file migration to user-specific folders...\n');
  
  try {
    // Get all files from database
    const files = await prisma.file.findMany({
      select: {
        id: true,
        userId: true,
        fileName: true,
        filePath: true
      }
    });

    console.log(`Found ${files.length} files to migrate\n`);

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const file of files) {
      try {
        const oldPath = path.join(__dirname, 'uploads', file.filePath);
        const userDir = path.join(__dirname, 'uploads', file.userId);
        const newPath = path.join(userDir, file.filePath);

        // Skip if file doesn't exist in old location
        if (!fs.existsSync(oldPath)) {
          console.log(`⚠️  SKIP: ${file.fileName} - file not found at ${oldPath}`);
          skippedCount++;
          continue;
        }

        // Create user directory if it doesn't exist
        if (!fs.existsSync(userDir)) {
          fs.mkdirSync(userDir, { recursive: true });
          console.log(`📁 Created directory: uploads/${file.userId}`);
        }

        // Skip if file already exists in new location
        if (fs.existsSync(newPath)) {
          console.log(`⚠️  SKIP: ${file.fileName} - already exists in user folder`);
          skippedCount++;
          continue;
        }

        // Move file to user-specific folder
        fs.renameSync(oldPath, newPath);
        
        console.log(`✅ Moved: ${file.fileName}`);
        console.log(`   From: ${oldPath}`);
        console.log(`   To:   ${newPath}\n`);
        
        successCount++;
      } catch (error) {
        console.error(`❌ ERROR migrating ${file.fileName}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('Migration Summary:');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`⚠️  Skipped: ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total: ${files.length}`);
    console.log('='.repeat(60));

    if (errorCount === 0) {
      console.log('\n✨ Migration completed successfully!');
    } else {
      console.log('\n⚠️  Migration completed with some errors. Please review the output above.');
    }

  } catch (error) {
    console.error('Fatal error during migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateFiles()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });

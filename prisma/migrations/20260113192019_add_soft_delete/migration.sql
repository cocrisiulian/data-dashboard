-- AlterTable
ALTER TABLE "charts" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dashboards" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "charts_deleted_at_idx" ON "charts"("deleted_at");

-- CreateIndex
CREATE INDEX "dashboards_deleted_at_idx" ON "dashboards"("deleted_at");

-- CreateIndex
CREATE INDEX "files_deleted_at_idx" ON "files"("deleted_at");

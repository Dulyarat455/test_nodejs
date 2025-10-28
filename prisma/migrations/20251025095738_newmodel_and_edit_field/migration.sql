/*
  Warnings:

  - You are about to drop the column `addedMoney` on the `SaleTemp` table. All the data in the column will be lost.
  - You are about to drop the column `tasteId` on the `SaleTemp` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[SaleTemp] DROP COLUMN [addedMoney],
[tasteId];

-- CreateTable
CREATE TABLE [dbo].[SaleTempDetail] (
    [id] INT NOT NULL IDENTITY(1,1),
    [saleTempId] INT NOT NULL,
    [addedMoney] INT,
    [tasteId] INT,
    [foodId] INT NOT NULL,
    CONSTRAINT [SaleTempDetail_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[SaleTempDetail] ADD CONSTRAINT [SaleTempDetail_foodId_fkey] FOREIGN KEY ([foodId]) REFERENCES [dbo].[Food]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

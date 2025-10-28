BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[SaleTempDetail] DROP CONSTRAINT [SaleTempDetail_foodId_fkey];

-- AddForeignKey
ALTER TABLE [dbo].[SaleTempDetail] ADD CONSTRAINT [SaleTempDetail_foodId_fkey] FOREIGN KEY ([foodId]) REFERENCES [dbo].[Food]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SaleTempDetail] ADD CONSTRAINT [SaleTempDetail_saleTempId_fkey] FOREIGN KEY ([saleTempId]) REFERENCES [dbo].[SaleTemp]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

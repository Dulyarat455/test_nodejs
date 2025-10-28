BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[SaleTemp] (
    [id] INT NOT NULL IDENTITY(1,1),
    [foodId] INT NOT NULL,
    [qty] INT NOT NULL,
    [price] INT NOT NULL,
    [tableNo] INT NOT NULL,
    [userId] INT NOT NULL,
    CONSTRAINT [SaleTemp_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[SaleTemp] ADD CONSTRAINT [SaleTemp_foodId_fkey] FOREIGN KEY ([foodId]) REFERENCES [dbo].[Food]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

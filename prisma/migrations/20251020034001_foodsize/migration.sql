BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[FoodSize] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [remark] NVARCHAR(1000),
    [moneyAdded] INT NOT NULL CONSTRAINT [FoodSize_moneyAdded_df] DEFAULT 0,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [FoodSize_status_df] DEFAULT 'use',
    [foodTypeId] INT NOT NULL,
    CONSTRAINT [FoodSize_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[FoodSize] ADD CONSTRAINT [FoodSize_foodTypeId_fkey] FOREIGN KEY ([foodTypeId]) REFERENCES [dbo].[FoodType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

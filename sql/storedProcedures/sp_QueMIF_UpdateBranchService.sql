USE [BIIFDBPROD2]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_QueMIF_UpdateBranchService]
	@BranchID INT,
    @ServiceID INT,
    @IsActive BIT
AS
BEGIN
	SET NOCOUNT ON;

    MERGE QueMIF_BranchServices AS target
    USING (SELECT @BranchID AS BranchID, @ServiceID AS ServiceID) AS source
    ON (target.BranchID = source.BranchID AND target.ServiceID = source.ServiceID)
    WHEN MATCHED THEN
        UPDATE SET IsActive = @IsActive, UpdatedAt = GETDATE()
    WHEN NOT MATCHED THEN
        INSERT (BranchID, ServiceID, IsActive)
        VALUES (@BranchID, @ServiceID, @IsActive);
END
GO

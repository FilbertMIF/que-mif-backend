USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_InsertCounter]    Script Date: 30/01/2026 16:31:22 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_InsertCounter]
    @Name VARCHAR(255),
    @IsActive BIT,
    @BranchID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM Branch
        WHERE BranchID = @BranchID
    )
    BEGIN
        THROW 50001, 'Invalid BranchID', 1;
    END

    INSERT INTO QueMIF_Counters (Name, IsActive, BranchID, CreatedAt)
    VALUES (@Name, @IsActive, @BranchID, GETDATE());

    SELECT SCOPE_IDENTITY() AS CounterID;
END

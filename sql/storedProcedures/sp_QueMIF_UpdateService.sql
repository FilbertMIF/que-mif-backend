USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_UpdateService]    Script Date: 30/01/2026 16:32:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_UpdateCounter]
    @CounterID INT,
    @Name VARCHAR(255) = NULL,
    @IsActive BIT = NULL,
    @BranchID INT = NULL,
    @NPK VARCHAR(10) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM QueMIF_Counters
        WHERE CounterID = @CounterID
    )
    BEGIN
        THROW 50002, 'Counter not found', 1;
    END

    IF @BranchID IS NOT NULL
       AND NOT EXISTS (
            SELECT 1
            FROM Branch
            WHERE BranchID = @BranchID
       )
    BEGIN
        THROW 50001, 'Invalid BranchID', 1;
    END

    IF @NPK IS NOT NULL
       AND EXISTS (
           SELECT 1
           FROM QueMIF_Tickets
           WHERE CurrentCounterID = @CounterID
             AND Status = 'ON SERVE'
       )
    BEGIN
        THROW 50003, 'Cannot change NPK while counter is serving a ticket', 1;
    END

    UPDATE QueMIF_Counters
    SET
        Name     = COALESCE(@Name, Name),
        IsActive = COALESCE(@IsActive, IsActive),
        BranchID = COALESCE(@BranchID, BranchID),
        NPK      = COALESCE(@NPK, NPK)
    WHERE CounterID = @CounterID;

    SELECT @@ROWCOUNT AS Affected;
END

    USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_DeleteCounter]    Script Date: 30/01/2026 16:27:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_DeleteCounter]
    @CounterID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM QueMIF_Counters
        WHERE CounterID = @CounterID
    )
    BEGIN
        THROW 50003, 'Counter not found', 1;
    END

    DELETE FROM QueMIF_Counters
    WHERE CounterID = @CounterID;

    SELECT @@ROWCOUNT AS Affected;
END

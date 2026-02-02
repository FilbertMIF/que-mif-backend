USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_DeleteService]    Script Date: 30/01/2026 16:28:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_DeleteService]
    @ServiceID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1 FROM QueMIF_Services WHERE ServiceID = @ServiceID
    )
    BEGIN
        THROW 50103, 'Service not found', 1;
    END

    DELETE FROM QueMIF_Services
    WHERE ServiceID = @ServiceID;

    SELECT @@ROWCOUNT AS Affected;
END

USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_UpdateService]    Script Date: 02/02/2026 12:02:22 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_UpdateService]
    @ServiceID INT,
    @Code VARCHAR(10) = NULL,
    @Name VARCHAR(255) = NULL,
    @Description VARCHAR(500) = NULL,
    @IsActive BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1 FROM QueMIF_Services WHERE ServiceID = @ServiceID
    )
    BEGIN
        THROW 50101, 'Service not found', 1;
    END

    UPDATE QueMIF_Services
    SET
        Code = COALESCE(@Code, Code),
        Name = COALESCE(@Name, Name),
        Description = COALESCE(@Description, Description),
        IsActive = COALESCE(@IsActive, IsActive),
        UpdatedAt = GETDATE()
    WHERE ServiceID = @ServiceID;

    SELECT @@ROWCOUNT AS Affected;
END

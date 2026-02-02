USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_InsertService]    Script Date: 30/01/2026 16:31:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_InsertService]
    @Code VARCHAR(10),
    @Name VARCHAR(255),
    @Description VARCHAR(500),
    @IsActive BIT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO QueMIF_Services
        (Code, Name, Description, IsActive, CreatedAt)
    VALUES
        (@Code, @Name, @Description, @IsActive, GETDATE());

    SELECT SCOPE_IDENTITY() AS ServiceID;
END

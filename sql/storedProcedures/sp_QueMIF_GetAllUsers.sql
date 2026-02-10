USE [BIIFDBPROD2]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_QueMIF_GetAllUsers]
AS
BEGIN
	SET NOCOUNT ON;

    SELECT 
        UserID,
        Username,
        FullName,
        Role,
        BranchID,
        IsActive,
        NPK,
        CreatedAt
    FROM QueMIF_Users
    ORDER BY UserID DESC
END
GO

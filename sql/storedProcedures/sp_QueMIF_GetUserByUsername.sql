USE [BIIFDBPROD2]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_QueMIF_GetUserByUsername]
	@Username VARCHAR(50)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT TOP 1 
        UserID,
        Username,
        FullName,
        Role,
        BranchID,
        IsActive,
        NPK
    FROM QueMIF_Users
    WHERE Username = @Username AND IsActive = 1
END
GO

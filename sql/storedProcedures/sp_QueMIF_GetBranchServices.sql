USE [BIIFDBPROD2]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_QueMIF_GetBranchServices]
	@BranchID INT
AS
BEGIN
	SET NOCOUNT ON;

    SELECT 
        s.ServiceID,
        s.Code,
        s.Name,
        ISNULL(bs.IsActive, 0) AS IsEnabled
    FROM QueMIF_Services s
    LEFT JOIN QueMIF_BranchServices bs ON bs.ServiceID = s.ServiceID AND bs.BranchID = @BranchID
    WHERE s.IsActive = 1
    ORDER BY s.Code
END
GO

USE [BIIFDBPROD2]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_QueMIF_GetServiceStats]
	@BranchID INT,
	@QueueDate DATE = NULL
AS
BEGIN
	SET NOCOUNT ON;

	IF @QueueDate IS NULL
		SET @QueueDate = CAST(GETDATE() AS DATE);

	SELECT 
		s.ServiceID,
		s.Code,
		s.Name,
		COUNT(t.TicketID) AS totalCount,
		SUM(CASE WHEN t.Status = 'WAITING' THEN 1 ELSE 0 END) AS waitingCount,
		SUM(CASE WHEN t.Status = 'COMPLETED' THEN 1 ELSE 0 END) AS doneCount
	FROM QueMIF_Services s
    -- Join with Branch Services to only show services available for this branch? 
    -- Or just show all active services and counts. 
    -- Let's stick to active services and join.
    JOIN QueMIF_BranchServices bs ON bs.ServiceID = s.ServiceID AND bs.BranchID = @BranchID AND bs.IsActive = 1
	LEFT JOIN QueMIF_Tickets t ON t.ServiceID = s.ServiceID
		AND CAST(t.CreatedAt AS DATE) = @QueueDate
		AND t.BranchID = @BranchID
	WHERE s.IsActive = 1
	GROUP BY s.ServiceID, s.Code, s.Name
	ORDER BY s.Code
END
GO

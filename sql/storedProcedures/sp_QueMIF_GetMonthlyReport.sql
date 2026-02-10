USE [BIIFDBPROD2]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_QueMIF_GetMonthlyReport]
	@BranchID INT = NULL,
	@Year INT,
	@Month INT
AS
BEGIN
	SET NOCOUNT ON;

	-- Get daily aggregates for the entire month
	SELECT 
		CAST(t.QueueDate AS DATE) AS ReportDate,
		COUNT(DISTINCT ts.TicketID) AS TotalTickets,
		SUM(CASE WHEN ts.Result = 'COMPLETE' THEN 1 ELSE 0 END) AS CompleteCount,
		SUM(CASE WHEN ts.Result = 'NO SHOW' THEN 1 ELSE 0 END) AS NoShowCount,
		SUM(CASE WHEN ts.Result = 'CANCELED' THEN 1 ELSE 0 END) AS CanceledCount,
		AVG(CASE WHEN ts.ServiceDuration IS NOT NULL THEN ts.ServiceDuration ELSE 0 END) AS AvgServiceDuration,
		AVG(ISNULL(ts.HoldDuration, 0)) AS AvgHoldDuration,
		SUM(CASE WHEN ts.ServiceDuration IS NOT NULL THEN ts.ServiceDuration ELSE 0 END) AS TotalServiceDuration,
		SUM(ISNULL(ts.HoldDuration, 0)) AS TotalHoldDuration
	FROM QueMIF_TicketsSettlement ts
	INNER JOIN QueMIF_Tickets t ON t.TicketID = ts.TicketID
	WHERE 
		YEAR(t.QueueDate) = @Year
		AND MONTH(t.QueueDate) = @Month
		AND (@BranchID IS NULL OR t.BranchID = @BranchID)
	GROUP BY CAST(t.QueueDate AS DATE)
	ORDER BY CAST(t.QueueDate AS DATE);

	-- Get monthly totals
	SELECT 
		@Year AS Year,
		@Month AS Month,
		COUNT(DISTINCT ts.TicketID) AS TotalTickets,
		SUM(CASE WHEN ts.Result = 'COMPLETE' THEN 1 ELSE 0 END) AS CompleteCount,
		SUM(CASE WHEN ts.Result = 'NO SHOW' THEN 1 ELSE 0 END) AS NoShowCount,
		SUM(CASE WHEN ts.Result = 'CANCELED' THEN 1 ELSE 0 END) AS CanceledCount,
		AVG(CASE WHEN ts.ServiceDuration IS NOT NULL THEN ts.ServiceDuration ELSE 0 END) AS AvgServiceDuration,
		AVG(ISNULL(ts.HoldDuration, 0)) AS AvgHoldDuration,
		SUM(CASE WHEN ts.ServiceDuration IS NOT NULL THEN ts.ServiceDuration ELSE 0 END) AS TotalServiceDuration,
		SUM(ISNULL(ts.HoldDuration, 0)) AS TotalHoldDuration
	FROM QueMIF_TicketsSettlement ts
	INNER JOIN QueMIF_Tickets t ON t.TicketID = ts.TicketID
	WHERE 
		YEAR(t.QueueDate) = @Year
		AND MONTH(t.QueueDate) = @Month
		AND (@BranchID IS NULL OR t.BranchID = @BranchID);
END
GO

USE [BIIFDBPROD2]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_QueMIF_GetDailyReport]
	@BranchID INT = NULL,
	@QueueDate DATE
AS
BEGIN
	SET NOCOUNT ON;

	-- Get daily statistics from TicketSettlement and Tickets
	SELECT 
		@QueueDate AS ReportDate,
		COUNT(DISTINCT ts.TicketID) AS TotalTickets,
		SUM(CASE WHEN ts.Result = 'WAITING' THEN 1 ELSE 0 END) AS WaitingCount,
		SUM(CASE WHEN ts.Result = 'COMPLETE' THEN 1 ELSE 0 END) AS CompleteCount,
		SUM(CASE WHEN ts.Result = 'NO SHOW' THEN 1 ELSE 0 END) AS NoShowCount,
		SUM(CASE WHEN ts.Result = 'CANCELED' THEN 1 ELSE 0 END) AS CanceledCount,
		AVG(CASE WHEN ts.ServiceDuration IS NOT NULL AND ts.ServiceDuration > 0 THEN ts.ServiceDuration ELSE NULL END) AS AvgServiceDuration,
		AVG(CASE WHEN ts.HoldDuration IS NOT NULL AND ts.HoldDuration > 0 THEN ts.HoldDuration ELSE NULL END) AS AvgHoldDuration,
		SUM(ISNULL(ts.ServiceDuration, 0)) AS TotalServiceDuration,
		SUM(ISNULL(ts.HoldDuration, 0)) AS TotalHoldDuration
	FROM QueMIF_TicketsSettlement ts
	INNER JOIN QueMIF_Tickets t ON t.TicketID = ts.TicketID
	WHERE 
		CAST(t.QueueDate AS DATE) = @QueueDate
		AND (@BranchID IS NULL OR t.BranchID = @BranchID);

	-- Get breakdown by service
	SELECT 
		s.ServiceID,
		s.Code AS ServiceCode,
		s.Name AS ServiceName,
		COUNT(DISTINCT ts.TicketID) AS TotalTickets,
		SUM(CASE WHEN ts.Result = 'COMPLETE' THEN 1 ELSE 0 END) AS CompleteCount,
		SUM(CASE WHEN ts.Result = 'NO SHOW' THEN 1 ELSE 0 END) AS NoShowCount,
		SUM(CASE WHEN ts.Result = 'CANCELED' THEN 1 ELSE 0 END) AS CanceledCount,
		AVG(CASE WHEN ts.ServiceDuration IS NOT NULL AND ts.ServiceDuration > 0 THEN ts.ServiceDuration ELSE NULL END) AS AvgServiceDuration
	FROM QueMIF_TicketsSettlement ts
	INNER JOIN QueMIF_Tickets t ON t.TicketID = ts.TicketID
	INNER JOIN QueMIF_Services s ON s.ServiceID = t.ServiceID
	WHERE 
		CAST(t.QueueDate AS DATE) = @QueueDate
		AND (@BranchID IS NULL OR t.BranchID = @BranchID)
	GROUP BY s.ServiceID, s.Code, s.Name
	ORDER BY s.Code;

	-- Get individual ticket details
	SELECT 
		t.TicketNumber,
		t.PlateNumber,
		t.CustomerName,
		t.AgreementNo,
		s.Code AS ServiceCode,
		s.Name AS ServiceName,
		c.Name AS CounterName,
		u.FullName AS ServedByName,
		ts.Result AS Status,
		t.CreatedAt,
		t.CalledAt,
		t.StartedAt,
		t.FinishedAt,
		DATEDIFF(MINUTE, t.CreatedAt, ISNULL(t.CalledAt, t.FinishedAt)) AS WaitingMinutes,
		ts.ServiceDuration,
		ts.HoldDuration
	FROM QueMIF_Tickets t
	LEFT JOIN QueMIF_TicketsSettlement ts ON ts.TicketID = t.TicketID
	LEFT JOIN QueMIF_Services s ON s.ServiceID = t.ServiceID
	LEFT JOIN QueMIF_Counters c ON c.CounterID = ts.CounterID
	LEFT JOIN QueMIF_Users u ON u.UserID = ts.UserID
	WHERE 
		CAST(t.QueueDate AS DATE) = @QueueDate
		AND (@BranchID IS NULL OR t.BranchID = @BranchID)
	ORDER BY t.CreatedAt;

	-- Get waiting tickets (Status = WAITING)
	SELECT 
		t.TicketID,
		t.TicketNumber,
		t.PlateNumber,
		t.CustomerName,
		t.AgreementNo,
		s.Code AS ServiceCode,
		s.Name AS ServiceName,
		t.Status,
		t.CreatedAt,
		DATEDIFF(MINUTE, t.CreatedAt, GETDATE()) AS WaitingMinutes
	FROM QueMIF_Tickets t
	INNER JOIN QueMIF_Services s ON s.ServiceID = t.ServiceID
	WHERE 
		CAST(t.QueueDate AS DATE) = @QueueDate
		AND (@BranchID IS NULL OR t.BranchID = @BranchID)
		AND t.Status = 'WAITING'
	ORDER BY t.CreatedAt;
END
GO

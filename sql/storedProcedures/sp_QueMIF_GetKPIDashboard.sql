USE [BIIFDBPROD2]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_QueMIF_GetKPIDashboard]
	@BranchID INT = NULL,
	@QueueStartDate DATETIME = NULL,
	@QueueEndDate DATETIME = NULL
AS
BEGIN
	SET NOCOUNT ON;

    IF @QueueStartDate IS NULL
        SET @QueueStartDate = CAST(CAST(GETDATE() AS DATE) AS DATETIME);
    
    IF @QueueEndDate IS NULL
        SET @QueueEndDate = GETDATE();

	SELECT 
        COUNT(t.TicketID) AS TotalAntrian,
        ISNULL(AVG(CAST(ts.ServiceDuration AS FLOAT)), 0) AS AvgTimeService,
        ISNULL((CAST(SUM(CASE WHEN ts.Result = 'NO SHOW' THEN 1 ELSE 0 END) AS FLOAT) / NULLIF(COUNT(t.TicketID), 0)) * 100, 0) AS NoShowRate,
        ISNULL(SUM(CASE WHEN ts.Result = 'COMPLETE' THEN 1 ELSE 0 END), 0) AS TotalComplete,
        ISNULL(SUM(CASE WHEN ts.Result = 'CANCEL' THEN 1 ELSE 0 END), 0) AS TotalCancel,
        ISNULL(SUM(CASE WHEN ts.Result = 'NO SHOW' THEN 1 ELSE 0 END), 0) AS TotalNoShow,
        ISNULL(SUM(CASE WHEN t.Status = 'ON SERVE' THEN 1 ELSE 0 END), 0) AS TotalServing
    FROM QueMIF_Tickets t
    LEFT JOIN QueMIF_TicketsSettlement ts ON ts.TicketID = t.TicketID
    WHERE (@BranchID IS NULL OR t.BranchID = @BranchID)
      AND (t.CreatedAt BETWEEN @QueueStartDate AND @QueueEndDate)
END
GO

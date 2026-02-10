USE [BIIFDBPROD2]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_QueMIF_GetHourlyStats]
	@BranchID INT,
	@QueueDate DATE = NULL
AS
BEGIN
	SET NOCOUNT ON;

	IF @QueueDate IS NULL
		SET @QueueDate = CAST(GETDATE() AS DATE);

	-- Initialize hours 8-17 (or flexible range)
	;WITH Hours AS (
		SELECT 8 AS Hour
		UNION ALL
		SELECT Hour + 1 FROM Hours WHERE Hour < 17
	)
	SELECT 
		h.Hour,
		COUNT(t.TicketID) AS Count
	FROM Hours h
	LEFT JOIN QueMIF_Tickets t ON DATEPART(HOUR, t.CreatedAt) = h.Hour 
		AND CAST(t.CreatedAt AS DATE) = @QueueDate
		AND t.BranchID = @BranchID
        AND t.Status != 'CANCELLED' -- Optional: decide if cancelled counts
	GROUP BY h.Hour
	ORDER BY h.Hour
END
GO

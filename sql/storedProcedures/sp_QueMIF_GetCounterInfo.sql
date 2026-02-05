USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_GetCounterInfo]    Script Date: 05/02/2026 12:21:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Stored Procedure: sp_QueMIF_GetCounterInfo
-- Description: Get counter information for today
-- Returns: CS Name, Current Ticket Serving, Total Service Duration, Total Tickets Served
-- =============================================
ALTER PROCEDURE [dbo].[sp_QueMIF_GetCounterInfo]
    @CounterID INT,
    @QueueDate DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @QueueDate IS NULL
        SET @QueueDate = CAST(GETDATE() AS DATE)
    SELECT 
        c.CounterID,
        c.Name AS CounterName,
        c.NPK,
        c.NPK AS CSName,
        
        (
            SELECT TOP 1 t.TicketNumber
            FROM QueMIF_Tickets t
            WHERE t.CurrentCounterID = c.CounterID
                AND t.Status IN ('SERVING', 'CALLED')
                AND t.QueueDate = @QueueDate
            ORDER BY t.CalledAt DESC
        ) AS CurrentTicketNumber,
        
        ISNULL((
            SELECT SUM(ts.ServiceDuration)
            FROM QueMIF_TicketsSettlement ts
            WHERE ts.CounterID = c.CounterID
                AND CAST(ts.CreatedAt AS DATE) = @QueueDate
        ), 0) AS TotalServiceDuration,
        
        ISNULL((
            SELECT COUNT(*)
            FROM QueMIF_TicketsSettlement ts
            WHERE ts.CounterID = c.CounterID
                AND CAST(ts.CreatedAt AS DATE) = @QueueDate
        ), 0) AS TotalTicketServed
        
    FROM QueMIF_Counters c
    WHERE c.CounterID = @CounterID

END

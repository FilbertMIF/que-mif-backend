USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_GetAllCountersByBranch]    Script Date: 05/02/2026 12:15:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_GetAllCountersByBranch]
    @BranchID INT,
    @QueueDate DATE = NULL,
    @PageSize INT = 10,
    @CurrentPage INT = 1
AS
BEGIN
    SET NOCOUNT ON;

    IF @QueueDate IS NULL
        SET @QueueDate = CAST(GETDATE() AS DATE);

    IF @CurrentPage IS NULL OR @CurrentPage < 1
        SET @CurrentPage = 1;

    ;WITH CounterData AS
    (
        SELECT 
            c.CounterID,
            c.Name AS CounterName,
            c.NPK,
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
        WHERE (c.BranchID = @BranchID OR @BranchID IS NULL)
            AND c.IsActive = 1
    )

    SELECT
        *,
        COUNT(1) OVER() AS Total
    FROM CounterData
    ORDER BY CounterID
    OFFSET
        CASE 
            WHEN @PageSize = 0 THEN 0
            ELSE (@CurrentPage - 1) * @PageSize
        END ROWS
    FETCH NEXT
        CASE 
            WHEN @PageSize = 0 THEN 2147483647
            ELSE @PageSize
        END ROWS ONLY;
END

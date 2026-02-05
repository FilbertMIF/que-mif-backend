USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_GetTicketsSettlement]    Script Date: 02/02/2026 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_QueMIF_GetTicketsSettlement]
    @CurrentPage INT = 1,
    @PageSize INT = 10,
    @TicketID INT = NULL,
    @Result VARCHAR(50) = NULL,
    @UserID INT = NULL,
    @CounterID INT = NULL,
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @BranchID VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SET @CurrentPage = ISNULL(NULLIF(@CurrentPage, 0), 1);
    SET @PageSize = ISNULL(NULLIF(@PageSize, 0), 10);

    DECLARE @Offset INT = (@CurrentPage - 1) * @PageSize;

    SELECT 
        t.*, 
        s.Result, 
        s.Note as SettlementNote,
        s.CreatedAt as SettlementDate,
        s.ServiceDuration,
        s.HoldDuration
    FROM QueMIF_TicketsSettlement s
    JOIN QueMIF_Tickets t ON s.TicketID = t.TicketID
    WHERE (@TicketID IS NULL OR s.TicketID = @TicketID)
      AND (@Result IS NULL OR s.Result = @Result)
      AND (@UserID IS NULL OR s.UserID = @UserID)
      AND (@CounterID IS NULL OR s.CounterID = @CounterID)
      AND (@BranchID IS NULL OR s.BranchID = @BranchID)
      AND (
            (@StartDate IS NULL AND @EndDate IS NULL)
         OR (@StartDate IS NOT NULL AND @EndDate IS NULL AND CAST(s.CreatedAt AS DATE) >= @StartDate)
         OR (@StartDate IS NULL AND @EndDate IS NOT NULL AND CAST(s.CreatedAt AS DATE) <= @EndDate)
         OR (CAST(s.CreatedAt AS DATE) BETWEEN @StartDate AND @EndDate)
      )
    ORDER BY s.CreatedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;

    SELECT COUNT(1) AS Total
    FROM QueMIF_TicketsSettlement s
    WHERE (@TicketID IS NULL OR s.TicketID = @TicketID)
      AND (@Result IS NULL OR s.Result = @Result)
      AND (@UserID IS NULL OR s.UserID = @UserID)
      AND (@CounterID IS NULL OR s.CounterID = @CounterID)
      AND (@BranchID IS NULL OR s.BranchID = @BranchID)
      AND (
            (@StartDate IS NULL AND @EndDate IS NULL)
         OR (@StartDate IS NOT NULL AND @EndDate IS NULL AND CAST(s.CreatedAt AS DATE) >= @StartDate)
         OR (@StartDate IS NULL AND @EndDate IS NOT NULL AND CAST(s.CreatedAt AS DATE) <= @EndDate)
         OR (CAST(s.CreatedAt AS DATE) BETWEEN @StartDate AND @EndDate)
      );
END
GO

USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_GetTickets]    Script Date: 30/01/2026 16:29:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_GetTickets]
    @CurrentPage INT = 1,
    @PageSize INT = 10,
    @TicketID INT = NULL,
    @TicketNumber VARCHAR(50) = NULL,
    @Status VARCHAR(50) = NULL,
    @CurrentCounterID INT = NULL,
    @ServedByUserId INT = NULL,
    @StartQueueDate DATE = NULL,
    @EndQueueDate DATE = NULL,
    @PlateNumber VARCHAR(50) = NULL,
    @AgreementNo VARCHAR(50) = NULL,
    @CustomerName VARCHAR(255) = NULL,
    @BranchID VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SET @CurrentPage = ISNULL(NULLIF(@CurrentPage, 0), 1);
    SET @PageSize = ISNULL(NULLIF(@PageSize, 0), 10);

    DECLARE @Offset INT = (@CurrentPage - 1) * @PageSize;

    SELECT *
    FROM QueMIF_Tickets
    WHERE (@TicketID IS NULL OR TicketID = @TicketID)
      AND (@TicketNumber IS NULL OR TicketNumber = @TicketNumber)
      AND (@Status IS NULL OR Status = @Status)
      AND (@CurrentCounterID IS NULL OR CurrentCounterID = @CurrentCounterID)
      AND (@ServedByUserId IS NULL OR ServedByUserId = @ServedByUserId)
      AND (
            (@StartQueueDate IS NULL AND @EndQueueDate IS NULL)
         OR (@StartQueueDate IS NOT NULL AND @EndQueueDate IS NULL AND QueueDate >= @StartQueueDate)
         OR (@StartQueueDate IS NULL AND @EndQueueDate IS NOT NULL AND QueueDate <= @EndQueueDate)
         OR (QueueDate BETWEEN @StartQueueDate AND @EndQueueDate)
          )
      AND (@PlateNumber IS NULL OR PlateNumber = @PlateNumber)
      AND (@AgreementNo IS NULL OR AgreementNo = @AgreementNo)
      AND (@CustomerName IS NULL OR CustomerName = @CustomerName)
      AND (@BranchID IS NULL OR BranchID = @BranchID)
    ORDER BY CreatedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;

    SELECT COUNT(1) AS Total
    FROM QueMIF_Tickets
    WHERE (@TicketID IS NULL OR TicketID = @TicketID)
      AND (@TicketNumber IS NULL OR TicketNumber = @TicketNumber)
      AND (@Status IS NULL OR Status = @Status)
      AND (@CurrentCounterID IS NULL OR CurrentCounterID = @CurrentCounterID)
      AND (@ServedByUserId IS NULL OR ServedByUserId = @ServedByUserId)
      AND (
            (@StartQueueDate IS NULL AND @EndQueueDate IS NULL)
         OR (@StartQueueDate IS NOT NULL AND @EndQueueDate IS NULL AND QueueDate >= @StartQueueDate)
         OR (@StartQueueDate IS NULL AND @EndQueueDate IS NOT NULL AND QueueDate <= @EndQueueDate)
         OR (QueueDate BETWEEN @StartQueueDate AND @EndQueueDate)
          )
      AND (@PlateNumber IS NULL OR PlateNumber = @PlateNumber)
      AND (@AgreementNo IS NULL OR AgreementNo = @AgreementNo)
      AND (@CustomerName IS NULL OR CustomerName = @CustomerName)
      AND (@BranchID IS NULL OR BranchID = @BranchID)
END

USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_InsertTicket]    Script Date: 30/01/2026 16:32:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_InsertTicket]
    @ServiceID INT,
    @BranchID INT,
    @PlateNumber VARCHAR(50) = NULL,
    @AgreementNo VARCHAR(50) = NULL,
    @CustomerName VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    IF @CustomerName IS NULL OR LTRIM(RTRIM(@CustomerName)) = ''
    BEGIN
        THROW 50010, 'CustomerName is required', 1;
    END

    IF NOT EXISTS (
        SELECT 1
        FROM Branch
        WHERE BranchID = @BranchID
    )
    BEGIN
        THROW 50011, 'Invalid BranchID', 1;
    END

    IF NOT EXISTS (
        SELECT 1
        FROM QueMIF_Services
        WHERE ServiceID = @ServiceID
    )
    BEGIN
        THROW 50012, 'Invalid ServiceID', 1;
    END

    DECLARE @Today DATE = CAST(GETDATE() AS DATE);
    DECLARE @CountType CHAR(1);
    DECLARE @NextNumber INT;
    DECLARE @TicketNumber VARCHAR(10);

	SET @CountType = (SELECT TOP 1 Code FROM QueMIF_Services WHERE ServiceID = @ServiceID)

    IF EXISTS (
        SELECT 1
        FROM QueMIF_DailyCounters
        WHERE QueueDate = @Today
          AND BranchID = @BranchID
          AND CountType = @CountType
    )
    BEGIN
        UPDATE QueMIF_DailyCounters
        SET LastNumber = LastNumber + 1
        WHERE QueueDate = @Today
          AND BranchID = @BranchID
          AND CountType = @CountType;

        SELECT @NextNumber = LastNumber
        FROM QueMIF_DailyCounters
        WHERE QueueDate = @Today
          AND BranchID = @BranchID
          AND CountType = @CountType;
    END
    ELSE
    BEGIN
        INSERT INTO QueMIF_DailyCounters (QueueDate, LastNumber, BranchID, CountType)
        VALUES (@Today, 1, @BranchID, @CountType);

        SET @NextNumber = 1;
    END

    SET @TicketNumber =
        @CountType + RIGHT('000' + CAST(@NextNumber AS VARCHAR(3)), 3);

    INSERT INTO QueMIF_Tickets (
        TicketNumber,
        ServiceID,
        Status,
        QueueDate,
        CreatedAt,
        PlateNumber,
        AgreementNo,
        CustomerName,
        BranchID,
		TotalHoldDuration
    )
    VALUES (
        @TicketNumber,
        @ServiceID,
        'WAITING',
        @Today,
        GETDATE(),
        @PlateNumber,
        @AgreementNo,
        @CustomerName,
        @BranchID,
		0
    );

    SELECT
        SCOPE_IDENTITY() AS TicketID,
        @TicketNumber AS TicketNumber;
END
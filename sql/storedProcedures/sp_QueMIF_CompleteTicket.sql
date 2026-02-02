USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_CompleteTicket]    Script Date: 30/01/2026 16:27:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_CompleteTicket]
    @TicketID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM QueMIF_Tickets
        WHERE TicketID = @TicketID
    )
    BEGIN
        THROW 50040, 'Ticket not found', 1;
    END

    IF NOT EXISTS (
        SELECT 1
        FROM QueMIF_Tickets
        WHERE TicketID = @TicketID
          AND Status = 'ON SERVE'
    )
    BEGIN
        THROW 50041, 'Ticket is not being served', 1;
    END

	INSERT INTO QueMIF_TicketsSettlement(
		TicketID, 
		Result,
		UserID, 
		CounterID, 
		Note, 
		CreatedAt, 
		ServiceDuration, 
		HoldDuration,
		BranchID)
	 SELECT
        TicketID,
        'COMPLETE',
        ServedByUserID,
        CurrentCounterID,
        NULL,
        GETDATE(),
        DATEDIFF(SECOND, StartedAt, GETDATE()),
        ISNULL(TotalHoldDuration, 0),
		BranchID
    FROM QueMIF_Tickets
    WHERE TicketID = @TicketID;

    UPDATE QueMIF_Tickets
    SET
        Status = 'DONE',
        FinishedAt = GETDATE(),
        CurrentCounterID = NULL,
        ServedByUserID = NULL
    WHERE TicketID = @TicketID;

    SELECT @@ROWCOUNT AS Affected;
END

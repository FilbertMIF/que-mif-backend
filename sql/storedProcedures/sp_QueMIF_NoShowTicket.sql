USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_NoShowTicket]    Script Date: 30/01/2026 16:32:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_NoShowTicket]
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
        THROW 50031, 'Ticket not found', 1;
    END

	INSERT INTO QueMIF_TicketsSettlement(
		TicketID, 
		Result,
		UserID, 
		CounterID, 
		Note, 
		CreatedAt, 
		ServiceDuration, 
		HoldDuration)
	 SELECT
        TicketID,
        'NOSHOW',
        ServedByUserID,
        CurrentCounterID,
        NULL,
        GETDATE(),
        DATEDIFF(SECOND, StartedAt, GETDATE()),
        ISNULL(TotalHoldDuration, 0)
    FROM QueMIF_Tickets
    WHERE TicketID = @TicketID;

    UPDATE QueMIF_Tickets
    SET
        Status = 'NOSHOW',
        Note = '',
        FinishedAt = GETDATE(),
        CurrentCounterID = NULL,
        ServedByUserID = NULL,
        HoldAt = NULL
    WHERE TicketID = @TicketID;

    SELECT @@ROWCOUNT AS Affected;
END

USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_HoldTicket]    Script Date: 30/01/2026 16:30:03 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_HoldTicket]
    @TicketID INT,
    @HoldReason VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    IF @HoldReason IS NULL OR LTRIM(RTRIM(@HoldReason)) = ''
    BEGIN
        THROW 50030, 'HoldReason is required', 1;
    END

    IF NOT EXISTS (
        SELECT 1
        FROM QueMIF_Tickets
        WHERE TicketID = @TicketID
    )
    BEGIN
        THROW 50031, 'Ticket not found', 1;
    END

    IF NOT EXISTS (
        SELECT 1
        FROM QueMIF_Tickets
        WHERE TicketID = @TicketID
          AND Status = 'ON SERVE'
    )
    BEGIN
        THROW 50032, 'Only ON SERVE ticket can be held', 1;
    END

    UPDATE QueMIF_Tickets
    SET
        CurrentCounterID = NULL,
        ServedByUserID = NULL,
        Status = 'ON HOLD',
        HoldAt = GETDATE(),
        HoldReason = @HoldReason
    WHERE TicketID = @TicketID;

    SELECT @@ROWCOUNT AS Affected;
END

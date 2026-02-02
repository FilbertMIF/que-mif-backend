USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_AssignTicket]    Script Date: 30/01/2026 16:26:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_AssignTicket]
    @TicketID INT,
    @CounterID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check ticket exists
    IF NOT EXISTS (
        SELECT 1
        FROM QueMIF_Tickets
        WHERE TicketID = @TicketID
    )
    BEGIN
        THROW 50020, 'Ticket not found', 1;
    END

    -- Check counter exists, is active, has NPK
    IF NOT EXISTS (
        SELECT 1
        FROM QueMIF_Counters
        WHERE CounterID = @CounterID
          AND IsActive = 1
          AND NPK IS NOT NULL
          AND NPK <> ''
    )
    BEGIN
        THROW 50021, 'Invalid or inactive counter', 1;
    END

    -- Check counter is not serving another ticket
    IF EXISTS (
        SELECT 1
        FROM QueMIF_Tickets
        WHERE CurrentCounterID = @CounterID
          AND Status = 'ON SERVE'
    )
    BEGIN
        THROW 50022, 'Counter is already serving another ticket', 1;
    END

    -- Check ticket and counter belong to the same branch
    IF EXISTS (
        SELECT 1
        FROM QueMIF_Tickets t
        CROSS JOIN QueMIF_Counters c
        WHERE t.TicketID = @TicketID
          AND c.CounterID = @CounterID
          AND t.BranchID <> c.BranchID
    )
    BEGIN
        THROW 50023, 'Ticket and counter must belong to the same branch', 1;
    END

    DECLARE @NPK VARCHAR(10);
    DECLARE @HoldSeconds INT = 0;

    SELECT @NPK = NPK
    FROM QueMIF_Counters
    WHERE CounterID = @CounterID;

    -- Calculate hold seconds if ticket is on hold
    SELECT
        @HoldSeconds = DATEDIFF(SECOND, HoldAt, GETDATE())
    FROM QueMIF_Tickets
    WHERE TicketID = @TicketID
      AND Status = 'ON HOLD'
      AND HoldAt IS NOT NULL;

    -- Assign ticket
    UPDATE QueMIF_Tickets
    SET
        CurrentCounterID = @CounterID,
        ServedByUserID = @NPK,
        Status = 'ON SERVE',
        StartedAt = GETDATE(),
        TotalHoldDuration = ISNULL(TotalHoldDuration, 0) + ISNULL(@HoldSeconds, 0),
        HoldAt = NULL,
        HoldReason = NULL
    WHERE TicketID = @TicketID;

    SELECT @@ROWCOUNT AS Affected;
END

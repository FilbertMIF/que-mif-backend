USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_InsertActivityLog]    Script Date: 30/01/2026 16:30:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_InsertActivityLog]
    @Action VARCHAR(255),
    @Entity VARCHAR(50),
	@EntityID INT,
	@BranchID INT,
	@NPK VARCHAR(10),
	@Payload VARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO QueMIF_ActivityLogs
            (Action, Entity, EntityID, BranchID, NPK, Payload)
            VALUES
            (@Action, @Entity, @EntityID, @BranchID, @NPK, @Payload)

    SELECT SCOPE_IDENTITY() AS CounterId;
END

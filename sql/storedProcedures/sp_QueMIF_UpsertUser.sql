USE [BIIFDBPROD2]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_QueMIF_UpsertUser]
    @UserID INT = NULL,
	@Username VARCHAR(50),
    @FullName VARCHAR(100),
    @Role VARCHAR(20),
    @BranchID INT = NULL,
    @NPK VARCHAR(20) = NULL,
    @IsActive BIT = 1
AS
BEGIN
	SET NOCOUNT ON;

    IF @UserID IS NOT NULL AND EXISTS (SELECT 1 FROM QueMIF_Users WHERE UserID = @UserID)
    BEGIN
        UPDATE QueMIF_Users
        SET FullName = @FullName,
            Role = @Role,
            BranchID = @BranchID,
            IsActive = @IsActive,
            NPK = @NPK,
            UpdatedAt = GETDATE()
        WHERE UserID = @UserID
    END
    ELSE
    BEGIN
        IF EXISTS (SELECT 1 FROM QueMIF_Users WHERE Username = @Username)
        BEGIN
             -- If username exists but no ID provided (or mismatch), maybe update by username?
             -- For safety, require ID for update. Or just fail.
             -- Let's update if username matches.
             UPDATE QueMIF_Users
            SET FullName = @FullName,
                Role = @Role,
                BranchID = @BranchID,
                IsActive = @IsActive,
                NPK = @NPK,
                UpdatedAt = GETDATE()
            WHERE Username = @Username
        END
        ELSE
        BEGIN
            INSERT INTO QueMIF_Users (Username, FullName, Role, BranchID, NPK, IsActive)
            VALUES (@Username, @FullName, @Role, @BranchID, @NPK, @IsActive)
        END
    END
END
GO

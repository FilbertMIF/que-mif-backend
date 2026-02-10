USE [BIIFDBPROD2]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_QueMIF_GetBranches]
    @PageSize INT = 0,
    @CurrentPage INT = 1
AS
BEGIN
    SET NOCOUNT ON;

    -- Calculate offset for pagination
    DECLARE @Offset INT = (@CurrentPage - 1) * @PageSize

    -- Get total count
    DECLARE @TotalRecords INT
    SELECT @TotalRecords = COUNT(*) FROM Branch

    -- Return branches with pagination
    IF @PageSize = 0
    BEGIN
        -- No pagination, return all
        SELECT 
            BranchID,
            BranchFullName
        FROM Branch
        ORDER BY BranchID
    END
    ELSE
    BEGIN
        -- With pagination
        SELECT 
            BranchID,
            BranchFullName
        FROM Branch
        ORDER BY BranchID
        OFFSET @Offset ROWS
        FETCH NEXT @PageSize ROWS ONLY
    END

    -- Return total count for pagination metadata
    SELECT @TotalRecords AS TotalRecords
END
GO

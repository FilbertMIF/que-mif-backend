USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_GetCounters]    Script Date: 30/01/2026 16:28:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_GetCounters]
    @PageSize INT,
    @CurrentPage INT,
    @IsActive BIT = NULL,
    @Name VARCHAR(255) = NULL,
    @BranchID INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        *,
        COUNT(1) OVER() AS Total
    FROM QueMIF_Counters
    WHERE (@IsActive IS NULL OR IsActive = @IsActive)
        AND (@Name IS NULL OR Name LIKE '%' + @Name + '%')
        AND (@BranchID IS NULL OR BranchID = @BranchID)
    ORDER BY CounterID
    OFFSET
        CASE WHEN @PageSize = 0 THEN 0 ELSE (@CurrentPage - 1) * @PageSize END ROWS
    FETCH NEXT
        CASE WHEN @PageSize = 0 THEN 1000000000 ELSE @PageSize END ROWS ONLY;
END

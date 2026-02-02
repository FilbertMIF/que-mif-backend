USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_GetServices]    Script Date: 30/01/2026 16:28:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_GetServices]
    @CurrentPage INT,
    @PageSize INT,
    @Code VARCHAR(10) = NULL,
    @Name VARCHAR(255) = NULL,
    @IsActive BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        *,
        COUNT(1) OVER() AS Total
    FROM QueMIF_Services
    WHERE (@Code IS NULL OR Code = @Code)
      AND (@Name IS NULL OR Name LIKE '%' + @Name + '%')
      AND (@IsActive IS NULL OR IsActive = @IsActive)
    ORDER BY ServiceID
    OFFSET
        CASE WHEN @PageSize = 0 THEN 0 ELSE (@CurrentPage - 1) * @PageSize END ROWS
    FETCH NEXT
        CASE WHEN @PageSize = 0 THEN 1000000000 ELSE @PageSize END ROWS ONLY;
END

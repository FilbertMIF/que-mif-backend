USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_GetSetting]    Script Date: 05/02/2026 11:50:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_GetSetting]
AS
BEGIN
    SELECT * FROM QueMIF_Settings ORDER BY SettingID
END


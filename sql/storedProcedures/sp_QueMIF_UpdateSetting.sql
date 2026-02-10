USE [BIIFDBPROD2]
GO
/****** Object:  StoredProcedure [dbo].[sp_QueMIF_UpdateSetting]    Script Date: 05/02/2026 11:49:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_QueMIF_UpdateSetting]
    @SettingID INT,
	@SettingValue VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1 FROM QueMIF_Settings WHERE SettingID = @SettingID
    )
    BEGIN
        THROW 50101, 'Setting not found', 1;
    END

    UPDATE QueMIF_Settings
    SET
		SettingValue = @SettingValue,
		UpdatedAt = GETDATE()
    WHERE SettingID = @SettingID;

    SELECT @@ROWCOUNT AS Affected;
END


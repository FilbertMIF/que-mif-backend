SELECT TOP (1000) [SettingID]
      ,[SettingKey]
      ,[SettingValue]
      ,[Description]
      ,[UpdatedAt]
  FROM [BIIFDBPROD2].[dbo].[QueMIF_Settings]

-- SettingID	SettingKey	SettingValue	Description	UpdatedAt
-- 1	OFFICE_OPEN_TIME	08:00	Jam buka layanan	NULL
-- 2	OFFICE_CLOSE_TIME	16:00	Jam tutup layanan	NULL
-- 3	MAX_TICKET_PER_SERVICE	100	Maksimal tiket per layanan per hari	NULL
-- 4	RECALL_LIMIT	3	Maksimal panggilan ulang sebelum NO_SHOW	NULL
-- 5	COMPANY_NAME	PT. Mandala Multifinance	Nama perusahaan untuk display	NULL
-- 6	HOLD_ENABLED	true	Aktifkan/nonaktifkan fitur Hold tiket	NULL
-- 7	HOLD_MAX_PER_CS	3	Maksimal tiket yang bisa di-hold per CS	NULL
-- 8	HOLD_REASON_REQUIRED	true	Wajib input alasan saat hold tiket	NULL
-- 9	HOLD_MAX_DURATION_MINUTES	30	Durasi maksimal hold dalam menit (0 = unlimited)	NULL
-- 10	HOLD_AUTO_CANCEL_ENABLED	false	Auto-cancel tiket jika melebihi durasi maksimal hold	NULL
-- 11	HOLD_WARNING_MINUTES	15	Tampilkan warning jika hold melebihi X menit	NULL
-- 12	HOLD_PREDEFINED_REASONS	["Menunggu dokumen","Customer ke ATM","Konsultasi supervisor","Verifikasi data","Lainnya"]	Daftar alasan hold yang sudah ditentukan (JSON array)	NULL
-- 13	HOLD_ALLOW_CUSTOM_REASON	true	Izinkan CS input alasan custom selain predefined	NULL
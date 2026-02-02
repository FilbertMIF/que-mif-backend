SELECT TOP (1000) [ActivityLogID]
      ,[Action]
      ,[Entity]
      ,[EntityID]
      ,[BranchID]
      ,[NPK]
      ,[Payload]
      ,[CreatedAt]
  FROM [BIIFDBPROD2].[dbo].[QueMIF_ActivityLogs]

-- ActivityLogID	Action	Entity	EntityID	BranchID	NPK	Payload	CreatedAt
-- 1	INSERT_TICKET	TICKET	1	999		{"ServiceID":"1","AgreementNo":"","PlateNumber":"","CustomerName":"Mark","BranchIDLogin":"999","NPKLogin":""}	2026-01-30 11:26:19.123
-- 2	CALL_TICKET	TICKET	1	999	249755	{"BranchIDLogin":"999","NPKLogin":"249755"}	2026-01-30 11:26:21.383
-- 3	ASSIGN_TICKET	TICKET	1	999	249755	{"CounterID":"1","BranchIDLogin":"999","NPKLogin":"249755"}	2026-01-30 11:26:25.923
-- 4	CANCEL_TICKET	TICKET	1	999	249755	{"BranchIDLogin":"999","NPKLogin":"249755"}	2026-01-30 11:26:33.227
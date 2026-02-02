SELECT TOP (1000) [LogID]
      ,[TicketID]
      ,[Result]
      ,[UserID]
      ,[CounterID]
      ,[Note]
      ,[CreatedAt]
      ,[ServiceDuration]
      ,[HoldDuration]
      ,[BranchID]
  FROM [BIIFDBPROD2].[dbo].[QueMIF_TicketsSettlement]

-- LogID	TicketID	Result	UserID	CounterID	Note	CreatedAt	ServiceDuration	HoldDuration	BranchID
-- 1	1	COMPLETE	249755	1	NULL	2026-01-30 11:26:33.187	8	0	999
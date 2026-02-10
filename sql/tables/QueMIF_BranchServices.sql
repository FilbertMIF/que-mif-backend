USE [BIIFDBPROD2]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[QueMIF_BranchServices]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[QueMIF_BranchServices](
	[BranchID] [int] NOT NULL,
	[ServiceID] [int] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedAt] [datetime] NULL,
	[UpdatedAt] [datetime] NULL,
 CONSTRAINT [PK_QueMIF_BranchServices] PRIMARY KEY CLUSTERED 
(
	[BranchID] ASC,
	[ServiceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

ALTER TABLE [dbo].[QueMIF_BranchServices] ADD  CONSTRAINT [DF_QueMIF_BranchServices_IsActive]  DEFAULT ((1)) FOR [IsActive]

ALTER TABLE [dbo].[QueMIF_BranchServices] ADD  CONSTRAINT [DF_QueMIF_BranchServices_CreatedAt]  DEFAULT (getdate()) FOR [CreatedAt]

ALTER TABLE [dbo].[QueMIF_BranchServices] ADD  CONSTRAINT [DF_QueMIF_BranchServices_UpdatedAt]  DEFAULT (getdate()) FOR [UpdatedAt]

END
GO

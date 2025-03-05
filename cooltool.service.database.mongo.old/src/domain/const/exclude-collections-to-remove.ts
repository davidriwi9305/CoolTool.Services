function ISODate(arg0: string) {
    return new Date(arg0);
}

export const excludeCollectionsToRemove = [
    {
        "Name": "system.indexes",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "WhiteLabel",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ReviewConcern",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "CacheReportSlideDataSource",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "DishonestRespondents",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "WebEyeTrackerToken",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "PromoCode",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "AccountPromoCode",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "SubscriptionSpec",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "PanelInfo",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ProjectContactFeedBack",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "PrototypeQuestionDevices",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "QuestTag",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "MobileDevice",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "UserMobileDevice",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "GazeTrackerStatistic",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "UserSystemSettings",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ProjectContactQuota",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NeurolabRTTIndexValue",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "BlockObjectIdGenerator",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "Language",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "CVMessage",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "RSSSettings",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "JobRunnerSettings",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "DesignControlsTemplate",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "PublicPagesMarketItems",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "MarketItemTagCategory",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ReviewVote",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "SubscriptionPackage",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "OxfordFaceAPIKey",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "HelpArticleUserReport",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NeuroLabWebEyeTrackerJobActivity",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "TranslationAudioLang",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "DownloadResourceItem",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ProjectSurveyEmail",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "UserInterfaceAvailability",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NeuroLabLog",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "MarketItemRatingVote",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "BenchmarkData",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "WebHookEvents",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NeurolabCalibrationScheme",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "AccountResource",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "MarketItemReview",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "SystemSettings",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "Unsubscribe",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ReportConfigurationItem",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ServiceBid",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "TypeIdReference",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "SystemEventFilter",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NewsletterSubscriber",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ContentGroup",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "MarketItemTag",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "MessagingHost",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NotificationMessageTemplate",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ProjectContactAnswerCoding",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NeurolabFaceCheckSettings",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "JobSettings",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "DeliveryPriceGroup",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "RespondentAoiCalculated",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ProjectSampleCell",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "UserAgreements",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "HelpArticle",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ServiceJob",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "AutoPanelQuotaGroup",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ContactListDescriptionIndex",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "EmailMessageTemplate",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "TranslationAudioItem",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "UserMessage",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ImplicitTestObjectAttribute",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ContactsImportSession",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "Subscription",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ProjectInvitation",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "SectionRandomizationGroup",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NeuroLabAppAudit",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ObjectStateLog",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NeuroLabScreenshotChunks",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ContentItem",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ContentItemTranslation",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NeuroLabAppLogs",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ContactList",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "BlogEntry",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "AutoPanelSettingsUpdate",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "QuestTranslationItem",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "Company",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "DataCollectorAutoPanelSetting",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ContactListAttribute",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "QuoteCell",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ReportVideo",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "QuoteCellItem",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "CodingList",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NeuroLabAppEnvironmentInfo",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "UserInfo",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "QuestItemCondition",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "User",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "CalibrationData",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "RespondentFeedback",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "DataCollectorBacklinkSettings",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "Account",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "DesignSettings",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "QueueMessage",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "Sample",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "AtomicTransaction",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "OrderItem",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ExportSettings",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "SaleOrder",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "Report",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "CodingListRule",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "MarketItem",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "SystemEvent",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NeuroLabWebSiteData",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "AutoPanelProviderSettings",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "CreditsCharge",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NeurolabStatisticsProcessTask",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NonUniqueProjectContactLog",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "Design",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "Attachment",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "DBObjectType",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ProjectShare",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "DataCollector",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "EyeTrackingAOI",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "QuestTranslationLang",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "FilterCondition",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ProjectSchedule",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "Quest",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ResolveProjectContactQuotaTask",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NotificationTask",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ReportItemsGenerationTask",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NotificationTaskHistory",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ProjectReportExportTask",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "CommonJobTask",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "VideoToFramesTask",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ProjectDataExportTask",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "MSTOSocketClosingTask",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "UserNotification",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "InfoLog",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "VideoProcessorTask",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "EndLinkLog",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ProjectContactAnswerInfo",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "QuestItemConditionsBlock",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ProjectContactContext",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ReportItemDimension",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ExceptionLog",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ReportItemStateSettings",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "UserEventLog",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NeuroLabWebEyeTrackerTask",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ReportItem",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "QuestItem",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ExternalPanelLog",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NeuroLabImplicitTestData",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "NeuroLabMindData",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "Alternative",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "Contact",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "QuestionTimeMeasure",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ChartConfig",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "RespondentDeviceLog",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "EmailMessage",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "ProjectContact",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },
    {
        "Name": "QuestRandomizerStats",
        "Excluded": true,
        "BatchSize": 1000,
        "YearsAgoToRemove": 5
    },

    // Running
    {
        "Name": "Project", //Working
        "Excluded": true,
        "BatchSize": 10000,
        "YearsAgoToRemove": 5,
        "UpdateIndex": false
    },
    {
        "Name": "HttpRequestLog", //Working
        "Excluded": true,
        "BatchSize": 10000,
        "YearsAgoToRemove": 5,
        "UpdateIndex": false,
        "FieldToCheck": "CreateDate"
    },
    {
        "Name": "NeurolabData",
        "Excluded": true,
        "BatchSize": 2,
        "YearsAgoToRemove": 5,
        "UpdateIndex": false,
        // Inside this collection we can't remove data using YearsAgoToRemove, we can´t compare dates
        // The CaptureCollection field was created in December 2020. In this database we have no creation or update, that's why I chose these fields to filter the data from this point.
        // If CaptureCollection does not exist it is because it is an old record before December 2020
        "QueryToRemove": { CaptureCollection: { $exists: false } }
    },
    {
        "Name": "ProjectContactAnswer", //working more or less
        "Excluded": true,
        "BatchSize": 1, //100000,
        "YearsAgoToRemove": 5,
        "UpdateIndex": false,
        "FieldToCheck": "CreateDate" 
    },
    {
        "Name": "NeuroLabEyeTrackerData", //working more or less
        "Excluded": true,
        "BatchSize": 1,
        "YearsAgoToRemove": 5,
        "UpdateIndex": false,
        // Inside this collection we can't remove data using YearsAgoToRemove, we can´t compare dates
        // The WETFixations field was created in December 2020. In this database we have no creation or update, that's why I chose these fields to filter the data from this point.
        // If WETFixations does not exist it is because it is an old record before December 2020
        "QueryToRemove": { WETFixations: { $exists: false } }
    },
    {
        "Name": "CaptureCollection",  //working
        "Excluded": false,
        "BatchSize": 150, //1000 default
        "YearsAgoToRemove": 3,
        "UpdateIndex": false,
        // "QueryToRemove": {_id:{$lt:194053441}} // First we are going to remove all elements before this id, which means is old than 2017
        "QueryToRemove": { "LastUpdated": { "$lt": ISODate("2021-12-31T00:00:00.000Z") },"CreateDate": { "$lt": ISODate("2021-12-31T00:00:00.000Z") } } // comenzar subiendo update hasta 2021, removiendo poco a poco y avanzando luego con el create_date
    }
]
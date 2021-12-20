// <copyright file="ContentResolver.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using Blog.Application.Common.Content.Abstractions;
using Blog.Application.Common.Exceptions;
using Blog.Application.Common.Mappers.Helpers;
using Blog.Application.DataModels;
using Blog.Application.Models;
using Blog.Application.Models.PageModels;
using Blog.Application.Models.PageModels.Abstractions;
using Microsoft.Extensions.Configuration;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Web;
using Umbraco.Extensions;

namespace Blog.Application.Common.Content;

internal class ContentResolver : IContentResolver
{
    private readonly IUmbracoContextAccessor _contextAccessor;
    private readonly IConfiguration _config;

    public ContentResolver(IUmbracoContextAccessor contextAccessor, IConfiguration config)
    {
        _contextAccessor = contextAccessor;
        _config = config;
    }

    public IContentWrapper GetContent(IPublishedContent publishedContent)
    {
        if (publishedContent == null)
        {
            throw new NotFoundException($"Could not resolve content for \"{publishedContent}\"");
        }

        var content = MapperHelper.Map(publishedContent);
        var settings = GetWebsiteSettings(content);

        return new ContentWrapper(
            publishedContent.Key,
            publishedContent.Url(),
            publishedContent.GetTemplateAlias(),
            publishedContent.ContentType.Alias,
            content,
            settings);
    }

    private WebsiteSettings GetWebsiteSettings(object content)
    {
        if (!_contextAccessor.TryGetUmbracoContext(out var context))
        {
            throw new Exception("Could not access umbraco context");
        }

        var settingsXPath = _config.GetValue<string>("WebsiteSettings:XPath");
        var settingsContent = context.Content.GetSingleByXPath(settingsXPath);

        if (settingsContent is not Settings settings)
        {
            throw new Exception($"Settings content on XPath {settingsXPath} is not of type Settings");
        }

        var pageTitle = _config.GetValue<string>("WebsiteSettings:Title");

        if (content is IPageTitle contentTitle && settings.WebsiteTitle is not null)
        {
            pageTitle = string.Format(settings.WebsiteTitle, contentTitle.Title);
        }

        return new WebsiteSettings
        {
            Title = pageTitle
        };
    }
}

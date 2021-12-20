// <copyright file="ContentResolver.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using Blog.Application.Common.Content.Abstractions;
using Blog.Application.Common.Exceptions;
using Blog.Application.Common.Mappers.Helpers;
using Blog.Application.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;

namespace Blog.Application.Common.Content;

internal class ContentResolver : IContentResolver
{
    public IContentWrapper GetContent(IPublishedContent publishedContent)
    {
        if (publishedContent == null)
        {
            throw new NotFoundException($"Could not resolve content for \"{publishedContent}\"");
        }

        var content = MapperHelper.Map(publishedContent);

        return new ContentWrapper(
            publishedContent.Key,
            publishedContent.Url(),
            publishedContent.GetTemplateAlias(),
            publishedContent.ContentType.Alias,
            content);
    }
}

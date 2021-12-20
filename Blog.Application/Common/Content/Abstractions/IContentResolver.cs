// <copyright file="IContentResolver.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using Blog.Application.Models;
using Umbraco.Cms.Core.Models.PublishedContent;

namespace Blog.Application.Common.Content.Abstractions;

public interface IContentResolver
{
    public IContentWrapper GetContent(IPublishedContent content);
}

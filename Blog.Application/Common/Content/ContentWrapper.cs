// <copyright file="ContentWrapper.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using Blog.Application.Models;

namespace Blog.Application.Common.Content;

internal class ContentWrapper : IContentWrapper
{
    public ContentWrapper(Guid key, string url, string template, string type, object content)
    {
        Key = key;
        Url = url;
        Template = template;
        Type = type;
        Content = content;
    }

    public Guid Key { get; init; }

    public string Url { get; init; }

    public string Template { get; init; }

    public string Type { get; init; }

    public object Content { get; init; }
}

// <copyright file="IContentWrapper.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using System;
using Blog.Application.Models.PageModels;

namespace Blog.Application.Models;

public interface IContentWrapper
{
    public Guid Key { get; init; }

    public string Url { get; init; }

    public string Type { get; init; }

    public string Template { get; init; }

    public object Content { get; init; }

    public WebsiteSettings Settings { get; init; }
}

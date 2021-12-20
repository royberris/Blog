// <copyright file="WebsiteSettingsMapper.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using Blog.Application.Common.Mappers.Abstractions;
using Blog.Application.DataModels;
using Blog.Application.Models.PageModels;

namespace Blog.Application.Common.Mappers;

public class WebsiteSettingsMapper : IMapper
{
    public WebsiteSettings Map(Settings settings)
    {
        return new WebsiteSettings()
        {
            Title = settings?.WebsiteTitle
        };
    }
}

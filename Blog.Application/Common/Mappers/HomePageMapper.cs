// <copyright file="HomePageMapper.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using Blog.Application.Common.Mappers.Abstractions;
using Blog.Application.DataModels;
using Blog.Application.Models.PageModels;

namespace Blog.Application.Common.Mappers;

public class HomePageMapper : IMapper
{
    public HomePageModel Map(HomePage content)
    {
        return new HomePageModel
        {
            Title = content.Title ?? string.Empty,
        };
    }
}

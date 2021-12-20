// <copyright file="HomePageModel.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using Blog.Application.Models.PageModels.Abstractions;

namespace Blog.Application.Models.PageModels;

public class HomePageModel : IPageTitle
{
    public string Title { get; set; } = string.Empty;
}

// <copyright file="HomePageModel.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

namespace Blog.Application.Models.PageModels;

public class HomePageModel : IPageModel
{
    public string Title { get; set; } = string.Empty;
}

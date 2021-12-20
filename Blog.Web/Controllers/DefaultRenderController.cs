// <copyright file="DefaultRenderController.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using Blog.Application.Common.Content.Abstractions;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Web.Common.Controllers;

namespace Blog.Umbraco.Controllers;

public class DefaultRenderController : Controller, IRenderController
{
    private readonly IContentResolver _contentResolver;

    public DefaultRenderController(IContentResolver contentResolver)
    {
        _contentResolver = contentResolver;
    }

    public IActionResult Index(IPublishedContent content)
    {
        var wrapper = _contentResolver.GetContent(content);

        //return Ok(wrapper);
        return View(wrapper.Template, wrapper.Content);
    }
}

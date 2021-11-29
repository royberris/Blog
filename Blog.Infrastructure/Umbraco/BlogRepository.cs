// <copyright file="BlogRepository.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using Blog.Application.Common.Interfaces;
using Blog.Domain.Entities;
using Umbraco.Cms.Core.Models.PublishedContent;

namespace Blog.Infrastructure.Umbraco;

public class BlogRepository : IBlogRepository
{
    private readonly IPublishedContent _publishedContent;

    public BlogRepository(IPublishedContent publishedContent)
    {
        _publishedContent = publishedContent;
    }

    public Task<IList<BlogItem>> GetBlogs(int page)
    {
        return null;
    }
}

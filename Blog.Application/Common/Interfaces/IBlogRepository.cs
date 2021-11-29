// <copyright file="IBlogRepository.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using Blog.Domain.Entities;

namespace Blog.Application.Common.Interfaces;

public interface IBlogRepository
{
    Task<IList<BlogItem>> GetBlogs(int page);
}
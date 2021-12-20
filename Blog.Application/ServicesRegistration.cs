// <copyright file="ServicesRegistration.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using Blog.Application.Common.Content;
using Blog.Application.Common.Content.Abstractions;
using Microsoft.Extensions.DependencyInjection;

namespace Blog.Application;

public static class ServicesRegistration
{
    public static void AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IContentResolver, ContentResolver>();
    }
}

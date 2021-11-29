// <copyright file="ServiceRegistration.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using Blog.Application.Common.Interfaces;
using Blog.Infrastructure.Umbraco;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Umbraco.Extensions;

namespace Blog.Infrastructure
{
    public static class ServiceRegistration
    {
        public static void AddInfrastructure(this IServiceCollection services, IWebHostEnvironment environment, IConfiguration config)
        {
            services.AddUmbraco(environment, config)
                .AddBackOffice()
                .AddUmbracoCore()
                .Build();

            services.AddScoped<IBlogRepository, BlogRepository>();
        }
    }
}

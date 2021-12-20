// <copyright file="Startup.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using Blog.Application;
using Blog.Umbraco.Controllers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Web.Website.Controllers;
using Umbraco.Extensions;

namespace Blog.Umbraco;

public class Startup
{
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _config;

    public Startup(IWebHostEnvironment environment, IConfiguration config)
    {
        _environment = environment;
        _config = config;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddRazorPages();

        services.AddUmbraco(_environment, _config)
            .AddWebsite()
            .AddBackOffice()
            .AddComposers()
            .AddModelsBuilder()
            .Build();

        services.AddApplication();

        services.Configure<UmbracoRenderingDefaultsOptions>(c =>
        {
            c.DefaultControllerType = typeof(DefaultRenderController);
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseUmbraco()
            .WithMiddleware(u =>
            {
                u.UseWebsite();
                u.UseBackOffice();
            })
            .WithEndpoints(u =>
            {
                u.UseWebsiteEndpoints();
                u.UseBackOfficeEndpoints();
            });
    }
}

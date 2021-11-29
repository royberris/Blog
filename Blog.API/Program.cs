// <copyright file="Program.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

namespace Blog.API;

public class Program
{
    public static void Main(string[] args)
            => CreateHostBuilder(args)
                .Build()
                .Run();

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
}
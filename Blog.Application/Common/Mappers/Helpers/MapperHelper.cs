// <copyright file="MapperHelper.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using Blog.Application.Common.Exceptions;
using Blog.Application.Common.Mappers.Abstractions;
using Umbraco.Cms.Core.Models.PublishedContent;

namespace Blog.Application.Common.Mappers.Helpers;

internal static class MapperHelper
{
    public static object Map(IPublishedContent content)
    {
        var contentType = content.GetType();
        var mappers = AppDomain.CurrentDomain.GetAssemblies().SelectMany(a => a.GetTypes()).Where(t => t.GetInterfaces().Contains(typeof(IMapper)));

        const string mapMethodName = "Map";

        var mapper = mappers.FirstOrDefault(t => t.GetMethods().Any(m => m.Name.Equals(mapMethodName, StringComparison.OrdinalIgnoreCase) && m.GetParameters().Length == 1));

        if (mapper is null)
        {
            throw new MapperException($"Cannot resolve mapper for {contentType.Name}");
        }

        var methodInfo = mapper.GetMethod(mapMethodName);

        if (methodInfo?.GetParameters()?.All(p => p.ParameterType == contentType) == false)
        {
            throw new MapperException($"Cannot get mapper method for {contentType.Name}");
        }

        var instantiatedMapper = Activator.CreateInstance(mapper);

        var result = methodInfo?.Invoke(instantiatedMapper, new[] { content });

        if (result is null)
        {
            throw new MapperException($"Cannot invoke map method for {contentType.Name}");
        }

        return result;
    }
}

// <copyright file="MapperException.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

namespace Blog.Application.Common.Exceptions;

public class MapperException : AppException
{
    public MapperException(string message)
        : base(message)
    {
    }
}

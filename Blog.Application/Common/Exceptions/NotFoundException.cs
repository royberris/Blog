// <copyright file="NotFoundException.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

namespace Blog.Application.Common.Exceptions;

public class NotFoundException : AppException
{
    public NotFoundException(string message)
        : base(message)
    {
    }
}

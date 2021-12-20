// <copyright file="AppException.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using System.Runtime.Serialization;

namespace Blog.Application.Common.Exceptions;

public abstract class AppException : Exception
{
    protected AppException()
    {
    }

    protected AppException(string? message)
        : base(message)
    {
    }

    protected AppException(SerializationInfo info, StreamingContext context)
        : base(info, context)
    {
    }

    protected AppException(string? message, Exception? innerException)
        : base(message, innerException)
    {
    }
}

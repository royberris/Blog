---
title: "Start Using a Cancellation Token in ASP.NET Core"
date: "2022-09-13"
excerpt: "Why and how to pass the ASP.NET Core request CancellationToken down the async call stack to Entity Framework Core, so aborted requests stop wasting resources."
tags: [".NET", "C#", "Best Practices"]
author: "Roy Berris"
---

# Start Using a Cancellation Token in ASP.NET Core

*Originally published on the old Berris.dev blog in September 2022 and moved here with its original text.*

Every ASP.NET Core request has a cancellation token. But a lot of the times we forget to pass it down the call stack. Here's how and why we should do it.

## The Cancellation Token

The cancellation token is a way of ending your request before it has finished processing in an asynchronous context. This is usually only useful in long running requests when we are talking about an ASP.NET Core app. Think about any form of database querying. Processing uploaded files. Converting a 10.000 row database query and exporting this into an Excel file. Things that take a bit longer. When we are using `async` and `await` we should always supply a `CancellationToken`. Because usually at the end of this chain, there is something that will be more resource intensive. It'll probably query the database. Or make a HTTP call. If the request is aborted for any reason, it will stop processing (when it can), so we don't end up wasting resources.

## Consuming the token

Let's look at an example with Entity Framework Core. The latest version at the time of writing (version 6.0) allows a lot of actions to be handled asynchronous. And you might notice something on every method that has the `Async` suffix. There is a `CancellationToken` in the method signature! But this is set to `default` when left empty. Which is equal to `CancellationToken.None`. A non-existent token. Doing nothing.

This means we should supply it, so whatever consumer we have, can consume it. And how do we do that? Easy! I will assume your `DbContext` is accessed from a service. Let's call this `IExampleService`, with a method called `Create`.

```csharp
public interface IExampleService
{
    public Task Create(ExampleModel model);
}

public class ExampleService : IExampleService
{
    private readonly DbContext _context;

    public ExampleService(DbContext context)
    {
        _context = context;
    }

    public async Task Create(ExampleModel model)
    {
        // ... code to convert model to an entity
        await _context.ExampleDbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
    }
}
```

This is just any ordinary service that will insert something in the database. And all we have to do is update the method body so it will take in a (possibly optional) parameter called `cancellationToken`. And provide this to Entity Framework so it can consume. Whatever Entity Framework does with it is up to them, but we've supplied it.

```csharp
public interface IExampleService
{
    public Task Create(ExampleModel model, CancellationToken token = default);
}

public class ExampleService : IExampleService
{
    private readonly DbContext _context;

    public ExampleService(DbContext context)
    {
        _context = context;
    }

    public async Task Create(ExampleModel model, CancellationToken token = default)
    {
        // ... code to convert model to an entity
        await _context.ExampleDbSet.AddAsync(entity, token);
        await _context.SaveChangesAsync(token);
    }
}
```

## Providing a token

Well, we can consume it in our services. But we also need to provide it. Because with above code we didn't really change anything. The token parameter is still equal to its default value.

Again, for the example, we'll create a controller which calls our `IExampleService`.

```csharp
public class ExampleController : Controller
{
    private readonly IExampleService _service;

    // ... Inject with constructor.

    [HttpPost]
    public async Task<IActionResult> Create(ExampleModel model)
    {
        await _service.Create(model, /*...*/);
    }
}
```

So what will we put in for our token? Can we make a new token with a `CancellationTokenSource`? Yes, we can. But this will not do anything. Because nothing is cancelling the token. This means we need a way to know if the request is aborted. Luckily ASP.NET will handle this for us, and we don't need to write anything. That's what a web framework is for, isn't it? It's very simple, there is a property on the `HttpContext` called `RequestAborted` which is of type `CancellationToken`.

```csharp
public class ExampleController : Controller
{
    private readonly IExampleService _service;

    // ... Inject with constructor.

    [HttpPost]
    public async Task<IActionResult> Create(ExampleModel model)
    {
        await _service.Create(model, HttpContext.RequestAborted);
    }
}
```

Another way to do this is to add a parameter to the method of type `CancellationToken`. ASP.NET will automatically map this to the `HttpContext.RequestAborted`. I personally find it cleaner to directly call it from the `HttpContext`, but it's preference really.

```csharp
[HttpPost]
public async Task<IActionResult> Create(ExampleModel model, CancellationToken token)
{
    // This just maps 'token' to `HttpContext.RequestAborted`
    await _service.Create(model, token);
}
```

The `HttpContext.RequestAborted` property "Notifies when the connection underlying this request is aborted and thus request operations should be cancelled." from Microsoft Learn.

[Read more](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.http.httpcontext.requestaborted)

## Conclusion

We should always provide a cancellation token down an async await chain because on the end of the chain there is a consumer that will most likely take up resources. We want to bind this resource to the caller by using the cancellation token of a way of knowing if we should stop putting resources in something that is cancelled.

In our example the caller was an HTTP request, and the consumer was Entity Framework querying a database.

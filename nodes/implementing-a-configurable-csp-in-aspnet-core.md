---
title: "Implementing a Configurable CSP in ASP.NET Core"
date: "2022-09-14"
excerpt: "What a Content Security Policy is and how to build one from appsettings.json with ASP.NET Core middleware, including report-only mode and excluded paths."
tags: [".NET", "Security"]
author: "Roy Berris"
---

# Implementing a Configurable CSP in ASP.NET Core

*Originally published on the old Berris.dev blog in September 2022 and moved here with its original text.*

The Content Security Policy is used by the browser to see which sources of data are allowed. This is an extra security layer that you should add to your website.

## What is a CSP

A CSP, short for Content Security Policy, is a layer of security you can add to your websites which will tell the browser on what sources to trust. You can configure which sources to allow in your `script` source, or in your `img` source. I can for example configure to only allow images from `google.com` or scripts from `analytics.google.com` and your own domain. And why would you want this? This is a way of mitigating XSS (cross-site scripting) attacks and exploiting the browsers trust of the content received from the server. This is especially necessary when you are working with personal data, like a log-in system. The malicious scripts might run calls in the background and try to steal data.

We want to limit the scripts that can be executed to be from trusted sources.

[Read more](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)

## Writing a CSP

Writing a CSP is simple. We need to provide the type, for which we are providing the allowed sources, and the sources themselves. We can provide full URLs, or only their domains. It supports wildcards with which you can allow all subdomains for example. Each type is separated with a semi-colon. I'll show you an example.

```text
script-src 'self' analytics.google.com;
img-src 'self';
```

This will only allow scripts from 'self', meaning the current domain, or from analytics.google.com. We also won't allow any images other than from our own domain.

This seems easy, right? It is, but it can be a bit complicated once we get to a real CSP. These can get very long. It's hard to maintain those CSPs, and it's better to write some code that will write it. Let's take a look at the CSP from mozilla.org at the time of writing.

```text
connect-src 'self' *.mozilla.net *.mozilla.org *.mozilla.com www.googletagmanager.com www.google-analytics.com region1.google-analytics.com logs.convertexperiments.com 1003350.metrics.convertexperiments.com 1003343.metrics.convertexperiments.com sentry.prod.mozaws.net o1069899.sentry.io o1069899.ingest.sentry.io https://accounts.firefox.com/ stage.cjms.nonprod.cloudops.mozgcp.net cjms.services.mozilla.com;
frame-src 'self' *.mozilla.net *.mozilla.org *.mozilla.com www.googletagmanager.com www.google-analytics.com www.youtube-nocookie.com trackertest.org www.surveygizmo.com accounts.firefox.com accounts.firefox.com.cn www.youtube.com;
script-src 'self' *.mozilla.net *.mozilla.org *.mozilla.com 'unsafe-inline' 'unsafe-eval' www.googletagmanager.com www.google-analytics.com tagmanager.google.com www.youtube.com s.ytimg.com cdn-3.convertexperiments.com app.convert.com data.track.convertexperiments.com 1003350.track.convertexperiments.com 1003343.track.convertexperiments.com;
img-src 'self' *.mozilla.net *.mozilla.org *.mozilla.com data: mozilla.org www.googletagmanager.com www.google-analytics.com adservice.google.com adservice.google.de adservice.google.dk creativecommons.org cdn-3.convertexperiments.com logs.convertexperiments.com images.ctfassets.net ad.doubleclick.net;
style-src 'self' *.mozilla.net *.mozilla.org *.mozilla.com 'unsafe-inline' app.convert.com;
child-src 'self' *.mozilla.net *.mozilla.org *.mozilla.com www.googletagmanager.com www.google-analytics.com www.youtube-nocookie.com trackertest.org www.surveygizmo.com accounts.firefox.com accounts.firefox.com.cn www.youtube.com;
default-src 'self' *.mozilla.net *.mozilla.org *.mozilla.com;
font-src 'self'
```

Good luck maintaining that. Before I will show you a way of writing CSP's in ASP.NET Core elegantly. I'll show you on how to provide it to the browser.

## Providing a CSP

There are two ways of providing the CSP to the browser. This is either by providing a meta tag with the CSP in it. Or by providing it in the response headers. My preferred way of doing it is by putting it in the response headers, this way we don't have to worry about HTML and can just write middleware that will hook into every request. Let's first look at the meta approach.

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; frame-src 'none';">
```

**Tip**: Providing a `default-src` is a best practice because this is a fallback for every type if you have not provided it. This is commonly set to `'self'` to only allow the website itself. Also, this is an example of only allowing images to be served over HTTPS and we won't allow any form of `iframe`.

The second method is by providing the `Content-Security-Policy` header, with the same content.

```text
Content-Security-Policy: default-src 'self'; img-src cdn.mywebsite.com; frame-src 'none';
```

### Report Only

The CSP also allows for a Report Only mode. Where it will throw errors in the console when the CSP is violated, but won't actually block it. This is useful when you just created a new CSP but are not sure if it is working. Or want your website to continue working and only log violation. You enable this by changing the key from `Content-Security-Policy` to `Content-Security-Policy-Report-Only`. This is my recommendation when you've created your CSP to see if you forgot any sources.

### Reporting Violations

By providing the `report-uri` you can ask the browser to report violations to that url. There are many tools to log CSP violations to, and you can also write your own. My go to is Sentry, because we have this installed as our error logging and performance tracking tool. You can read more about it [here](https://docs.sentry.io/platforms/javascript/security-policy-reporting/). Reporting works both in the normal mode and in the report only mode.

## Returning the CSP

After all this we still need to write some code to return the CSP back to the browser. We will be doing this in a configurable way, where we will be able to manage the CSP from our app settings.

So let's start. First thing we need is a model from our CSP. Looking at the examples above we can see two things. A CSP row exists of a type and a list of sources. These are both of type `string`, we can use a dictionary for this. We also need to be able to configure if we want to use the report only mode or not. We'll add this to the configuration as well.

```csharp
public class CspConfiguration
{
    public bool ReportOnly { get; set; } = false;

    public Dictionary<string, string[]> Policies { get; set; } = new();
}
```

This configuration will bind to the following JSON structure. Below example is a copy from the app settings of this very website.

```json
"Csp": {
  "ReportOnly": false,
  "Policies": {
    "default-src": [ "'self'" ],
    "script-src": [ "'unsafe-inline'", "www.googletagmanager.com", "storage.ko-fi.com" ],
    "style-src": [ "'unsafe-inline'", "fonts.googleapis.com", "storage.ko-fi.com", "cdnjs.cloudflare.com" ],
    "font-src": [ "fonts.gstatic.com" ],
    "img-src": [ "storage.ko-fi.com" ],
    "connect-src": [ "*.google-analytics.com" ]
  }
}
```

### Writing our middleware

The last step is to write the actual middleware. In the middleware we need to read our configuration, build the CSP, and add it to the headers. First, we need to create a class called `CspMiddleware`. We will inject the `RequestDelegate` and also `IConfiguration`, and bind it to our `CspConfiguration`.

```csharp
public class CspMiddleware
{
    private readonly RequestDelegate _next;
    private readonly CspConfiguration _config;

    public CspMiddleware(RequestDelegate next, IConfiguration config)
    {
        _next = next;
        _config = new CspConfiguration();

        config.GetSection("Csp").Bind(_config);
    }
}
```

Next, we need to create the method `InvokeAsync` which will run when a request is made. Here we will process our wanted behavior. I chose to first process the request, before adding the CSP header. This is to avoid unnecessary computing when the request won't be finished anyway. This can happen on any number of occasions, for example an exception occurs, or validation is not met.

```csharp
public async Task InvokeAsync(HttpContext context)
{
    // Process the request first, if it is on it's return, add CSP header
    await _next(context);

    var policies = _config.Policies;

    // If we have no policies defined, do not include CSP
    if (!policies.Any())
    {
        return;
    }

    // Build our CSP
    var cspBuilder = new StringBuilder();

    foreach (var policy in policies)
    {
        // If the key is empty or there are no values, continue
        if (string.IsNullOrEmpty(policy.Key) || !policy.Value.Any())
        {
            continue;
        }

        // Append the policy to the total
        cspBuilder.Append(policy.Key);
        cspBuilder.Append(' ');
        cspBuilder.Append(string.Join(' ', policy.Value));
        cspBuilder.Append(';');
    }

    // Convert to single string
    var cspHeaderBody = cspBuilder.ToString();

    // Set right header key depending on the report only setting
    var cspHeaderKey = _config.ReportOnly ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy";

    context.Response.Headers.Add(cspHeaderKey, cspHeaderBody);
}
```

Make sure you add this to your `IApplicationBuilder` in your Startup or Program (depending on the .NET version you are running). Ideally, only in a non-development environment. There should be an `env.IsDevelopment()` check in there by default. Add it in the opposite of this. For reference, below example.

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        // example on what is in there by default
        app.UseDeveloperExceptionPage();
    }
    else
    {
        // this will only be added in non-development environments
        app.UseMiddleware<CspMiddleware>();
    }

    // ... other code already there
}
```

## Excluding requests

When working with software already there you might want to exclude your CSP middleware on some occasions. For example, I work with Umbraco a lot. I don't want my CSP header added when accessing the Umbraco back-office. As a little bonus I'll show you a way to exclude the CSP from these requests. In Umbraco's case, it only operates behind the `/umbraco` path segment so it's simple to add. Another example is swagger, you might not want to enforce the CSP policy for your website on the swagger URL's.

First start by adding a new line to the CSP configuration.

```csharp
// appsettings.json
"Csp": {
    "ExcludeWhenPathStartsWithSegment": [ "/umbraco" ],
    // ...
}

// CspConfiguration.cs
public string[] ExcludeWhenPathStartsWithSegment { get; set; } = Array.Empty<string>();
```

We've added it to the configuration. Now it's just not running the middleware when the request starts with this path segment. On the top of your middleware, below the next, add this code.

```csharp
// If our path starts with any of the exclude segments, do not add CSP
if (_config.ExcludeWhenPathStartsWithSegment.Any(i =>
    context.Request.Path.StartsWithSegments(i)))
{
    return;
}
```

## Conclusion

You've learned what a CSP is, and how you should apply it in an ASP.NET Core web application. Maybe learnt something about the configuration, and the way middleware works. Hope this helps, make sure to keep your users safe from malicious attacks. It's not a lot of work to implement, and now, very easy to maintain.

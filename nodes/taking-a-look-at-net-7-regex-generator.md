---
title: "Taking a Look at .NET 7's Regex Generator"
date: "2022-12-22"
excerpt: "How to use the .NET 7 GeneratedRegex source generator and a benchmark against a classic Regex: about 16x faster and no memory allocated per call."
tags: [".NET", "C#", "Best Practices"]
author: "Roy Berris"
related: ["looking-at-partial-methods"]
---

# Taking a Look at .NET 7's Regex Generator

*Originally published on the old Berris.dev blog in December 2022 and moved here with its original text. The screenshots from the original post didn't survive the move.*

With .NET 7 we've also had the introduction of the Regex Generator attribute which focusses on regex performance by generating code. Let's take a look on how to use it.

## Working with a Regex

The Regex is an essential component in efficiently validating user input. E-mail addresses, phone numbers, website URL's and so forth are complex values. They require a specific format for them to be valid, and this is where the regex comes in. We've probably all written one, maybe even got taught about it in school. This post won't be about writing a regex, it will be about using it.

The thing is, using a regex frequently is expensive when working with .NET. Under the hood it is complex code. Your regex pattern has to be interpreted and executed during runtime. Let's take a look at an example with what we are used to do.

```csharp
public class OldRegex
{
    private Regex _regex = new Regex("[a-z]{3}-[a-z]{3}", RegexOptions.IgnoreCase);

    public bool IsMatch(string value)
    {
        return _regex.IsMatch(value);
    }
}
```

Above example shows the current way of doing Regex validation. The Regex itself is fairly simple. There is nothing wrong with this way of doing things. But there are faster and more developer friendly ways.

## The Regex Generator

We are not generating a regex; we are using a code generator that will dissect our regex at compile time. Instead of at runtime. Which makes sense if you think about it. The pattern in above example is a constant anyway, right? It won't be changed during runtime, so why not optimize it.

The code generator uses a partial method to provide the regex. This means the class where this regex is generated needs to be partial as well. This will also work for static partial classes. You can read more about partial methods in the linked blog post.

[Read more about partial methods](/nodes/looking-at-partial-methods/)

In below example you can see the regex generator in action. The partial method returns a `Regex` with which you can validate with. The nice thing is, is that this is a singleton. It is only initialized once, and not once for each instance of the class. And as a bonus, the regex will be explained in the documentation of the method.

```csharp
public partial class NewRegex
{
    [GeneratedRegex("[a-z]{3}-[a-z]{3}", RegexOptions.IgnoreCase)]
    public partial Regex GetRegex();

    public bool IsMatch(string value)
    {
        return GetRegex().IsMatch(value);
    }
}
```

## Performance

To see how this will impact performance I did a benchmark on the "old" way of using a regex and the "new" way. Also, I added a benchmark to create a new instance of the class 10x and then calling the `IsMatch` method. Just to see if this makes a difference.

```text
|       Method |         Mean |      Error |     StdDev |       Median |   Gen0 | Allocated |
|------------- |-------------:|-----------:|-----------:|-------------:|-------:|----------:|
|     OldRegex |  4,983.48 ns |  98.560 ns | 207.896 ns |  4,906.11 ns | 0.3815 |    4840 B |
| OldRegex_10x | 48,624.39 ns | 843.723 ns | 704.547 ns | 48,662.42 ns | 3.8452 |   48400 B |
|     NewRegex |     30.10 ns |   0.457 ns |   0.405 ns |     30.08 ns |      - |         - |
| NewRegex_10x |    305.26 ns |   5.393 ns |   5.044 ns |    306.65 ns |      - |         - |
```

The benchmark speaks a thousand words. The generated regex code only uses 6% of the execution time than that of the "old" regex. Also, it allocates no memory! Of course, these are still nanoseconds and for the end user there would probably be no noticeable difference. It still executes in about 0,0049ms (4983ns). When the regex is a big part of your application, this is definitely something to put on the upgrade list.

## Conclusion

The source code generated regex is about 16.3x faster and that for something that is easy to implement. Definitely the way to go when you are using a regex in the future and if you have the possibility. While the "old" way is a lot slower. In human time it is not noticeable and there is no hurry to migrate every regex right now. If you are building for performance, you know what to do. Otherwise, there is no rush to convert every regex you have in your application.

If you want a deeper dive in to this subject, check out the linked article.

[Read more](https://learn.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-source-generators)

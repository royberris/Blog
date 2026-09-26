---
title: "Using Tag Helpers to Render Attributes Conditionally in MVC"
date: "2022-08-16"
excerpt: "Render HTML attributes conditionally in ASP.NET Core MVC with a custom Tag Helper instead of inline Razor ternaries, using the anchor target as the example."
tags: [".NET", "C#"]
author: "Roy Berris"
---

# Using Tag Helpers to Render Attributes Conditionally in MVC

*Originally published on the old Berris.dev blog in August 2022 and moved here with its original text.*

We all know the chunky code that was previously needed to render attributes conditionally. I'll show you a better way. Out with the old, in with the new.

## What did we do previously

In previous versions of the ASP.NET Framework it was ugly to render attributes conditionally. Let's take the anchor as an example, specifically the `target` attribute. This may have multiple values.

- `_self`
- `_blank`
- `_parent`
- Or target a `iframe` with an `#`

All except for the `_self` value really add anything. For our website we did not want anchors with the `_self` target or an empty value.

```cshtml
<a href="@href"
  @(!string.IsNullOrEmpty(target) && target != "_self" ? $"target={target}" : null)
>My Anchor</a>
```

In the example you can see the code that would be added to an `a` element in order to render a `target` attribute.

What we can do is check for the value of target using the [ternary](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/conditional-operator) operator. This takes quite a bit of code to do, we don't really see the `target` attribute in the HTML anymore. And worst of all, I need to copy and paste this to any of my anchors. If something would change, I'd have to go back and update any one of them. Of course, the anchor element won't change but imagine this for any other use case.

So how does this work? When you see `@()` in your Razor code this means this is an explicit expression. Within the explicit expression you can write C# code that returns a `string`, or `null`. If the value is valid, Razor will render this as a `string`. Or you return `null`, it will not render the expression. This way you don't end up with attributes without a value.

## Tag Helpers to the rescue

Tag Helpers are this magic that happens when the razor view is executed. Whenever a Tag Helpers is "attached" to an element. It'll run some extra code to process its behavior. You've probably seen a Tag Helper before in creating forms with ASP.NET Core. Visual Studio will highlight the element purple when a Tag Helper will interfere with this code.

We'll look at how to use a Tag Helper in the example below.

```cshtml
<a href="@href" target="@target">
  My Anchor
</a>
```

We'll start with an anchor like we did in the other example. This is all you'll have to write in your view. Notice the lack of razor code, other than rendering the variables.

Instead of polluting our Razor code with a lot of logic we'll write that somewhere else. Inside of your project you should create a new folder called "TagHelpers". Inside of this folder we'll make the `AnchorTargetTagHelper.cs` file, so we can program wanted behaviour.

## Creating the Tag Helper

The Tag Helper class is just any ordinary class that extends the `TagHelper` class. This lives in the `Microsoft.AspNetCore.Razor.TagHelpers` namespace. The name of your Tag Helper is crucial when working with this bare set-up. When you have a Tag Helper that is called `MyCustomTagHelper`, Razor will know that the element that this is targeting is called `<mycustom />`.

For our implementation we want to be a bit more specific and we'll add the `HtmlTargetElement` attribute to the class. This will take in the tag name, which in our example is `a`, and we need to set the `Attributes` property.

The `TagHelper` class allows us to override the `Process` method, which will be called when the Razor code on the attached tag is executed. In here we'll write custom logic to hook in to the processing of this tag.

Let's take this information and create the class.

```csharp
[HtmlTargetElement("a", Attributes = "target")]
public class AnchorTargetTagHelper : TagHelper
{
    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
      // We'll write the logic later.
    }
}
```

When building, the project knows your Tag Helper exists. You don't need to register each individual Tag Helper. What you do need to do is add this to your `Views/_ViewImports.cshtml` file. Replace 'YourProject' with the identifier of the project where your Tag Helper is located.

```cshtml
@addTagHelper *, YourProject
```

## Processing

We now have a Tag Helper that does nothing. Let's change that. Our goal is to remove the target attribute when its value is either `_self` or `null`.

Within the Process method we have two parameters. They are context and output. The context variable provides information about the current state of the tag, and the output variable is what will be rendered. By reading the context we can manipulate the output. So all we need to do, is read the value of the target attribute. And based on the value, alter the target attribute in the output. Because this is not complex at all, I can fit it in to one code block.

```csharp
public override void Process(TagHelperContext context, TagHelperOutput output)
{
    var targetValue = context.AllAttributes["target"].Value.ToString();

    if (string.IsNullOrEmpty(targetValue) || targetValue == "_self")
    {
        output.Attributes.RemoveAll("target");
    }
}
```

That's all. Very easy indeed, but you wouldn't have expected otherwise for such a simple example. I hope this gave you a great start on your journey with Tag Helpers and an easy example to implement into your project!

[Read more about it here](https://learn.microsoft.com/en-us/aspnet/core/mvc/views/tag-helpers/intro)

---
title: "Start Using Roslyn Code Analyzers"
date: "2022-10-10"
excerpt: "How to set up Roslyn code analyzers like StyleCop with a shared .editorconfig in .NET, configure rule severity, fix issues and suppress rules the right way."
tags: [".NET", "Best Practices", "Team Collaboration"]
author: "Roy Berris"
related: ["standardizing-api-conventions"]
links:
  - label: "StyleCop Analyzers"
    url: "https://github.com/DotNetAnalyzers/StyleCopAnalyzers"
  - label: "Meziantou Analyzer"
    url: "https://github.com/meziantou/Meziantou.Analyzer"
---

# Start Using Roslyn Code Analyzers

*Originally published on the old Berris.dev blog in October 2022 and moved here with its original text. The screenshots from the original post didn't survive the move.*

A nice thing that Roslyn (the compiler platform for .NET) offers is static code analysis. We can use this to our advantage to keep the project maintainable and in line with our code style.

## What is static code analysis

Static code analysis is running a small program over your code to give you feedback on the code you have written. When we say this is static it means it doesn't really know anything about the context of the application, it only looks at code. This can help with finding bugs, but mainly to keep one code style. The code analyzer will give you warnings about things that are not compliant to the configured code style. If you do not comply to the code style, you'll get an indicator as what is wrong and what needs to change.

Within .NET we have Roslyn Analyzers. Visual Studio has one built in, but you are also able to install additional analyzers from NuGet or with Visual Studio Extensions. These analyzers focus on maintainability, readability and design. But sometimes also on security and best practices.

## Why use static code analysis

When you are working with multiple developers on a team, you might've noticed that everyone writes different. It is human to have your own writing style, but that doesn't really work for programming languages. But it compiles right? While that might be enough for your own blog website, or when working with a small team. Projects that have a longevity will benefit from static code analysis. If we keep our code in one style, whomever wrote it, that will be beneficial for maintainability and readability. It's easier to onboard new colleagues because the project is in one style, and it is readable. Not every module has its own author. The goal of a style and design analyzer is to keep the code authorless.

While it might be true that static code analysis is helpful, it will not cover everything. Even within the code style you can still write bad code. It isn't a magic trick to fix all problems.

## Getting started

Creating a code style seems to be a big task. But it's quite easy in the context of a .NET app. I recommend that you set a team meeting. Get a project you are working on. Install a code analyzer and start configuring. You can of course also do this on your own, but when working with a team it is nice to get the input of your colleagues because it is a tool that influences everyone.

The code style is configured in a `.editorconfig` file. This is a file type that is IDE independent and all major IDE's will be able to interpret it. Visual Studio (Code) works with it, so does Rider.

As an example, we will use [StyleCop](https://github.com/DotNetAnalyzers/StyleCopAnalyzers), which is an analyzer I use in all of my projects. StyleCop focusses on style and design. Installation for other analyzers is similar but their configuration might be different. Go to the NuGet Manager and install `StyleCop.Analyzers.Unstable`\*. After this open your `.csproj` file, copy the `PackageReference` in to its own `ItemGroup` and give it the label `"CodeAnalysis"`. I included an example below. More on this further on in the blog post.

*\* We use StyleCop Unstable because code analysis is only for development. In StyleCops case they will not support the latest features unless you have the unstable version. I wish this was different, but it doesn't really matter for now. It's important that you are aware of this, and you should do what you prefer.*

```xml
<ItemGroup Label="CodeAnalysis">
    <PackageReference Include="StyleCop.Analyzers.Unstable" Version="{LatestVersion}">
        <PrivateAssets>all</PrivateAssets>
        <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    </PackageReference>
</ItemGroup>
```

Rebuild your project and you'll likely get a ton of warnings in the Error List tab in Visual Studio. If you don't see this window, go to View > Error List and enable it. This is because we have not configured the code style with an editor config file. On the solution level, you should add a new item and call this `.editorconfig`. In Visual Studio, you'll now find that the editor config is added as a solution item. Now we need to add it for this project. We do this by linking the editor config file, which is on the solution level. This is likely one folder up, but it might depend on your project. Add the following line to the code analysis item group, with the correct path for your solution.

```xml
<None Include="..\.editorconfig" Link=".editorconfig" />
```

We now have an empty editor config file and a lot of warnings. Why did we put it on the solution level? This is because it is likely that your solution consists of more than one project. We want the whole solution to have the same rules, maintaining more than one editor config is not really doable. With this trick you can have the same editor config over multiple projects.

## Configuring StyleCop

If you look at your Error List, you'll see a lot of warnings. For the sake of this blog post I've created an example project with some typical problems. File names not matching their first type, single line if statements, trailing whitespaces, etc.

For StyleCop, we need to do one additional step. We need to add the `stylecop.json` file to the project. Official documentation [here](https://github.com/DotNetAnalyzers/StyleCopAnalyzers/blob/master/documentation/EnableConfiguration.md). But in our case, we'll do it the same way as we did with the editor config file. We will add it to the solution.

If you go to any warning in the project from the source code and open the quick actions tab. It will give you the option "Add the StyleCop settings file to the project". Clicking this will add a JSON file to your project. Move this JSON file to your solution folder. And include below snippet in the code analysis item group. Open the settings file and rename the placeholder company to your own company name or leave it empty.

```xml
<Content Remove="stylecop.json" />
<AdditionalFiles Include="..\stylecop.json" />
```

Open the Error List and look at the first warning, code SA0001: "XML comment analysis is disabled due to project configuration". This refers to the CSC file, which doesn't help you any further. The solution is to enable comment analysis in the `.csproj` file by adding the line below to the upper most `PropertyGroup`.

```xml
<GenerateDocumentationFile>true</GenerateDocumentationFile>
```

You'll notice that the warnings have a code, like the one I showed above SA0001. This code is unique for every analyzer. In StyleCop's case it always starts with SA (stands for StyleCop Analyzer). You might've seen similar warnings before which started with IDE. This is the default analyzer from your IDE.

Using this code, and the editor config we can configure and suppress analyzers. In your code, from Visual Studio (as the example). Go through the warnings and check for any warning you do not want to include. In my case I don't want SA1600 to be included for this project. It is my personal blog, and I don't need documentation on every method. Don't get me wrong, this is a great analyzer for any project where you are working with a team.

Go to the warning from the source code and open the quick actions tab. You'll see the "Suppress or Configure issues" options. Expand this and choose "Configure SA1600 severity" setting this to "none". This will add a new line to your editor config file configuring this rule for the whole project.

## Severity levels

There are multiple severity levels which you can configure. In Visual Studio you can choose between None, Silent, Suggestion, Warning and Error. We've set the SA1600 rule to 'none', meaning it won't be used. On default all rules are set to 'Warning'. But sometimes we have such an important rule, we want to configure its severity to error, this will throw an actual error when trying to build the project. This is great when something is really important, and we need to resolve this issue before being able to run the project.

For example, we have SA1649: "File name should match its first type". When a class name does not match with the file name, we'll throw an error. It's easy to do, just follow the same steps as above, instead of setting it to 'None', set it to 'Error'.

## Resolving issues

Almost every issue also has a resolver built in. When you open the quick actions panel on almost every warning, you will find a solution which the IDE can apply. If it isn't there, read the message carefully and try to fix it manually.

Open the quick fix panel and choose the option for resolving the issue. In the case of Visual Studio, you'll also get a preview of what will change. In our example below you can see that we should prefix local calls with `this.` and VS will show us the resolution. It even asks us if we want to fix this for the document, the project or the solution. This is very powerful and will save you lots of time. I recommend using this after settling down with the analyzers to choose.

## Configuring the solution

Depending on if this is a new project or an older one, you will get a lot of issues we should resolve or configure. If you don't do that for every issue, you will start to ignore issues and it's better to not use code analysis. It might be a lot of work to do the initial review, but it is time well spent.

For the example we used StyleCop, this is a great analyzer which I do recommend. But you might not, or you might want to try a different one. Choose one wisely and go with it. Also, you don't need to limit yourself with one, you can also go with multiple analyzers. StyleCop focusses on style and design which will improve maintainability and readability. But other analyzers will focus on other things. For example, the [Meziantou Analyzer](https://github.com/meziantou/Meziantou.Analyzer) introduces a lot of best practices for speed and security. Even giving benchmark results on why the recommended approach is faster and better. This is a great addition to StyleCop, and you can use these analyzers side by side.

After you have settled down with an analyzer, and all the issues flow in, it is best to go in with your team and tackle the issues one by one. This can either be by resolving the issue or configuring its severity. Do not forget that you can automatically fix a violation for the whole document or solution to save you time. You will find that, doing it this way, the warnings will go down in numbers quick. Do this until the list is empty! It takes some discipline to keep this list empty. If you have pipelines (CI/CD), add checks to make sure this list is empty before completing PR's. This will force you to deal with issues instead of ignoring them.

## Suppressing issues

When going through the whole solution you might find some issues that you do not want to suppress for the whole solution. But maybe only for a specific folder or class. We have multiple options for suppressions:

- In Source
- In Source (Attribute)
- In Suppressions File

Forget about the first two. While they do work, I do not recommend them. It is very ugly to have one line of code that suppresses a rule once. You should ask yourself why this issue exists in the first place. Can you write the code different or resolve it another way. If you need to suppress you should do it in a suppressions file. This is a document that lives in the root of a **project** (not the solution) which applies a suppression to one type or namespace. In the suppression you need to specify a justification, so others know why we did this. And still then, I would ask the question that, if you can avoid this any other way you should. Rules are rules, we didn't define them to then break them again when it's convenient.

There are some valid exceptions to this rule. One example is generated code. We'll take Entity Framework Core as a common example. When we generate migration files the filetype never matches the filename because the filename contains a timestamp, and the type doesn't.

Create a `GlobalSuppressions.cs` file at the root of your project and paste below code.

```csharp
[assembly: SuppressMessage(
    "Design",
    "MA0048:File name must match type name",
    Scope = "namespaceanddescendants",
    Target = "~N:CodeAnalysis.Persistence.Migrations",
    Justification = "Generated file will never match type name")]
```

The `SuppressMessage` takes in 2 parameters, these will specify the analyzer we want to suppress. And we can specify additional properties. We've set the scope to a namespace and its descendants. Meaning everything in the namespace and below it will suppress. Then we set a target, starting with `~N:` meaning it is a namespace. And the namespace itself behind it. Last, we give it a justification, to make sure we know why this rule is broken.

Another common example is projects using CQRS and specifically using MediatR. You will find that commands, queries and their handlers live in the same file for convenience. This is because it is better for development to keep them together. This is a good reason; the code analyzer should excel development. But sometimes rules block that. That is why you can allow multiple types in one file for a specific namespace. In this example everything below the 'Features' namespace is a command or a query with their handlers and we suppress the rule to allow for our own rule.

```csharp
[assembly: SuppressMessage(
    "StyleCop.CSharp.MaintainabilityRules",
    "SA1402:File may only contain a single type",
    Justification = "MediatR Queries/Commands and their handlers live in the same file for convenience",
    Scope = "namespaceanddescendants",
    Target = "~N:CodeAnalysis.Features")]
```

## Conclusion

We learned what a code analyzer is. Why we use it. What it can do for us. How to install it and how to configure it. I hope this helps in keeping projects clean and maintainable. It takes some getting used to, but once you've grasped it you cannot do a project without it.

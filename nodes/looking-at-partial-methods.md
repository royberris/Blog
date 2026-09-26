---
title: "Looking at Partial Methods in C#"
date: "2022-11-25"
excerpt: "C# has partial classes, but also partial methods. What partial means, how the compiler merges or removes partial methods, and how code generators use them."
tags: [".NET", "C#"]
author: "Roy Berris"
---

# Looking at Partial Methods in C#

*Originally published on the old Berris.dev blog in November 2022 and moved here with its original text.*

The C# language has partial classes, but did you know it also has partial methods?

## What does partial mean

The `partial` keyword is used to define a partial type. But what does partial mean in C#? Well, it is a way to split a class into multiple classes and source files while it still being the same class. This might sound confusing, and it is weird. This is one of those features that is unique to C#. Other languages simply lack the feature. But that might be because of a reason. While the partial class can be useful in some situations, it is unlikely that you will encounter it regularly.

What does this look like in code? Below example shows a partial class with two methods. While the methods declaration is split in to two classes, even two files, we can still call them from one and the same class. Notice that the modifier of `Foo` is set to `private` still class `A` can access it because it is the same class.

```csharp
// FileOne.cs

public partial class A
{
    public string Bar()
    {
         var xyz = "xyz";
         var abc = Foo();
         return abc + xyz;
    }
}


// FileTwo.cs

public partial class A
{
    private string Foo()
    {
        return "abc";
    }
}


// Program.cs

var a = new A();
var bar = a.Bar(); // "abcxyz"
```

Under the hood the compiler will merge this in to one class. For the interpreter there is only one class. You could say that the partial keyword is syntax sugar.

Take a look at above code in [SharpLab](https://sharplab.io/#v2:EYLgxg9gTgpgtADwGwBYA0ATEBqAPgenwAIAxASwBsYB5AOxgDowBnAWACgOABAZiIAcAhlAAuZQRSJcATEQCCHAN4ciqqXy4BGAAxEAQsIAUAShVrl7NVdUA3YUQQBPAF5EAvEQBET554DcZta29oLAYO6kEBAmAZZBqlwA7ESh4dgOLrFWAL4cuZwFhKSUMAAqAO4QTGwFvALCYhJSsgrsFlb8UGR2IjBSOpHRpnGq7fFJXqn+gUT52UA=). Which will give you an idea of what the compiler actually does.

## The partial method

So how can we possibly split a method in to two pieces? Does it combine the results from both? Or just execute both methods when it is a `void`? The answer lies somewhere else. It might sound confusing, a partial method, but it acts different from a class. You cannot split a method in two.

The partial method is best compared to an abstract method. We know it is there, it is declared, but the implementation lies somewhere else.

This means that a partial method can only be used without an implementation if it has a void return type. If you want a partial method with a return type, like in the above example, we will still need an implementation on compile. A common usage example of this is with code generators.

```csharp
public partial class A
{
    partial void BarTriggered();

    public string Bar()
    {
        var xyz = "xyz";
        BarTriggered();
        return xyz;
    }
}
```

The `BarTriggered()` method is not implemented in above example, yet this code compiles. If we look at [SharpLab](https://sharplab.io/#v2:EYLgxg9gTgpgtADwGwBYA0ATEBqAPgAQGYACABwEMoAXAS3IBtj8AmYgQQFgAoAb2+IFlKtBkxTEAQpQAqUGgHN5MWBgAUASgDc3foKJMAjAAZJlDboF8ugm8QBulYggCeAL2IBeYgCIXr79rWtgJSULIKSioagcEC+ADsTm4xggC+3KlAA=) again we will see that the result does not have any mention of the `BarTriggered()` method. This is because we have not implemented it. In this scenario the compiler will simply remove all references to this method.

The partial method does not have an access modifier. It is scoped to this class. If we would make the partial method public, it requires an implementation. The implementation can be in a different source file as long as it is the same partial class.

## Conclusion

The partial method is an interesting concept of the C# language that you will likely not use in everyday scenarios. Its use is best shown in code generators that allow you (to be forced) to write an implementation on methods in generated code. It is good to know these features exist even if we do not use them often.

[Read more](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/partial-member)

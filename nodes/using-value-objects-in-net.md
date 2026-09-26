---
title: "Using Value Objects in .NET"
date: "2023-02-08"
excerpt: "What a DDD value object is and how to build one in C#, using a hexadecimal color code with equality by value, a guarded factory method and immutable behavior."
tags: [".NET", "C#", "Design Patterns"]
author: "Roy Berris"
---

# Using Value Objects in .NET

*Originally published on the old Berris.dev blog in February 2023 and moved here with its original text.*

When talking about DDD you might've heard of value objects. What are they and how can we use them?

## What is a Value Object?

When we are working with a domain one might've heard the term "Value Object". But what is this exactly? In this post I will not go in the details of the "what", but straight to the "how". The Microsoft Learn page on this is probably much clearer and to the point than this post can be. But after reading this Learn article and working with value objects in my own solution it becomes clear that there are multiple use cases for this.

But to summarize in my own words: a value object is an immutable, key-less object. It's a semantic bundle of fields which together present one thing. They represent a simple entity whose equality is based on value rather than identity.

[Learn more](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/implement-value-objects)

## Dissecting Microsoft's example

Looking at Microsoft's example with an Address value object it's clear what it does. All fields associated with an address are bundled in to one type and, together, they represent one value. Meaning that if we would change a property in address it would not equal the original anymore.

```csharp
public class Business
{
    public string Name { get; set; }

    public DateTime FoundedDate { get; set; }

    public string AddressStreet { get; set; }

    public string AddressHouseNumber { get; set; }

    public string AddressCity { get; set; }

    public string AddressCountry { get; set; }
}
```

If we would have a class representing a business, and it looks something like shown above, it's logical to bind these fields together in to one class called Address. And to make this work in modern C# and .NET we'll need a base class called ValueObject. So why do we need this exactly?

*Implementation as shown [on Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/implement-value-objects#value-object-implementation-in-c) below.*

```csharp
public abstract class ValueObject
{
    protected static bool EqualOperator(ValueObject left, ValueObject right)
    {
        if (ReferenceEquals(left, null) ^ ReferenceEquals(right, null))
        {
            return false;
        }
        return ReferenceEquals(left, right) || left.Equals(right);
    }

    protected static bool NotEqualOperator(ValueObject left, ValueObject right)
    {
        return !(EqualOperator(left, right));
    }

    protected abstract IEnumerable<object> GetEqualityComponents();

    public override bool Equals(object obj)
    {
        if (obj == null || obj.GetType() != GetType())
        {
            return false;
        }

        var other = (ValueObject)obj;

        return this.GetEqualityComponents().SequenceEqual(other.GetEqualityComponents());
    }

    public override int GetHashCode()
    {
        return GetEqualityComponents()
            .Select(x => x != null ? x.GetHashCode() : 0)
            .Aggregate((x, y) => x ^ y);
    }
}
```

In this base implementation of `ValueObject` we see one main theme. This theme is equality. The main benefit in to bundling everything up in to a value object is checking for equality. The bundle of fields should represent one thing. This means that if we would copy the object and change one field, it should not equal the original. When checking for equality we are looking at the **value of the object** and not the object itself, hence the name.

It's equality is based on value and not on it's identity, there is no primary key. One could say that the values together are it's identity.

## An example with Hexadecimal Color Codes

A value object does not have to be a multi-field structure. It can very well be a single field value, theoretically it always is to the outside world. We do not care about the internal structure of a value object. So what do I mean by that? We'll look at the hexadecimal color code (hex continuing after this) for this example.

We all know what a hex looks like; It consists of a hashtag and 6 letters or numbers. But these letters and numbers are not any letters or numbers, they are in range A-F and 0-9. But to be more precise, those 6 letters are grouped in to 3 groups of 2. Each group represents a primary color: Red, green and blue. The hexadecimal color code format used by CSS for example is only a convenience, a way of storing those 3 values.

Each of these groups is an integer value ranging from 0-255. The hex `0x00` represents 0 and the hex `0xff` represents 255. So why would we even want to save this hexadecimal color code in it's string values. Why not use integers in our value object? Well we can, and probably should, but it doesn't matter.

Because the moral of the story is that it doesn't matter if our value object is a single string field with a regex protecting it's structure. Or a multi-value field where we store each individual value as integer. To the outside world it's value is unique, multiple objects with the same value equal each other. And it's value for the user is still `#AA00BB`. That doesn't mean we should store it as a string. Storing it with it's integer values allows us to do smart things with it, like calculations or hue shifts. Whatever we do, it's value is it's identity in whatever form that might be.

Just to understand the programming aspect of this, let's implement it in C#.

```csharp
public class HexColorCode : ValueObject
{
    private HexColorCode(int red, int green, int blue)
    {
        Red = red;
        Green = green;
        Blue = blue;
    }

    public int Red { get; }

    public int Green { get; }

    public int Blue { get; }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Red;
        yield return Green;
        yield return Blue;
    }
}
```

Above value object shows us the structure of our hexadecimal color code implementation. There is a problem with this though, we can't construct it. It has a private constructor, and this is a key aspect of value objects. We do not want to construct without ensuring a correct value. Value objects should guard their own state. If their state is wrong, it is not to be trusted. Imagine if the `DateTime` class allowed us to construct it with months that do not even exist. That is not something we want, we expect the `DateTime` to be consistent and the truth.

In a real application we need to store it. This is probably using EF Core, but because of the way EF Core works (which is something we won't get in to this blog post) we need a certain way of defining our value object. We need a private constructor when using a value object. But to construct it we won't be using a classic constructor but a static method that returns an instance of our value object. This static method is also the guard that will make sure our state is right. When creating this value object we'll only allow a string with a hexadecimal color code.

```csharp
public static HexColorCode From(string colorCode)
{
    if (colorCode == null)
    {
        throw new ArgumentNullException(nameof(colorCode));
    }

    if (!colorCode.StartsWith("#"))
    {
        throw new ArgumentException("Color code must start with #", nameof(colorCode));
    }

    if (colorCode.Length != 7)
    {
        throw new ArgumentException("Color code must be 7 characters long", nameof(colorCode));
    }

    var red = int.Parse(colorCode.Substring(1, 2), NumberStyles.HexNumber);
    var green = int.Parse(colorCode.Substring(3, 2), NumberStyles.HexNumber);
    var blue = int.Parse(colorCode.Substring(5, 2), NumberStyles.HexNumber);

    return new HexColorCode(red, green, blue);
}
```

Now that we can create an instance of our value object, we have no way of displaying it. But we just need to write an override for the `ToString` method, which will convert it back to it's original value.

```csharp
public override string ToString()
{
    return $"#{Red:X2}{Green:X2}{Blue:X2}";
}
```

## Testing it

Now that we have a simple value object we can use it. I recommend writing Unit Tests for every value object and test for creation and conversion. For this post we will keep it simple so I wrote a simple console app that implements above example.

```csharp
var colorOne = HexColorCode.From("#AA024B");
var colorTwo = HexColorCode.From("#AA024B");

Console.WriteLine($"Color One: {colorOne} ({colorOne.Red,3}, {colorOne.Green,3}, {colorOne.Blue,3})");
Console.WriteLine($"Color Two: {colorTwo} ({colorTwo.Red,3}, {colorTwo.Green,3}, {colorTwo.Blue,3})");
Console.WriteLine($"Are they equal? {colorOne.Equals(colorTwo)}");
```

This will now output below example. If we would change a single value it will output false. If we would give it a value that is not supported, it throws an exception. Remember that this is not comparing the two input strings but rather the value of the object which are stored as three integers.

```text
Color One: #AA024B (170,   2,  75)
Color Two: #AA024B (170,   2,  75)
Are they equal? True
```

## Object oriented

We now have a value object in its simplest form. It is created and converted back to a string value. But we can do more with value objects, we can add methods that do something with the values of the value object. We could for example invert the colors. This is where it becomes interesting, this type is no longer stupid simple, it actually does something. Below example will invert the colors and return a new instance of the value object. Because of the immutability of value objects, we will always return a new instance instead of changing the current value.

```csharp
public HexColorCode Invert()
{
    return new HexColorCode(255 - Red, 255 - Green, 255 - Blue);
}
```

If we now add this method in our example console app we can see it in action.

```csharp
var colorOne = HexColorCode.From("#AA024B");
var colorTwo = colorOne.Invert();

Console.WriteLine($"Color One: {colorOne} ({colorOne.Red,3}, {colorOne.Green,3}, {colorOne.Blue,3})");
Console.WriteLine($"Color Two: {colorTwo} ({colorTwo.Red,3}, {colorTwo.Green,3}, {colorTwo.Blue,3})");
```

```text
Color One: #AA024B (170,   2,  75)
Color Two: #55FDB4 ( 85, 253, 180)
```

## Conclusion

Value objects are a strong concept in creating entities and writing smarter code. This is one of many examples for value objects. The hexadecimal color code shows the importance of a value object well. We've also looked at a domain example with value objects, they should be more than simple data-transfer object.

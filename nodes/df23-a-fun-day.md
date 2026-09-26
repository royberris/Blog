---
title: "DF23: A Fun Day at the Dutch Umbraco Fest"
date: "2023-09-29"
excerpt: "My day at DF23, the Dutch Umbraco Fest: the BIG DUUG AI Quiz and my talk on building a strong foundation for your modern .NET project, with the slides."
tags: ["Umbraco", "Events", "Software Architecture"]
author: "Roy Berris"
---

# DF23: A Fun Day at the Dutch Umbraco Fest

*Originally published on the old Berris.dev blog in September 2023 and moved here with its original text. The photos from the original post didn't survive the move.*

On 28 September 2023 there was another edition of the Dutch Umbraco Fest organized by the Dutch User Umbraco Group. This year I was also a speaker at the event.

## The BIG DUUG AI Quiz

The day started with a quiz. And not just some quiz. It was the BIG DUUG AI Quiz. With lots of questions about AI, which were just guessing really. It was a fun and interactive experience to open the conference. There was even a prize! After many many questions I was fortunate enough to answer the right questions correctly and finished on the podium.

And the prize? A Unicorn! And not just a Unicorn, it's one from Umbraco.

After deflating it and spending half an hour inflating it with a way too small air pump it is now at the office in Den Bosch next to our little 'Umbraco Museum'.

## Building a Strong Foundation for your Modern .NET Project

That title is a mouthful. But that is exactly what that topic is, a lot. I did my best to fit it in to a 25 minute talk and am happy with the result. Briefly summarized I've split the talk in to two parts. Design and implementation.

In the design phase we try to come up with an architecture for the application. We want to do this in a way where we build something that allows us for it to be open to extension later. But to what extent? When is a foundation strong, and when is it wrong? The answer is there that as long as the purpose of the application is met nothing is by definition wrong. But you should be careful when in the design phase. Don't make decisions that will bite you, and don't make decisions that are for the implementation phase.

In the implementation phase there are many subjects to be covered. I tried to stick to three: Umbraco, code maintenance and CI/CD. When implementing your design we should be careful with Umbraco documents. It is expensive to migrate data, so how can we make sure that we build something that is extendable. If you have your modules in order, you also need to make sure your code is maintained properly. And when all of that is finished is it important to have a good way of working and properly handle the development operations. In the CI/CD chapter I talked about automated testing. Also make sure you keep monitoring your application and have some sort of error management system in place.

Thanks to everyone who attended. And thanks to Arnold and Henk for making DF23 possible.

[Get the slides](https://web.archive.org/web/20250711022214/https://www.berris.dev/media/fwjalbos/presentatie-df23.pdf)

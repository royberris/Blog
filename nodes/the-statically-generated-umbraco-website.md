---
title: "The Statically Generated Umbraco Website"
date: "2023-09-08"
excerpt: "How I turned my Umbraco website into a static site with xStatic and free Netlify hosting in under an hour, and who should and shouldn't use this approach."
tags: ["Umbraco", "Hosting"]
author: "Roy Berris"
related: ["going-headless-with-mvc"]
---

# The Statically Generated Umbraco Website

*Originally published on the old Berris.dev blog in September 2023 and moved here with its original text. The screenshots from the original post didn't survive the move.*

Statically generating websites has been a trend for a while but is often overlooked as an strategy to avoid costs. In this blog post I will explain how I have converted this very website in to a statically generated one, making my hosting free. And it only took me under an hour.

## The Costs of Hosting Umbraco

We might've all been creating Umbraco websites since the dawn of time. A good old server-side rendered, Razor website. This is probably the easiest way to start developing an Umbraco website. And actually, that is exactly what this website is. A big good chunk of code. Traditionally this website would have been hosted on an IIS Server with Umbraco 8 and lower. Which means you would have had to rent a Windows VPS. You would have to do server maintenance to make sure your server is up-to-date. This costs a lot of time, and comes with high subscription costs. Previously I was paying 10 euro's a month for a VPS (which is not too bad) but 18 euro's a month for a Windows license. That comes to a total of 38 euro's per month. That is at least a couple of night of diner.

With the modern Umbraco we have access to .NET 6, which means we could run our Umbraco website on a Linux VPS. Decreasing the costs. But this requires some serious knowledge of Linux and hosting websites 'manually'. Something I don't have... But we can make it even cheaper!

## Introducing Netlify

I've heard people talking about Netlify, but I never understood the power. But not anymore, let me introduce you to free hosting. Well... if you have a static website. Netlify offers a starter plan which is free, it allows you to deploy a static website to their Edge. Even allowing you to bind your own domain to it.

But in short; Netlify is a cloud-based platform that simplifies web development and hosting. It offers features like continuous deployment, automatic scaling, and built-in CDN, making it easy to deploy and manage websites. *~ ChatGPT*

## Static Site Generation

We cannot deploy an Umbraco website to Netlify. That is not how it works. What we can do is generate an Umbraco website to a lot of html files and deploy that to Netlify. It is called static site generation. And it is great, for most people. Because it does come with some costs. It means your website is completely static, there are no more server-side calculations on request. There is no Umbraco Forms, no Umbraco Commerce. Well, even no pagination on overview pages.

So how does it work?

Using the Umbraco plugin xStatic we can generate each of our published nodes to an html page. Just like a running Umbraco website it will include everything you would expect. You can also include your assets like CSS and JS. And it will deploy your media as well. And what you're left with is a bunch of folders and HTML, CSS and JS files. Which is basically what your browser is receiving anyway. Why would we have to render the HTML on every request when we can do it once?

## Working with xStatic

It took me under an hour to set-up xStatic, configure Netlify and have my DNS switched from the old VPS to Netlify. For documentation on how to configure xStatic it is best to look at the documentation, this blog might be outdated soon.

Quick tip: if the xStatic dashboard does not show up, you need to add it to the 'Administrators' role's sections from the Users -> Groups page.

When building a profile you should think about the following things:

- Make sure you have selected all of your image roots
- Set your media crop definitions
- Do not use crop aliases from the media picker\* but directly get the crop URL with a width and height
- You can add your assets recursively with `/assets/*`
- Make sure your root hostname is not / but `localhost:[port]` otherwise it won't generate the right URL's

And probably the best thing is that above set-up was done in under an hour. From finding the package, to serving the website in Netlify. I did not have to change a single thing except for the image cropper.

*\* As of September 2023 the media picker crop alias does not yet work with xStatic, issue raised [here](https://github.com/Mulliman/xStatic-for-Umbraco/issues/25). This also means focus points are not working.*

[Go to GitHub page](https://github.com/Mulliman/xStatic-for-Umbraco)

## Who should benefit?

For small websites like these a statically generated website is perfect. No hosting costs, no need to think about hosting or server maintenance. It just exists. But who shouldn't use this strategy? If you want to include any of below features you should probably not consider this way of working.

- You want to work with Forms
- You want to make a web shop with Commerce
- You want to have overview pages with filters or pagination
- You want to have personalization

Basically anything that requires dynamic server responses should stay away from static site generation.

## Where is Umbraco hosted?

One downside of working with static site generation and absolutely no server is that you don't host your CMS. What I did is install uSync and get my media in Git. This way your whole Umbraco database is in Git. Making it great for source control and you can install your website locally on any machine\*. I can now locally develop and edit my website, which is automatically published to Netlify. Which does mean this approach is perfect for single person blog websites, but not for big content platforms. It is not possible for more than 1 person to edit at the same time.

*\* this won't include the xStatic set-up step, which has to be repeated on every new device.*

## Conclusion

The second I saw the plugin I was convinced. At the moment xStatic still has some bugs which you might find here or there, but it is completely functional. I can definitely recommend this way of working if you don't match the above list. Thank you to the creator of xStatic for bringing the community such a great package.

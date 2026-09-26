---
title: "Codegarden 2023: A Friendly Conference"
date: "2023-06-29"
excerpt: "My highlights from Codegarden 2023 in Odense: the pre-party at Umbraco HQ, the keynote, the Strangler Fig pattern, plain text encoding and the hackathon."
tags: ["Umbraco", "Events"]
author: "Roy Berris"
---

# Codegarden 2023: A Friendly Conference

*Originally published on the old Berris.dev blog in June 2023 and moved here with its original text. The photos from the original post didn't survive the move.*

From 13 till 17 June I had the privilege to attend Codegarden in Odense, Denmark with my colleagues and here are my personal highlights from this wonderful week.

## What is Codegarden?

The Codegarden conference is the official yearly conference from [Umbraco](https://umbraco.com). This year it was hosted in Odense, Denmark. The same city where the Umbraco HQ resides. During Codegarden there are several talks about Umbraco and .NET in general. From best practices to case studies, it's THE conference for Umbraco developers. And it's the friendliest conference I've been to and here is why.

**A Friendly Conference**

Each year Codegarden welcomes you with a high five. When you walk towards the venue on the first morning a lot of people from HQ are on the side of the road. When you cross them they will welcome you with a high five. This is a long time Umbraco tradition when greeting each other on Umbraco events. The hashtag #H5YR (High-five, you rock!) is well known to the community. After arriving at the venue it's a bit overwhelming. There are standing logs everywhere, a big mainstage, friendly people serving coffee and everyone from HQ is there. Or, it might've been overwhelming for another reason. Maybe from the night before?

## The Pre-Party

Before the first day of Codegarden you are invited to join other Umbracians on a trip to HQ located near the venue. Each year HQ hosts a pre-party where a lot of people can meet and greet each other before the official conference starts. It's a unique look into the office where the product is developed. You are free to look around and leave some iO stickers on the furniture (sorry guys). And what is a party without a lot of øl? (the Danish word for beer). When visiting HQ it's a tradition to bring your own pull-request. A wordplay on bringing your own beer from your country or region. But don't worry, if you came empty handed HQ got us covered with free drinks. This year I also had the honor of bowling with a pineapple, playing a game of table football and watching some professional beer pong players. Also, there was a bird?

Me and my colleagues arrived early in Odense so we did some sight seeing in the beautiful city center. But we aren't Dutch if we didn't end our stroll quickly and move to a local bar where we decided to taste the øl.

And ah yes, why the exotic shirts you might ask? This year the pre-party had a Hawaiian theme and it was a lot of fun spotting other Umbracians in the city center wearing the same style of clothes. The people of Odense must have wondered what was happening.

It's a big tradition at Codegarden to eat at Storms Pakhuys the day before the conference just before you go to the pre-party. And that is what we did. I found another photo of me enjoying the delicious food of Burger Anarchy!

## We're here for Umbraco

Alright, enough partying. Of course the 3 day during conference is not all about øl. We are here for the Umbraco CMS. We are here for the Umbraco Community. We are here to get knowledge and learn from the experts. We are here for work after all. So that is what I did, and the following 5 sessions where the most interesting to me personally. (Not in any particular order).

## 1. Umbraco Keynote

It's always a nice start when we get energy from the very people that work on the CMS. During the keynote the CTO of Umbraco, Filip Bech-Larsen, presented us the roadmap (which was not a roadmap) for Umbraco. What features can we expect in the coming year(s) for the Core product. What are the plans with Headless. How are they improving Cloud. It personally gives me pleasure seeing the way Umbraco is headed and that HQ recognizes the daily struggles that developers face when working with Umbraco. They are working to perfect Umbraco which is already a beautiful product. Going the extra mile where other companies might not. If you are interested in the roadmap you can follow the link below.

[Umbraco Roadmap](https://umbraco.com/products/knowledge-center/roadmap/)

## 2. The Strangler Fig Pattern

Adam and Pritesh introduced me to the Strangler Fig Pattern. Previously this was not on my radar as something I'd do with an Umbraco project. Seeing legacy Umbraco 7 projects which are way too complex to upgrade to the latest version with a big bang approach, Adam and Pritesh introduced me to the Strangler Fig pattern. The idea is as follows, take the old solution and map all the features it has. Create a new solution on the side and migrate each feature one-by-one while having both applications online. This means the old project will slowly shrink down to nothing, and the new solution slowly grows. This is done by putting a gateway in front of the projects and routing requests accordingly.

The main thing I took away from this presentation is **don't do it** unless you're absolutely aware of what you're doing. It's a beautiful approach if you have the time and the client buys in to the idea. It's probably more expensive than doing a big bang approach but it allows you to give value to the customer earlier, and every start developing the new solution beyond what it was.

*The big bang approach refers to the approach where you are rebuilding a Umbraco 7 website and replacing it by a Umbraco 10 website after the upgrade is done. Introducing new features while upgrading\* will cause twice the amount of work because you'll have to introduce them to both applications.*

*\* this is usually a problem when an upgrade takes several months, rather than days or weeks.*

[Read more](https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig)

## 3. There's No Such Thing As Plain Text

This talk had nothing to do with Umbraco, but as a programmer it was fantastic. Dylan Beattie introduced us to the world of text encoding. Why ASCII is terrible and why it exists. Why there was a need for UTF. And everything that has something to do with text on a computer. There is simply no such thing as plain text.

Did you know that the rainbow flag emoji does not exist but in fact it is a white flag (🏳️) and a rainbow emoji (🌈) and your device will add these together and present the rainbow flag emoji (🏳️‍🌈)? Well something in those lines, Dylan did a better job explaining.

If you find that interesting, I managed to find the talk on YouTube. It's not from Codegarden, but that doesn't mean it is less entertaining to watch!

[Watch it here](https://www.youtube.com/watch?v=hI-eAg3hlcM)

## Time for a break

Of course there was a lot of networking friend making at Codegarden. And this can only be done when you are not listening to one of the talks. Especially at the outside space. Between the talks it was time to settle down and enjoy yourself. Let all the knowledge sink in. It was a great diner by the way!

## 4. The Backender's Guide: Vite, UUI and everything

The new backoffice is coming in, hopefully, 2024 and it is a hot topic right now. As a backender it is quite a struggle to be updated on all the latest frontend magic. Luckily Callum Whyte is here to help and show us what a struggle it really is to create a package with the new backoffice. To my surprise, it isn't a struggle at all. While javascript will always be magic for a .NET developer it is not complex to migrate your old package to the new stuff. While I have little frontend knowledge of todays frameworks I understood the assignment and as a programmer I am satisfied with the result. Just like any backender fiddling in the frontend a few bugs occurred. And with the demo gods on our side, Callum managed to talk his way through it and give us a good demo of the new way of creating packages. Thanks [Callum](https://www.youtube.com/watch?v=Yb6dZ1IFlKc)!

If you want to read more on the new backoffice click the link below.

[Read more](https://docs.umbraco.com/umbraco-cms/extend-your-project/backoffice-extensions)

## 5. Drop-in Hackathon

On the last morning of Codegarden a bugfix bingo was organized by Sebastiaan to finish the week productively. With a small hangover from the diner party I arrived at the venue 30 minutes late, just in time to 'drop in' to the hackathon. Because I am a chicken I asked for an easy ticket. I got ticket #4671 for the Umbraco Docs. I did the deed and got the #H5YR's from the people around me. Apparently there is a meme around this particular event which Sebastiaan presented at the start of the hackathon. If you're the first one to complete a pull request you are invited on to the stage and you'll replay the meme. Because I was a bit late I missed the explanation. So I was a bit confused on why everyone was so happy, but I am honored to replay the meme. And to start another meme, I kept my ticket and put it in a frame when I got back home. Thanks for the hackathon Sebastiaan #H5YR and will definitely join next year!

## Conclusion

The Umbraco conference is the friendliest and most fun Umbraco event of the year. When we were in the train back to Copenhagen I was already looking forward to next year's Codegarden. Thanks all for making it a nice week in Denmark. Fortunately for us we had to spend the night in Copenhagen so the week was not over. One last picture of me and my colleagues at a korean bar somewhere in Copenhagen enjoying another øl. Thanks to Umbraco for hosting such a great event. And see you next year!

*P.S. to my boss, it's a coincidence I have beer in every picture on this blog post. A lot of water got ingested during the days in Denmark.*

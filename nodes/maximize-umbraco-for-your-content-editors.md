---
title: "Maximize Umbraco for Your Content Editors"
date: "2022-08-28"
excerpt: "Five small Umbraco changes that improve the content editor experience: groups and tabs, list views, property descriptions, consistency and property order."
tags: ["Umbraco", "Best Practices"]
author: "Roy Berris"
---

# Maximize Umbraco for Your Content Editors

*Originally published on the old Berris.dev blog in August 2022 and moved here with its original text. The screenshots from the original post didn't survive the move.*

Small things to greatly improve the editing experience of content editors which don't take much time to edit.

## How do editors experience Umbraco?

Umbraco is the Friendly CMS right? But how overwhelming can it be for someone with no technical knowledge. A lot of time we, the developers, will make things a bit odd. Logic we add to document types makes sense to us and our colleagues but not to the person using it. We might spend a month or two building the website. But the editor has to work with it for years.

When creating something that is not solid from the start, we'll most likely end up with technical debt and unhappy editors when we need to migrate things later.

In this post I will walk over some things you can do to improve the experience of content editors without having to migrate any content or do tricky things. We'll just go over some basics.

## 1. Use groups and tabs

Scrolling through long documents with a lot of fields is not really a friendly experience. An average page on a small to medium platform will probably have these settings.

1. Title
2. Intro
3. Header Image
4. Components (blocklist editor, or nested content)
5. Publication Date
6. SEO
7. Tagging
8. Sitemap
9. Social Sharing

These are the settings we give the editor control over on a recent website I've made. It's a lot of content especially with some content components on it it'll get vertical fast.

Luckily for us Umbraco allows us to use groups and tabs to split our document types in to section. Keep things together that belong together. For example the title, intro and header image fields are apart of the "Header" group. The content components will get their own group called "Content". Together "Header" and "Content" will be the "Page" tab.

Just to show an example of how I've split above sections in to groups and tabs on that website.

- Page
  - Header
    - Title
    - Intro
    - Header Image
  - Content
    - Components
- Meta
  - Publication Date
  - Tagging
- SEO
  - Seo Title
  - Seo Description
- Sitemap
  - Sitemap Settings
- Social Sharing
  - Social Sharing Settings

## 2. Use list views

We all have collection documents in our project, frequently referred to as overview pages. Hierarchically they represent the collection node for a lot of items of the same type. And usually this means it is the end of the road, because editors won't create nodes deeper than the detail pages nested under the overview pages. The page you are looking at right now is a blog page. Which has a blog overview page as its parent. When we have collection pages it's nice for the editor to see their children in one overview. To do so you should enable the list view which you'll find in the document type's tabs section.

Doing so will remove the children of the collection node from the tree view, instead showing them in their own overview in the back office. Editors now have the ability to display the list view as they want. In cards, or in list items. They can search the current collection. When you have a lot of nodes under this page it will load a bit quicker than if you would expand it in the tree view. This is because the list view offers pagination, making it quicker to load one page, instead of the whole tree.

But it doesn't stop there. As the developer you have the ability to create custom list views. Add more properties from the children nodes to the overview allowing for extra information.

For example, I have the property `publicationDate` and I want to show this on the overview. When you're in the list view tab, you can click the cogwheel to open the list view settings and add the publication date property under the "Columns displayed" section.

If you want to go further you can even create your own views for the list items in the views. By default Umbraco offers a grid or a list.

[Read more here](https://docs.umbraco.com/umbraco-cms/model-your-content/property-editors/built-in-umbraco-property-editors/collection)

## 3. Describe your properties

When working on larger document types it might be useful to provide more information on what the property does. Some properties are as is, and don't need any more description then their name. Title, Intro Text or Header Image don't really need any more information. Too much information might confuse your editors. But if I have the property Publication Date. And I make this a not required property. What does this mean? If I set it to a future date, will this hide the page until that date is here? If I leave it empty, will it fallback to the document's create date? These questions can be tackled by a simple description.

*The publication date property will decide when this page should be visible and is shown on the website. This is also leading for the RSS feed. Will fallback to the documents created date when empty.*

Think about the editor and add descriptions on things that might not speak for itself. Takes little to no time. But it might save your editors from asking the same questions over and over.

## 4. Be consistent

Consistency is key when working with a lot of different document types that essentially do the same thing. A website I worked on had a lot of types of detail pages.

- Content Page
- Blog Page
- News Page
- Event Page
- Interview Page
- Travel Page
- And more..

From a design perspective, these are all the same. They all have a header with a title, intro text and an header image. They all have some components with content and a footer. (Very simplified, but its true). From a CMS perspective they hold a semantic value. We might want to differentiate these pages so users can search for them. Get an overview of all news articles. For the editor it's a way of implicitly tagging a page. Choosing to create a news page, means its a news page. We don't use the generic content page for this.

Imagine having to work with all these pages but they are inconsistent. The first 5 were build in the initial release. While others followed in updates. Different developers worked on it. Resulting on different naming conventions and ordering of properties. The content and blog page had an Intro properties that is rendered in the header. The travel page has a Introduction property. The interview page as an Intro text property. They are the same thing. On the news page the order was title, intro, header image. On the event page this was title, event date, header image, intro. Long story short, a mess.

When building a new website I highly recommend using compositions. They will offer consistency. On any project nowadays I will create a compositions for every property or property group. Things that belong together. I'll give it the right order in the composition. And make every page implement the composition. This will I can guarantee that the order is the same, naming is the same and that future developers will just follow this trend. They'll most likely look at how other pages are built and just copy it over.

If you have an existing website which doesn't use compositions, no problem! You can still go over your pages and make sure the labels of the properties and the order is the same on all pages. While you're at it, add some descriptions (#3). Maybe even regroup things in to tabs and groups (#1). Just keeps things tidy and clean up your project.

## 5. Order

For us developers it's logical that the document we are editing is representing a page. And we know in our heads how this will look because we created the page. But this is not the same for everyone. People that don't create websites on the daily might have some trouble with that. Especially if your properties are not in the same order as the page representing them.

Help your editors by putting properties in a logical order. Look at the pages that are rendered from the document. Look at the document type. Do they match? If the answer is no, you know what you need to do.

## Conclusion

When you've sprinted a couple of sprints. Had to get that deadline. We all make mistakes in the rush of completing the project. But no worries, we can fix those problems. Just make sure you take a day after the project is delivered to dot the I's and cross the T's. Having a happy editor will most likely persuade them to expand on the project. Extending the longevity of the website. Requesting more features. If they get irritated or confusing by working with Umbraco, it might go the other way.

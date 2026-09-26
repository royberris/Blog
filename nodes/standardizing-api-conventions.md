---
title: "Standardizing API Conventions with ADRs"
date: "2025-09-05"
updated: "2026-09-26"
excerpt: "How one two-hour DevAlign session and a set of Architecture Decision Records (ADRs) gave my team consistent API naming, versioning, errors and pagination."
tags: ["API", "Software Architecture", "ADR", "Team Collaboration"]
author: "Roy Berris"
---

# Standardizing API Conventions with ADRs

**TL;DR:** Inconsistent API design across a growing team led to integration errors, messy error handling and unexpected breaking changes for partners. I fixed it with a two-hour "DevAlign" session with one person each from development, testing, product management and operations, and documented every agreed convention as an Architecture Decision Record (ADR): plural resource names, URI-based versioning, one error format (code, message, details) and cursor-based pagination.

Throughout my experience as a software architect, few challenges have proven as persistent and impactful as maintaining consistency across API design within growing development teams. The absence of standardized conventions creates a cascading effect of integration complexity, developer confusion, and technical debt that compounds over time. Recognizing this critical gap in our organizational practices, I initiated a systematic approach to establish unified API conventions through collaborative decision-making and structured documentation.

## What does inconsistent API design cost a team?

The symptoms of inconsistent API design manifest across multiple dimensions of software development. In our organization, endpoint naming conventions varied significantly between developers, with some employing singular resource names while others utilized plural forms. This inconsistency created unnecessary cognitive overhead during integration work and increased the likelihood of implementation errors.

Error handling presented another significant challenge. Different services returned error responses in disparate formats, complicating client-side error processing and making automated testing more complex. The lack of standardized pagination strategies resulted in performance issues and inconsistent user experiences across services consuming shared data sources.

External partners consuming our APIs expressed frustration with unpredictable versioning schemes that led to unexpected breaking changes. These real-world consequences demonstrated the urgent need for comprehensive, well-documented API conventions to enhance system maintainability and developer productivity.

## How did ADRs and a DevAlign session fix it?

I implemented a two-pronged approach centered on [Architecture Decision Records (ADRs)](https://adr.github.io/) and facilitated cross-functional collaboration. ADRs provide a structured framework for documenting architectural decisions, capturing context, alternatives considered, and rationale behind chosen approaches. This methodology ensures transparency in decision-making while creating institutional knowledge that persists beyond individual team member tenure.

To operationalize this approach, I designed a collaborative workshop format I termed a "DevAlign" session. This structured engagement involved one representative from each functional role (development, testing, product management, and operations), ensuring comprehensive perspective representation in our decision-making process.

The two-hour session combined focused discussion with practical prototyping exercises. This hands-on approach enabled real-time validation of proposed conventions and fostered consensus through active participation rather than passive acceptance of imposed standards.

## Which API conventions did we agree on, and why?

The collaborative process yielded several key conventions that we formally documented through ADRs:

**Resource Naming Standards:** We standardized on plural noun usage for endpoint paths, aligning with RESTful principles and improving API predictability. This decision eliminated ambiguity while conforming to established industry patterns.

**Versioning Strategy:** URI-based versioning was selected to provide explicit visibility of breaking changes to API consumers. While header-based alternatives were evaluated, URI versioning offered superior compatibility with routing infrastructure and caching mechanisms.

**Error Response Structure:** We established a consistent error object format containing code, message, and details fields. This standardization simplified client-side error handling while improving system observability and debugging capabilities.

**Pagination Implementation:** Cursor-based pagination was adopted to enhance performance with large datasets and prevent data consistency issues during concurrent modifications. This approach proved superior to offset-based alternatives in our high-throughput scenarios.

Each decision was thoroughly documented with context, alternatives analysis, and acknowledged trade-offs, ensuring our conventions remained both practical and adaptable to future requirements.

## Practical recommendations for implementation

The success of this initiative depended on several critical factors that other organizations can leverage:

**Stakeholder Engagement:** Involving representatives from all affected roles ensures comprehensive perspective consideration and builds ownership commitment to established conventions.

**Documentation Rigor:** Implementing ADRs as living documents creates accountability and provides historical context for future decision-making processes.

**Incremental Approach:** Beginning with core conventions and expanding systematically prevents overwhelming teams while establishing momentum for broader adoption.

**Governance Framework:** Establishing periodic review mechanisms ensures conventions evolve appropriately with changing technological and business contexts.

## Conclusion: organizational impact and future considerations

The implementation of standardized API conventions through structured decision-making has generated measurable improvements across our development lifecycle. Developer onboarding efficiency has increased significantly due to reduced learning overhead. Documentation quality has improved substantially, with ADRs serving as authoritative references complementing API specifications.

Integration defects related to API inconsistencies have decreased markedly, contributing to enhanced system stability and customer satisfaction. External partner collaboration has become more streamlined due to predictable, well-documented interfaces.

This systematic approach to convention establishment demonstrates the value of combining structured decision documentation with inclusive collaboration processes. The investment in establishing clear guidelines has positioned our organization to scale development capabilities while maintaining high standards of technical quality and developer experience.

## FAQ

### What is a DevAlign session?

It's the workshop format I designed to agree on API conventions: a two-hour session with one representative from each role (development, testing, product management and operations). It combines focused discussion with hands-on prototyping, so proposed conventions get tested on the spot instead of being imposed.

### Why document API conventions as ADRs?

An ADR captures the context, the alternatives considered and the reasoning behind a decision. That keeps decisions transparent and keeps the knowledge in the team when people leave. Our ADRs now serve as the reference next to the API specifications.

### Why URI-based versioning instead of header-based versioning?

URI-based versioning makes breaking changes explicitly visible to API consumers. We evaluated header-based versioning, but URI versioning worked better with our routing infrastructure and caching.

### Why cursor-based pagination instead of offset-based pagination?

Cursor-based pagination performs better with large datasets and prevents data consistency issues when records change during paging. In our high-throughput scenarios it worked better than offset-based pagination.

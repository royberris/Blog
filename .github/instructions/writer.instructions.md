# Technical Blog Writing Guidelines

## Author Persona

Establish yourself as an experienced software architect with substantial expertise in .NET and C# development. You demonstrate technical depth through practical experience while maintaining approachability. Your writing reflects intellectual curiosity, evidence-based reasoning, and a commitment to sharing actionable insights derived from real-world project implementations.

## Voice & Tone Standards

- Maintain a conversational yet professional tone that balances authority with approachability.
- Keep the conversational tone consistent throughout the entire piece, avoiding shifts to formal language.
- Demonstrate confidence through expertise while remaining receptive to alternative perspectives.
- Employ first-person narrative ("I", "my") consistently to establish personal connection. Avoid "we" unless clearly referring to a specific team context.
- Address readers directly as "you" to maintain engagement and connection.
- Utilize active voice and direct sentence construction for clarity.
- Eliminate marketing terminology and industry buzzwords in favor of precise yet conversational technical language.
- Express intellectual curiosity and commitment to continuous learning.
- Use consistent terminology throughout the post rather than varying synonyms for the same concept.og Writing Guidelines

## Content Structure Requirements

- Construct paragraphs containing 2-5 sentences for optimal readability.
- Employ clear, declarative sentences while avoiding excessive complexity.
- Minimize run-on sentences and complex subordinate clause structures.
- Implement logical transitions to guide reader comprehension.
- Decompose complex concepts into accessible, sequential components.

## Standard Article Framework

1. **Introduction**
    - Present the topic's relevance and significance within the current technical landscape.
    - Establish personal context or professional motivation for addressing the subject.
2. **Problem Analysis**
    - Define the challenge, context, or technical gap being addressed.
    - Reference established industry practices or documented limitations where applicable.
3. **Solution Architecture**
    - Detail your methodology, decision-making process, and implementation approach.
    - Analyze alternative solutions and provide rationale for your selected path.
4. **Implementation Insights**
    - Document successful strategies, encountered obstacles, and unexpected discoveries.
    - Include both technical and organizational learnings from the experience.
5. **Practical Recommendations**
    - Provide specific, actionable guidance for readers facing similar challenges.
6. **Conclusion**
    - Synthesize key findings and consider future implications or areas for exploration.

## Blog Post Header Requirements

All blog posts must include a YAML front matter header at the beginning of the file with the following structure:

```yaml
---
title: "Blog Post Title"
date: "YYYY-MM-DD"
excerpt: "Brief description of the blog post content and key insights covered."
tags: ["Tag1", "Tag2", "Tag3"]
author: "Roy Berris"
---
```

Required fields:
- **title**: Descriptive title that clearly indicates the blog post topic
- **date**: Publication date in YYYY-MM-DD format
- **excerpt**: Concise summary that describes the main content and value proposition
- **tags**: Array of relevant technical tags for categorization and searchability
- **author**: Must be "Roy Berris"

## Tag Selection Guidelines

**CRITICAL**: Always use existing tags from `/data/tags.json` before creating new ones. The blog system validates all tags against this centralized configuration file and will issue warnings for undefined tags.

### Tag Selection Process

1. **First**: Review existing tags in `/data/tags.json` to find appropriate matches
2. **Consider**: Whether your content aligns with existing tag definitions
3. **Reuse**: Existing tags even if they're not perfect matches (better than creating duplicates)
4. **Request**: New tag additions only when no existing tag adequately represents the content
5. **Validate**: Ensure all selected tags exist in the tags configuration

### New Tag Creation

When existing tags are insufficient:

1. **Justify**: Explain why existing tags don't adequately categorize the content
2. **Define**: Provide a clear, concise description for the new tag
3. **Update**: Add the new tag to `/data/tags.json` with proper fullName and description
4. **Consistency**: Ensure the new tag doesn't overlap with existing categories

### Tag Quality Standards

- Use 2-4 tags per blog post for optimal categorization
- Select tags that accurately represent the primary topics discussed
- Avoid overly specific tags that may only apply to a single post
- Prefer broader, reusable tags that can categorize multiple future posts
- Maintain consistency with established tag naming conventions

## Formatting Standards

- Implement descriptive, hierarchical headings (H2/H3 levels as appropriate).
- Utilize structured lists (bulleted and numbered) to enhance content organization.
- Apply **bold** or *italic* emphasis judiciously for key terminology.
- Use commas as separators instead of em dashes (—) for improved readability.
- Maintain formatting consistency while avoiding excessive stylistic elements.

## .NET & C# Technical Standards

- Reference .NET framework and C# language features using official terminology.
- Specify version numbers when discussing framework or language capabilities.
- Employ canonical names for libraries, tools, and development technologies.
- Cite Microsoft documentation or authoritative sources for technical assertions.
- Present approaches and concepts through descriptive prose rather than code examples.

## Evidence-Based Writing

- Substantiate technical claims with references to documentation, specifications, or authoritative sources.
- Clearly distinguish between factual statements and professional opinions.
- Include quantitative results, performance metrics, or measurable outcomes when available.
- Avoid unsubstantiated generalizations or unsupported technical assertions.

## Architecture Decision Records Integration

- Reference Architecture Decision Records (ADR) methodology when discussing design choices.
- Articulate the value proposition of decision documentation for organizational knowledge.
- Advocate for ADR adoption to enhance traceability and institutional memory.

## Content Guidelines

**Required Practices:**
- Employ first-person perspective with authentic personal experiences.
- Maintain clarity and precision in technical communication.
- Structure content for efficient scanning and information retrieval.
- Present both successful outcomes and lessons learned from failures.
- Provide citations for factual claims and technical references.
- Utilize structured formatting to enhance readability.
- **Use only validated tags from `/data/tags.json` in blog post frontmatter.**

**Prohibited Practices:**
- Include code snippets or inline programming examples.
- Employ unexplained jargon or technical acronyms without context.
- Overstate personal expertise or make unsupported authority claims.
- Construct lengthy, unstructured paragraph blocks.
- Adopt promotional or sales-oriented language.
- **Create new tags without first checking existing options and updating the tags configuration file.**

## Content Planning Template

### Architecture Decision Documentation in .NET Development

- Introduction: Professional challenges in maintaining decision history and rationale.
- Problem Analysis: Common organizational pain points in architectural knowledge management.
- Solution Implementation: ADR integration methodology and workflow adaptation.
- Implementation Insights: Practical discoveries, adoption challenges, and organizational benefits.
- Practical Recommendations: Implementation strategy and adoption best practices.
- Conclusion: Long-term impact assessment and future considerations.

## Quality Assurance Criteria

- Content demonstrates clarity and technical precision.
- Paragraph and sentence structure supports efficient comprehension.
- Professional tone balances expertise with accessibility.
- Technical assertions include appropriate supporting evidence.
- Article structure facilitates information scanning and retrieval.
- Technical terminology maintains accuracy and consistency.
- Architectural decision-making content references ADR methodology appropriately.
- **All tags used in frontmatter exist in `/data/tags.json` configuration.**
- **Tag selection follows established guidelines and reuses existing categories when appropriate.**

## Documentation Maintenance

- These guidelines serve internal content development and quality assurance.
- Regular review and updates should reflect evolving audience needs and platform requirements.
- Incorporate feedback from technical reviewers and audience engagement metrics.
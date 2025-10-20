# LLMs.txt Generation

This project automatically generates an `/llms.txt` file during build time, similar to how NVIDIA's website provides a structured glossary for AI consumption.

## How it works

1. **Tag-Based Extraction**: The system uses only the actual tags from your blog post frontmatter
2. **Centralized Definitions**: Tag descriptions are managed in `/data/tags.json`
3. **Clean Output**: No complex pattern matching - just the tags you explicitly use
4. **Build Integration**: Automatically runs during `npm run build`

## Generated Content Structure

The `/llms.txt` file includes:

- **Technical Glossary**: Terms based on your actual blog tags with managed descriptions
- **Blog Posts**: Complete list of all blog posts with excerpts
- **Tags**: Categorized view of content by tags

## Managing Tags

### Adding New Tag Descriptions

Edit `/data/tags.json` to add or update tag definitions:

```json
{
  "Your Tag": {
    "fullName": "Full Display Name",
    "description": "Detailed description of what this tag represents"
  }
}
```

### Tag Structure

Each tag entry should have:
- **fullName**: How the tag appears in the glossary (can be different from the tag key)
- **description**: Detailed explanation for the glossary entry

If a tag isn't defined in `tags.json`, it will fall back to using the blog excerpt as the description.

## Usage

### Production Build
```bash
npm run build
```

### Development
```bash
npm run dev
```
Then visit `http://localhost:3000/llms.txt`

## File Structure

```
data/
└── tags.json                # Tag definitions and descriptions

app/
└── llms.txt/
    └── route.ts              # Route handler that generates llms.txt

out/                          # Generated during build
└── llms.txt                 # Static output file
```

## Current Tags

Based on your blog posts, these tags are currently in use:

- **ADR** (Architecture Decision Records)
- **AI** (Artificial Intelligence) 
- **AI Agents**
- **API** (Application Programming Interface)
- **API Design**
- **Architecture** (Software Architecture)
- **Blogging** (Technical Blogging)
- **Design Patterns** (Software Design Patterns)
- **Software Architecture**
- **Team Collaboration**
- **Technical Writing**

## Environment Variables

- `NEXT_PUBLIC_BASE_URL`: Base URL for generating absolute links (defaults to "https://royberris.com")

## API Access

The generated file is accessible at:
- Static file: `/llms.txt` (during static export)
- Route: `/llms.txt` (with proper headers and caching)
---
name: example-skill
description: A skeleton example skill demonstrating the standard skill structure. Use this as a starting point when creating new skills. Includes sample scripts, references, and proper YAML frontmatter.
license: MIT
metadata:
  author: SkillHub
  version: 0.1.0
  category: template
  tags: [example, skeleton, starter]
---

# Example Skill

This is a skeleton skill that demonstrates the standard structure and conventions for Claude skills.

## Instructions

When this skill is triggered, follow these steps:

### Step 1: Understand the Request

Analyze what the user is asking for and determine if this skill is the right fit.

### Step 2: Execute the Workflow

Perform the core task. Reference scripts and documentation as needed:

- For data processing, see `scripts/hello.py`
- For detailed usage patterns, see `references/usage-guide.md`

### Step 3: Validate Output

Before delivering results, verify:
- Output matches the requested format
- All required fields are present
- No errors were encountered

## Examples

**Example 1: Basic Usage**

User says: "Run the example skill"

Actions:
1. Greet the user
2. Demonstrate the workflow
3. Return formatted output

Result: A successful demonstration of the skill pattern.

## Troubleshooting

**Error: Missing input data**
Cause: Required parameters were not provided.
Solution: Ask the user to specify the missing information.

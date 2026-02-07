Subagents
Subagents are specialized AI assistants that Cursor's agent can delegate tasks to. Each subagent operates in its own context window, handles specific types of work, and returns its result to the parent agent. Use subagents to break down complex tasks, do work in parallel, and preserve context in the main conversation.

You can use subagents in the editor, CLI, and Cloud Agents.

Context isolation

Each subagent has its own context window. Long research or exploration tasks don't consume space in your main conversation.

Parallel execution

Launch multiple subagents simultaneously. Work on different parts of your codebase without waiting for sequential completion.

Specialized expertise

Configure subagents with custom prompts, tool access, and models for domain-specific tasks.

Reusability

Define custom subagents and use them across projects.

If you're on a legacy request-based plan, you must enable Max Mode to use subagents. Usage-based plans have subagents enabled by default.

How subagents work
When Agent encounters a complex task, it can launch a subagent automatically. The subagent receives a prompt with all necessary context, works autonomously, and returns a final message with its results.

Subagents start with a clean context. The parent agent includes relevant information in the prompt since subagents don't have access to prior conversation history.

Foreground vs background
Subagents run in one of two modes:

Mode	Behavior	Best for
Foreground	Blocks until the subagent completes. Returns the result immediately.	Sequential tasks where you need the output.
Background	Returns immediately. The subagent works independently.	Long-running tasks or parallel workstreams.
Built-in subagents
Cursor includes three built-in subagents that handle context-heavy operations automatically. These subagents were designed based on analysis of agent conversations where context window limits were hit.

Subagent	Purpose	Why it's a subagent
Explore	Searches and analyzes codebases	Codebase exploration generates large intermediate output that would bloat the main context. Uses a faster model to run many parallel searches.
Bash	Runs series of shell commands	Command output is often verbose. Isolating it keeps the parent focused on decisions, not logs.
Browser	Controls browser via MCP tools	Browser interactions produce noisy DOM snapshots and screenshots. The subagent filters this down to relevant results.
Why these subagents exist
These three operations share common traits: they generate noisy intermediate output, benefit from specialized prompts and tools, and can consume significant context. Running them as subagents solves several problems:

Context isolation — Intermediate output stays in the subagent. The parent only sees the final summary.
Model flexibility — The explore subagent uses a faster model by default. This enables running 10 parallel searches in the time a single main-agent search would take.
Specialized configuration — Each subagent has prompts and tool access tuned for its specific task.
Cost efficiency — Faster models cost less. Isolating token-heavy work in subagents with appropriate model choices reduces overall cost.
You don't need to configure these subagents. Agent uses them automatically when appropriate.

When to use subagents
Use subagents when...	Use skills when...
You need context isolation for long research tasks	The task is single-purpose (generate changelog, format)
Running multiple workstreams in parallel	You want a quick, repeatable action
The task requires specialized expertise across many steps	The task completes in one shot
You want an independent verification of work	You don't need a separate context window
If you find yourself creating a subagent for a simple, single-purpose task like "generate a changelog" or "format imports," consider using a skill instead.

Quick start
Agent automatically uses subagents when appropriate. You can also create a custom subagent by asking Agent:

Create a subagent file at .cursor/agents/verifier.md with YAML frontmatter (name, description) followed by the prompt. The verifier subagent should validate completed work, check that implementations are functional, run tests, and report what passed vs what's incomplete.

Try in Cursor
For more control, create custom subagents manually in your project or user directory.

Custom subagents
Define custom subagents to encode specialized knowledge, enforce team standards, or automate repetitive workflows.

File locations
Type	Location	Scope
Project subagents	.cursor/agents/	Current project only
.claude/agents/	Current project only (Claude compatibility)
.codex/agents/	Current project only (Codex compatibility)
User subagents	~/.cursor/agents/	All projects for current user
~/.claude/agents/	All projects for current user (Claude compatibility)
~/.codex/agents/	All projects for current user (Codex compatibility)
Project subagents take precedence when names conflict. When multiple locations contain subagents with the same name, .cursor/ takes precedence over .claude/ or .codex/.

File format
Each subagent is a markdown file with YAML frontmatter:


---
name: security-auditor
description: Security specialist. Use when implementing auth, payments, or handling sensitive data.
model: inherit
---
You are a security expert auditing code for vulnerabilities.
When invoked:
1. Identify security-sensitive code paths
2. Check for common vulnerabilities (injection, XSS, auth bypass)
3. Verify secrets are not hardcoded
4. Review input validation and sanitization
Report findings by severity:
- Critical (must fix before deploy)
- High (fix soon)
- Medium (address when possible)
Configuration fields
Field	Required	Description
name	No	Unique identifier. Use lowercase letters and hyphens. Defaults to filename without extension.
description	No	When to use this subagent. Agent reads this to decide delegation.
model	No	Model to use: fast, inherit, or a specific model ID. Defaults to inherit.
readonly	No	If true, the subagent runs with restricted write permissions.
is_background	No	If true, the subagent runs in the background without waiting for completion.
Using subagents
Automatic delegation
Agent proactively delegates tasks based on:

The task complexity and scope
Custom subagent descriptions in your project
Current context and available tools
Include phrases like "use proactively" or "always use for" in your description field to encourage automatic delegation.

Explicit invocation
Request a specific subagent by using the /name syntax in your prompt:


> /verifier confirm the auth flow is complete
> /debugger investigate this error
> /security-auditor review the payment module
You can also invoke subagents by mentioning them naturally:


> Use the verifier subagent to confirm the auth flow is complete
> Have the debugger subagent investigate this error
> Run the security-auditor subagent on the payment module
Parallel execution
Launch multiple subagents concurrently for maximum throughput:


> Review the API changes and update the documentation in parallel
Agent sends multiple Task tool calls in a single message, so subagents run simultaneously.

Resuming subagents
Subagents can be resumed to continue previous conversations. This is useful for long-running tasks that span multiple invocations.

Each subagent execution returns an agent ID. Pass this ID to resume the subagent with full context preserved:


> Resume agent abc123 and analyze the remaining test failures
Background subagents write their state as they run. You can resume a subagent after it completes to continue the conversation with preserved context.

Common patterns
Verification agent
A verification agent independently validates whether claimed work was actually completed. This addresses a common issue where AI marks tasks as done but implementations are incomplete or broken.


---
name: verifier
description: Validates completed work. Use after tasks are marked done to confirm implementations are functional.
model: fast
---
You are a skeptical validator. Your job is to verify that work claimed as complete actually works.
When invoked:
1. Identify what was claimed to be completed
2. Check that the implementation exists and is functional
3. Run relevant tests or verification steps
4. Look for edge cases that may have been missed
Be thorough and skeptical. Report:
- What was verified and passed
- What was claimed but incomplete or broken
- Specific issues that need to be addressed
Do not accept claims at face value. Test everything.
Create a subagent file at .cursor/agents/verifier.md with YAML frontmatter containing name, description, and model: fast. The description should be 'Validates completed work. Use after tasks are marked done to confirm implementations are functional.' The prompt body should instruct it to be skeptical, verify implementations actually work by running tests, and look for edge cases.

Try in Cursor
This pattern is useful for:

Validating that features work end-to-end before marking tickets complete
Catching partially implemented functionality
Ensuring tests actually pass (not just that test files exist)
Orchestrator pattern
For complex workflows, a parent agent can coordinate multiple specialist subagents in sequence:

Planner analyzes requirements and creates a technical plan
Implementer builds the feature based on the plan
Verifier confirms the implementation matches requirements
Each handoff includes structured output so the next agent has clear context.

Example subagents
Debugger

---
name: debugger
description: Debugging specialist for errors and test failures. Use when encountering issues.
---
You are an expert debugger specializing in root cause analysis.
When invoked:
1. Capture error message and stack trace
2. Identify reproduction steps
3. Isolate the failure location
4. Implement minimal fix
5. Verify solution works
For each issue, provide:
- Root cause explanation
- Evidence supporting the diagnosis
- Specific code fix
- Testing approach
Focus on fixing the underlying issue, not symptoms.
Create a subagent file at .cursor/agents/debugger.md with YAML frontmatter containing name and description. The debugger subagent should specialize in root cause analysis: capture stack traces, identify reproduction steps, isolate failures, implement minimal fixes, and verify solutions.

Test runner

---
name: test-runner
description: Test automation expert. Use proactively to run tests and fix failures.
---
You are a test automation expert.
When you see code changes, proactively run appropriate tests.
If tests fail:
1. Analyze the failure output
2. Identify the root cause
3. Fix the issue while preserving test intent
4. Re-run to verify
Report test results with:
- Number of tests passed/failed
- Summary of any failures
- Changes made to fix issues
Create a subagent file at .cursor/agents/test-runner.md with YAML frontmatter containing name and description (mentioning 'Use proactively'). The test-runner subagent should proactively run tests when it sees code changes, analyze failures, fix issues while preserving test intent, and report results.

Try in Cursor
Best practices
Write focused subagents — Each subagent should have a single, clear responsibility. Avoid generic "helper" agents.
Invest in descriptions — The description field determines when Agent delegates to your subagent. Spend time refining it. Test by making prompts and checking if the right subagent gets triggered.
Keep prompts concise — Long, rambling prompts dilute focus. Be specific and direct.
Add subagents to version control — Check .cursor/agents/ into your repository so the team benefits.
Start with Agent-generated agents — Let Agent help you draft the initial configuration, then customize.
Use hooks for file output — If you need subagents to produce structured output files, consider using hooks to process and save their results consistently.
Anti-patterns to avoid
Don't create dozens of generic subagents. Having 50+ subagents with vague instructions like "helps with coding" is ineffective. Agent won't know when to use them, and you'll waste time maintaining them.

Vague descriptions — "Use for general tasks" gives Agent no signal about when to delegate. Be specific: "Use when implementing authentication flows with OAuth providers."
Overly long prompts — A 2,000-word prompt doesn't make a subagent smarter. It makes it slower and harder to maintain.
Duplicating slash commands — If a task is single-purpose and doesn't need context isolation, use a slash command instead.
Too many subagents — Start with 2-3 focused subagents. Add more only when you have clear, distinct use cases.



Agent Skills
Agent Skills is an open standard for extending AI agents with specialized capabilities. Skills package domain-specific knowledge and workflows that agents can use to perform specific tasks.

What are skills?
A skill is a portable, version-controlled package that teaches agents how to perform domain-specific tasks. Skills can include both instructions and executable scripts or code that agents can run.

Portable

Skills work across any agent that supports the Agent Skills standard.

Version-controlled

Skills are stored as files and can be tracked in your repository, or installed via GitHub repository links.

Executable

Skills can include scripts and code that agents execute to perform tasks.

Progressive

Skills load resources on demand, keeping context usage efficient.

How skills work
When Cursor starts, it automatically discovers skills from skill directories and makes them available to Agent. The agent is presented with available skills and decides when they are relevant based on context.

Skills can also be manually invoked by typing / in Agent chat and searching for the skill name.

Skill directories
Skills are automatically loaded from these locations:

Location	Scope
.cursor/skills/	Project-level
.claude/skills/	Project-level (Claude compatibility)
.codex/skills/	Project-level (Codex compatibility)
~/.cursor/skills/	User-level (global)
~/.claude/skills/	User-level (global, Claude compatibility)
~/.codex/skills/	User-level (global, Codex compatibility)
Each skill should be a folder containing a SKILL.md file:


.cursor/
└── skills/
    └── my-skill/
        └── SKILL.md
Skills can also include optional directories for scripts, references, and assets:


.cursor/
└── skills/
    └── deploy-app/
        ├── SKILL.md
        ├── scripts/
        │   ├── deploy.sh
        │   └── validate.py
        ├── references/
        │   └── REFERENCE.md
        └── assets/
            └── config-template.json
SKILL.md file format
Each skill is defined in a SKILL.md file with YAML frontmatter:


---
name: my-skill
description: Short description of what this skill does and when to use it.
---
# My Skill
Detailed instructions for the agent.
## When to Use
- Use this skill when...
- This skill is helpful for...
## Instructions
- Step-by-step guidance for the agent
- Domain-specific conventions
- Best practices and patterns
- Use the ask questions tool if you need to clarify requirements with the user
Frontmatter fields
Field	Required	Description
name	Yes	Skill identifier. Lowercase letters, numbers, and hyphens only. Must match the parent folder name.
description	Yes	Describes what the skill does and when to use it. Used by the agent to determine relevance.
license	No	License name or reference to a bundled license file.
compatibility	No	Environment requirements (system packages, network access, etc.).
metadata	No	Arbitrary key-value mapping for additional metadata.
disable-model-invocation	No	When true, the skill is only included when explicitly invoked via /skill-name. The agent will not automatically apply it based on context.
Disabling automatic invocation
By default, skills are automatically applied when the agent determines they are relevant. Set disable-model-invocation: true to make a skill behave like a traditional slash command, where it is only included in context when you explicitly type /skill-name in chat.

Including scripts in skills
Skills can include a scripts/ directory containing executable code that agents can run. Reference scripts in your SKILL.md using relative paths from the skill root.


---
name: deploy-app
description: Deploy the application to staging or production environments. Use when deploying code or when the user mentions deployment, releases, or environments.
---
# Deploy App
Deploy the application using the provided scripts.
## Usage
Run the deployment script: `scripts/deploy.sh <environment>`
Where `<environment>` is either `staging` or `production`.
## Pre-deployment Validation
Before deploying, run the validation script: `python scripts/validate.py`
The agent reads these instructions and executes the referenced scripts when the skill is invoked. Scripts can be written in any language—Bash, Python, JavaScript, or any other executable format supported by the agent implementation.

Scripts should be self-contained, include helpful error messages, and handle edge cases gracefully.

Optional directories
Skills support these optional directories:

Directory	Purpose
scripts/	Executable code that agents can run
references/	Additional documentation loaded on demand
assets/	Static resources like templates, images, or data files
Keep your main SKILL.md focused and move detailed reference material to separate files. This keeps context usage efficient since agents load resources progressively—only when needed.


Commands
Custom commands allow you to create reusable workflows that can be triggered with a simple / prefix in the chat input box. These commands help standardize processes across your team and make common tasks more efficient.

Commands input example
Commands are currently in beta. The feature and syntax may change as we continue to improve it.

How commands work
Commands are defined as plain Markdown files that can be stored in three locations:

Project commands: Stored in the .cursor/commands directory of your project
Global commands: Stored in the ~/.cursor/commands directory in your home directory
Team commands: Created by team admins in the Cursor Dashboard and automatically available to all team members
When you type / in the chat input box, Cursor will automatically detect and display available commands from all locations, making them instantly accessible across your workflow.

Creating commands
Create a .cursor/commands directory in your project root
Add .md files with descriptive names (e.g., review-code.md, write-tests.md)
Write plain Markdown content describing what the command should do
Commands will automatically appear in the chat when you type /
Here's an example of how your commands directory structure might look:


.cursor/
└── commands/
    ├── address-github-pr-comments.md
    ├── code-review-checklist.md
    ├── create-pr.md
    ├── light-review-existing-diffs.md
    ├── onboard-new-developer.md
    ├── run-all-tests-and-fix.md
    ├── security-audit.md
    └── setup-new-feature.md
Team commands
Team commands are available on Team and Enterprise plans.

Team admins can create server-enforced custom commands that are automatically available to all team members. This makes it easy to share standardized prompts and workflows across your entire organization.

Creating team commands
Navigate to the Team Content dashboard
Click to create a new command
Provide:
Name: The command name that will appear after the / prefix
Description (optional): Helpful context about what the command does
Content: The Markdown content that defines the command's behavior
Save the command
Once created, team commands are immediately available to all team members when they type / in the chat input box. Team members don't need to manually sync or download anything - the commands are automatically synchronized.

Benefits of team commands
Centralized management: Update commands once and changes are instantly available to all team members
Standardization: Ensure everyone uses consistent workflows and best practices
Easy sharing: No need to distribute files or coordinate updates across the team
Access control: Only team admins can create and modify team commands
Parameters
You can provide additional context to a command in the Agent chat input. Anything you type after the command name is included in the model prompt alongside your provided input. For example:


/commit and /pr these changes to address DX-523
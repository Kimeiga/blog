---
layout: ../../layouts/PostLayout.astro
title: "Building a Reftable-Compatible Git Smartlog"
subtitle: "A native Git implementation that works with any repository backend"
description: "How I built a git-branchless alternative that works with reftable repositories using only Git plumbing commands"
date: 2025-11-12
author: "Hakan Alpay"
color: "#00b4ff"
lang: "en"
---

## The Problem

If you've used [git-branchless](https://github.com/arxanas/git-branchless), you know how useful `git sl` (smartlog) is. It shows a beautiful tree view of your local branches, making it easy to see what you're working on without the noise of everyone else's remote branches.

But there's a catch: **git-branchless doesn't work with reftable repositories**.

### What is Reftable?

Reftable is a new ref storage backend for Git that improves performance for repositories with many refs. Instead of storing each ref as a separate file (the traditional approach), reftable stores refs in a compact, indexed format. This is especially beneficial for large monorepos.

The problem? Git-branchless relies on the traditional ref storage format and fails on reftable repos.

## The Solution: git-smartlog

I built a native Git implementation of smartlog that works with **any** Git repository, including reftable ones. It uses only Git's plumbing commands, which are backend-agnostic.

### What It Looks Like

Here's the output of `git lg` (my alias for git-smartlog):

```
╔════════════════════════════════════════════════════════════════╗
║  Git Smartlog - Branch-centric repository view           ║
╚════════════════════════════════════════════════════════════════╝

Baseline: master

⋮
◇ 84c4031 10h NGT-3034: utils for drawing bBox on pdp (#82406)
┣━┓
⋮ ◯ 9d76c6d 10h Fix checkout page login redirect to preserve original request URL
⋮ ┃
⋮ ◯ 5041aaf 9h Add DV to control checkout login redirect behavior
⋮ ┃
⋮ ◯ 48737e1 9h Add cxWebCheckoutPreserveUrlOnLogin to serverComponentDynamicValuesList
⋮ ┃
⋮ ◯ d7c3e84 9h Update checkout server component to use withPlatformServerComponentDvClient
⋮ ┃
⋮ ● 0226ab8 8h (ᐅ fix-checkout-login-redirect) Remove unused ServerComponentType import
⋮
◇ bc24a39 4h (master) [CHATPLAT-3915] Update event names for chat disconnect/connect/reconnect events
```

### Key Features

- **Tree structure** with Unicode box-drawing characters (⋮, ◇, ●, ◯, ┣━┓, ┃)
- **Fork points** from master/main (◇)
- **Branch commits** (◯) with the branch head marked (●)
- **Current branch indicator** with arrow: `(ᐅ branch-name)`
- **Compact time format** (8h, 1d, 5w, 4mo)
- **Only local branches** - no noise from remote branches
- **Works with reftable repos** - uses native Git plumbing commands

## How It Works

The implementation uses only Git's plumbing commands, which work regardless of the ref storage backend:

### 1. Find All Local Branches

```bash
git for-each-ref --format='%(refname:short)' refs/heads
```

This lists all local branches without relying on filesystem structure.

### 2. Find Fork Points

For each branch, find where it diverged from master:

```bash
git merge-base --fork-point refs/heads/master $branch
```

This gives us the commit where the branch forked off.

### 3. Get Branch Commits

Get all commits unique to the branch:

```bash
git log --format='%h|%ar|%s' $branch ^master
```

The key optimization here: we get the hash, date, and message in **one Git call** instead of calling `git log` separately for each commit.

### 4. Render the Tree

The script processes each branch and renders:
- Fork point (◇) with timestamp
- Commits in the branch (◯) in chronological order
- Branch head (●) with branch name
- Current branch gets an arrow indicator (ᐅ)

### Performance Optimizations

The initial implementation was slow because it called Git commands for every commit. Here are the optimizations:

1. **Batch commit data**: One `git log` call per branch instead of one per commit
2. **Eliminate redundant calls**: Since we reverse the commit list, the first commit is always the branch head - no need to call `git rev-parse` to check
3. **In-memory caching**: Store branch head hash in a variable instead of calling Git repeatedly

These optimizations reduced the number of Git subprocess calls from **O(commits)** to **O(branches)**.

## Installation

1. Clone the repo:
```bash
git clone https://github.com/Kimeiga/dotfiles.git
cd dotfiles
```

2. Add the git-spells directory to your PATH in your shell config:
```bash
# In ~/.zshrc or ~/.bashrc
export PATH="$HOME/path/to/dotfiles/git-spells:$PATH"
```

3. Add the alias to your `.gitconfig`:
```bash
git config --global alias.lg '!git-smartlog'
```

4. Use it:
```bash
git lg
```

## Code

- **Main script**: [git-spells/git-smartlog](https://github.com/Kimeiga/dotfiles/blob/master/git-spells/git-smartlog)
- **Test suite**: [git-spells/git-smartlog-test](https://github.com/Kimeiga/dotfiles/blob/master/git-spells/git-smartlog-test)
- **Documentation**: [git-spells/README.md](https://github.com/Kimeiga/dotfiles/blob/master/git-spells/README.md)

## Usage

```bash
# Basic usage
git lg

# Verbose mode (shows commit author)
git lg -v

# Include remote branches
git lg -r

# Show help
git lg -h
```

## Why Not Just Use git log --graph?

You might wonder: "Can't you just use `git log --graph`?" 

The problem with `git log --graph` is that it shows **all** branches by default, including:
- Remote branches from other developers
- Release branches
- Tags
- Merge commits cluttering the view

Even with filters like `--branches --not --remotes`, you lose the master commits that serve as fork points, resulting in a linear history instead of a tree.

Git-smartlog solves this by:
1. Showing only local branches
2. Including master commits as fork points (◇)
3. Hiding irrelevant master history
4. Clearly marking which commits belong to which branch

## Comparison with git-branchless

| Feature | git-branchless | git-smartlog |
|---------|---------------|--------------|
| Works with reftable | ❌ | ✅ |
| Tree visualization | ✅ | ✅ |
| Shows local branches only | ✅ | ✅ |
| Performance | Excellent (Rust) | Good (Bash + Git) |
| Dependencies | Rust binary | Just Git + Bash |
| Customizable | Limited | Easy to modify |

## Future Improvements

Possible enhancements:
- Add color customization options
- Support for showing stashes
- Integration with Git worktrees
- Option to show commit authors inline
- Configurable baseline branch (not just master/main)

## Conclusion

Building git-smartlog taught me a lot about Git's internals and the importance of using the right abstractions. By using Git's plumbing commands instead of relying on filesystem structure, we created a tool that works across different Git backends.

If you work with reftable repositories or just want a lightweight alternative to git-branchless, give git-smartlog a try!

---

**Links:**
- [Source Code](https://github.com/Kimeiga/dotfiles/tree/master/git-spells)
- [git-branchless](https://github.com/arxanas/git-branchless)
- [Git Reftable Documentation](https://git-scm.com/docs/reftable)
---
title: 'Memo: Monorepo'
date: 2020-02-17
tags: post
path: /memo-monorepo
---

> My memos are short, subjective and not exhaustively researched thoughts about issues I currently face.

It is very trendy to have a mono-repository for your projects because "**aLl tHe bIg fOuR Do iT**" which is of course an empty argument. For the fundamentals I suggest reading the report about the [workflow at Google](https://cacm.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/fulltext) which lists all advantages and disadvantages of working with a singular large codebase. Of course there have been many articles about the mono- vs poly-repositories debate, none which I could recommend as they are all highly subjective and often lack arguments.

Therefore I am not going to argue for one side or the other, also because they face very similar issues: they both require rather specific tools and immense DevOps effort at scale. However, my current position can be summarized as follows:

> It is a very good idea for many use cases to start with a mono-repository (and a mono-/module-lithic architecture) and **evolve** with the requirements and processes.

Of course you should not be dealing in absolutes and use argumentative reasoning based on the individual issue at hand and cut the boundaries much like we do in DDD.

No matter which path you will choose, you should be painfully aware of the issues that will ultimately arise if you try to force your existing tooling - which was constructed with poly-repositories in mind - onto this new paradigm. There is a reason the _GAFA_ needs to invest heavily into their tooling and almost all of it is highly specific and self-developed. They do not use the typical branching model, peer review process or continuous integration tools which we all know.

> In the long term you will need to evaluate your position to make a substantial investment which is required to scale.

The most common mistake that will hurt you in the long run and which is easy to mitigate, is to use the _Giflow_ branching model instead of [trunk-based development](https://trunkbaseddevelopment.com). All projects that switched to a monorepo-structure I have seen so far did this and struggled immensely.

Sooner or later however you will face a more challenging issue: Most of us use [Git](https://www.atlassian.com/git/tutorials/monorepos) for version control which is the worst choice for a large monorepo. You will need to fetch every commit and every ref. There are many [**hacks**](https://github.com/korfuri/awesome-monorepo#git) which try to hammer Git in shape for monorepos but they cannot change the concept of the design and I am not aware of any free VCS that specifically supports large-scale monorepos. Furthermore, it seems The Big Four already evaluated all of the available offerings, open-source and commercial, and decided to build their own solutions.

> Are you ready to build your own VCS?

I almost cannot imagine a company that would see the business value in answering "Yes" to this question.

## Postscript

I was made aware of [VFS for Git](https://vfsforgit.org) which advertises with great statistics but have not tried it yet.

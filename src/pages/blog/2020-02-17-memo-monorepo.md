---
title: "Memo: Monorepo"
date: 2020-02-17
category: post
path: /memo-monorepo
---

> My memos are short, subjective and not exhaustively researched thoughts about discussions I currently face.

Currently, it is very trendy to have a mono-repository for your projects because "**aLl tHe bIg fOuR Do iT**" which is of course an empty argument. There is a very good report about the [workflow at Google](https://cacm.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/fulltext) which lists the advantages and disadvantages and many articles have been written about the subjective view of mono- vs poly-repositories.

I am not going to argue for poly-repositories over mono-repositories at all. The former also requires specific tools (e.g [hound](https://github.com/hound-search/hound)) and immense DevOps effort. Personally, I think it is a very good idea for many use cases to start with a mono-repository (and a mono-/module-lithic architecture) and **evolve** with the requirements and processes. Also you should not be dealing in absolutes and use argumentative reasoning how to cut the boundaries much like we do in DDD.

No matter which path you will choose, you should be painfully be aware of the issues that will arise if you try to force your existing tooling - which was constructed with poly-repositories in mind - into this new paradigm. There is a reason the *GAFA* needs to invest heavily into their tooling and almost all of it is highly specific and self-developed. They do not use the typical branching model, peer review process or continuous integration tools which we all know. In the long term you will need to evaluate your position to make a substantial investment which is required to scale.

The most common mistake that hurts you in the long run and which is easy to mitigate, is to use the *giflow* model instead of [trunk-based development](https://trunkbaseddevelopment.com). All projects that switched to a monorepo-structure I have seen so far did this and struggled immensely.

Sooner or later however you will face a more challenging issue: Most of  us use [Git](https://www.atlassian.com/git/tutorials/monorepos) for version control which is the worst choice for a large monorepo. You will need to fetch every commit and every ref. There are many [**hacks**](https://github.com/korfuri/awesome-monorepo#git) which try to hammer Git in shape for monorepos but they cannot change the concept of the design and I am not aware of any free VCS that specifically supports large-scale monorepos. Furthermore, it seems The Big Four already evaluated all of the available offerings, open-source and commercial, and decided to build their own solutions.

> Are you ready to build your own VCS?

I almost cannot imagine a company that would see the business value in answering answering "Yes" to this question.

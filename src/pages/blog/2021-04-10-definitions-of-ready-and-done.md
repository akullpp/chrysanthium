---
title: "Definitions of Ready and Done"
date: 2021-01-07
category: post
path: /definitions-of-ready-and-done
---

In many years of developing software, I saw many **Definition of Ready** and **Definition of Done**. I decided to try to get to the core of these ideas and abstract it as good as possible. I tried to stay true to the core ideas and you see the result of that work. It is certainly not final, it never will be, but I think it is a good starting point for discussion and improvement which should always be based on the specific context of a project.

In reality there is often one person that bring up ideas for discussion because he feels passionate about that particular topic. This should always be encouraged. Often we call these people *drivers*. This is not opposed to the idea of growing or trimming processes organically. Some people instinctively dismiss arguments made from persons of a perceived higher status as top-down authoritarianism. This judgement might be idealogical and/or based on trauma. One should be careful about this kind of prejudice.

Let's start with the preface I like to use in each document:

> The definition is a living document: any member of the team can suggest changes at any time.

The points in these documents have to be approved by the entire team unanimously. If there is a single voice of doubt or disagreement, a consus must be reached before you can implement them.

## Definition of Ready

To understand the benefit of the **Definition of Ready** you need to look at both the assignor and assignee of a task.

For the **assignor** it is a good way to structure his thoughts, revisit them and maybe even shift focus based on further discussion. It will also help him to determine the relation to other tasks and therefore allow for prioritization based on the business value.

For the **assignee** it provides a guideline and a relative stable basis for finding a possible solution.

For **both parties** this will result in insight into the thoughts of the other's role and a basis for discussion. Both will develop a good understanding of the domain and it's language and will take the perspective of the user.

### Template

```text
## Definition of Ready

* There are no open prerequisites

* The scope is not too large

* Acceptance criteria are explicit and exhaustive

* The business value is evident

* The effort needed to solve the task was estimated
```

### Inherent Complexity

The vague statement of "not too large" shows how hard it is to make general rules about the **scope** of a task. It is impossible to say that a task must consist of *x* words.

> Ironman requires you to swim 2.4 miles, there are no shortcuts.

There is a point where it is unreasonable to break things down because the coordination effort will result in more costs. It has become a popular and simplistic view of contrarians to talk about *atomic* and *simplicity* like the holy grail. But there is inherent complexity involved in a task.

### Acceptance criteria

**Acceptance criteria** should ideally be described from a use case perspective without implementation details, e.g. you should not specify that you want a dropdown to select one country out of a list of countries but rather state that you want to be able to pick a country because you want to know where to send the package to and let the designer & developer decide how to solve this in an optimal way.

Practically, they could only include the happy paths if you are in a particular situation. In this case they are not exhaustive, but in general should be concerned about conditionals and errors.

### Business value

Why would you do anything that does not provide a **business value**?

What business value do you add when you add Prettier to your frontend project?

It's actually quite tricky to answer this question. Often times the business value is not clear (for a business person).

> Asking this question helps you to think about the reason why and when to do things.

So stating the business value is actually just a side-effect of you thinking deeply about the value of an issue.

Also the business value sometimes does not need to be explicitly stated, sometimes it is implied.

### Estimations

How to estimate a task depends on the project, some have an explicit process for that, but you don't necessarily need it since it's the path that counts, not the number or shirt size at the end of the process.

> The question whether estimates are good or bad misses the actual point.

We are not slave to a process. It is rather the case that we have an issue that we want to solve in a methodical way and therefore create processes that help us at a certain point in time in our specific situation.

In order to think about an issue from the assignees perspective, let's say a software engineer, we need to have room for thought and imagine how the actual steps for a solution could look like. This often results in further questions and refinement of the issue.

## Definition of Done

In contrast to the Definition of Ready the Definition of Done is way less philosophical and are cold hard facts.

### Template

```text
## Definition of Done

* The code is in alignment with the guidelines

* Technical debt is documented and linked to the issue tracking platform

* Documentation is provided and/or updated

* The functionality meets the requirements as defined by the acceptance criteria

* Automated tests cover the acceptance criteria

* In case of a design the implementation is in compliance

* The code was reviewed by any combination of pair programming, pull request and/or code review

* The functionality is usable on a remote environment

* The functionality is approved by the product owner
```

### Explanations

I hope that you can see the gradual progress from implementation to delivery, but still some explanations might be needed:

* The **guidelines** are normally code-, style and architectural-related and agreed upon previously.

* **Technical debt** is fine but needs to be documented so you do not lose track and can actually plan to fix it.

* The type and scope of **documentation** varies greatly from use case to use case and should be defined beforehand.

* Compliance of **design and implementation** is obviously only applicable for frontend tasks.

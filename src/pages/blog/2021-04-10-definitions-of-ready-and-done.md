---
title: "Definitions of Ready and Done"
date: 2021-01-07
category: post
path: /definitions-of-ready-and-done
---

In many years of developing software, I saw as many **Definition of Ready** and **Definition of Done**. I tried to stay true to the core ideas and abstract them as good as possible and now you see the result of that work. It is certainly not final, it never will be, but I think it is a good starting point for discussion and improvement which should always be based on the specific context of a project.

In reality there is often one person that bring up ideas for discussion because he feels passionate about that particular topic. This should always be encouraged. Often we call these people *drivers*. This is not opposed to the idea of growing or trimming processes organically. Some people instinctively dismiss arguments made from persons of a (perceived) higher status as top-down authoritarianism. This judgement might be ideological and/or based on trauma. One should be careful about this kind of prejudice.

Let's start with the preface I like to use in each document:

> The definition is a living document: any member of the team can suggest changes at any time.

The points in these documents have to be approved by the entire team unanimously. If there is a single voice of doubt or disagreement, a consensus must be reached before you can implement them.

## Definition of Ready

To understand the benefit of the **Definition of Ready** you need to look at both the assignor and assignee of a task. The contracting-based terminology was chosen deliberately.

For the **assignor** it is a good way to structure his thoughts, revisit them and maybe even shift focus based on further discussion with the users and/or other persons of indepth domain knowledge. It will also help him to determine the relation to other tasks and therefore allow for prioritization based on the value of completing the task.

For the **assignee** it should provide a guideline and a relative stable basis for finding an optimal solution.

For **both parties** this will ideally result in insight into the thoughts of the other's role and a basis for discussion. Both will develop a good understanding of the domain and it's language and will take the perspective of the user.

### Template

```text
## Definition of Ready

* There are no unfinished prerequisites

* The scope is not too large

* The acceptance criteria are explicit

* The value is evident

* The effort to solve the task was estimated
```

### Inherent Complexity

The vague statement of "not too large" shows how hard it is to make general rules about the **scope** of a task. It is impossible to generalize that any task must be resolved within one week. There are some inherently complex task that cannot or should not be broken down.

> Ironman requires you to swim 2.4 miles, there are no shortcuts.

It is difficult to identify the ideal granularity where it becomes unreasonable to divide the task into smaller ones which causes the coordination effort to be more expensive than solving the actual task. It has become a popular and simplistic view of contrarians to talk about *atomicity* like the holy grail.

### Acceptance criteria

**Acceptance criteria** should ideally be described from a use case perspective without implementation details, e.g. you should not specify that you want a dropdown to select one country out of a list of countries but rather state that you want to be able to pick a country because you want to know where to ship the package to and let the designer & developer decide how to solve this in an optimal way.

Practically, they could only include the happy paths if it suits your particular situation. In this case they are not exhaustive, but in general you should be concerned about conditionals and errors along the way since sooner or later they will become reality.

### (Business) value

Often we try to justify the priority of a task according to it's value for the business and that's generally a good approach. Why would you do anything that does not provide a **business value**?

It's actually quite tricky to answer this question. Often the business value is not clear for a business person, especially if it is a technical task, but there is value in completing a task even if it's just on a metaphysical level. Sometimes the value does not need to be explicitly stated because it is implied.

> Asking this question helps you to think about the reason why and when to do things.

So stating the value is actually just a side effect of thinking deeply about the *why*.

### Estimations

The ideal way of estimating a task depends on the project. Some have an explicit process for that, but you don't necessarily need it. It's the steps on the path which count, not the shirt size at the end of the process.

> Whether question estimates are good or bad misses the actual point.

We are not slave to a process. It is rather the case that we have an issue we want to solve in a methodical way and therefore create processes that help us at a certain point in time in our specific context.

In order to think about an issue from the assignees perspective, e.g. a software engineer, we need to have room for thought and imagine how the actual steps for a solution could look like. This often results in further questions and refinement of the issue.

## Definition of Done

In contrast to the Definition of Ready the **Definition of Done** is less philosophical and is concerned about cold hard facts.

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

* Compliance of **design and implementation** is obviously only applicable for front-end tasks.

---
title: "Consumer-driven Development"
date: 2019-05-24
tags: post
permalink: /consumer-driven-development
---

**Consumer-driven** in this case means from the viewpoint of the client consuming a REST API by a remote service, indeed it could be any kind of API, even a method, theoretically. We want to assert that the provider returns the expected contract which we defined during the refinement phase.

> Consumer-driven development enables engagement in technical requirements analysis process early on

Let us construct an example by saying that a frontend developer talked to a backend guy and told him the call he wants the following structure to create a new contact:

```json
POST /contact {
  "firstname": string,
  "lastname": string,
  "address": {
    "street": string,
    "city": string,
    "country": string

  },
  "contact": {
    "phone": string,
    "email": string
  }
}
```

The direction of communication here is important, the consumer tells what he wants and the producer creates the required interface. This is how you ensure that you do not fall in the [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it) trap and think about the requirements early in the process which enables you to minimize integration costs once the interface is ready to go live.

> Consumer-driven development will improve communication on critical intersections of responsibilities

The consumer also defines what he expects to be returned in success and error cases, e.g.:

```json
200 {
  "firstname": string,
  "lastname": string,
  "address": {
    "street": string,
    "city": string,
    "country": string

  },
  "contact": {
    "phone": string,
    "email": string
  }
}

400 {
  "key": "VALIDATION",
  "fields": [
    string,
    ...
  ]
}

409 {
  "key": "DUPLICATION"
}
```

Best practice is to keep this information in specific, version-controlled, files. This way you can review changes separately from logic, have a history and even can maintain branches.

> Consumer-driven development provides the evolution of an interface

Indeed you could use [Pact](https://docs.pact.io/) or even derive APIs from the contracts but additional tools require an additional learning curve are often too much because project situation does not justify the additional complexity.

The next step and the first of the every implementation is to write tests against the defined contracts. This is done on provider- as well as on consumer-side. I like to do this in a separate repository with the stack of [ava](https://github.com/avajs/ava) as test runner, [axios](https://github.com/axios/axios) for a better request API, [faker](https://github.com/marak/Faker.js) to generate random data and [joi](https://github.com/hapijs/joi) to validate the response according to a scheme. You can see this in action with the [example repository on GitHub](https://github.com/akullpp/consumer-driven-contracts).

> Consumer-driven development helps to write tests early on

Disregard your stack, the provider should provide a simple mock which generates random data, this is done in about an hour or so at most. Only in situations where direct communication is impossible, you should set up your own mock. Nevertheless, if everything works out fine, there will be no recognizable downtime if the provider takes the real thing online and your integration certainly should not break, otherwise the process was done wrong.

> Consumer-driven development nullifies the cost of integration

Whenever the provider changes the interface in the future, or more precisely, whenever the tests are executed - which should be fairly often - **broken tests will indicate a breaking change or infrastructural issue**.

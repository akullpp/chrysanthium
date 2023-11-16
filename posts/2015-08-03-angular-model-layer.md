---
title: "A Practical Angular Model Layer"
date: 2015-08-03
tags: post
permalink: /angular-model-layer
---

In the Java enterprise world you often have entities and/or data access objects that encapsulate attributes of an object. We want a similar domain model which wraps the truth in a form we can work with. The following pattern powered by [lodash](https://lodash.com/) enables this behavior assuming an HATEOAS REST API.

The common web application architecture for the last decade was dominated by the MVC pattern which is the unachievable idea of a clear definition and separation of application layers. The modern approach to web development replaces this either with more practical models like [Flux](https://facebook.github.io/flux/docs/overview.html) or they don't focus on it - _MVWhatever_ - and implement a practical approach like Angular.

The view in Angular appears to be clearly defined with the scope but gets enriched with logic either by directives or with plain instructions. Being able to call functions from view and bidirectional data binding to a model value is convenient.

You'd think that controllers are clearly defined by name, but they would be better described as view-model.

That leaves us with the actual model, which is often described as the source of truth in backend terminology. The truth in the frontend is retrieved via services as resources from the backend services which in turn get theirs from the database.

I propose the following pattern for the model layer:

```js
angular.service("User", function () {
  function User(resource) {
    var self = _.extend(
      {
        // Resource attributes
      },
      resource
    );

    _.extend(self, {
      // Resource functions
    });

    return self;
  }

  _.extend(User, {
    // Global resource functions
  });

  return User;
});
```

The bonuses you get from this pattern are:

- The clear separation of resource attributes and functions where you can transform the resource from the service, e.g. by omitting certain values, renaming or extending them:

```js
var self = _.extend(
  {
    fullname: [resource.firstname, resource.lastname].join(" "),
  },
  _.omit(resource, ["firstname", "lastname"])
);
```

- The ability to add global functions, e.g. getting an `Address` instance from a resource:

```js
_.extend(Address, {
  fromResource: function (resource) {
    return new Address(resource);
  },
});
```

Which really shines if you do HATEOAS, e.g. you could now get all addresses from a link in the `User` resource resource via another global `User` method:

```js
getAddresses: function() {
  return client.get(resource.link('addresses'))
    .then(function (resources) {
      return _.map(resources.embedded('addresses'), function (resource) {
        return Address.fromResource(resource);
      });
    });
}
```

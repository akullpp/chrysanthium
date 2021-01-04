---
title: "Modern Lombok"
date: 2020-07-04
category: post
path: /modern-lombok
---

There are actually only a handful of Lombok annotations that are worth using in a modern Spring Boot application.

## Data transfer classes

For **requests**, **responses** and **DTOs** we should use `@Value` and `@Builder`:

```java
@Value
@Builder
public class Foo {

  String param1;
  String param2;
  String param3;
}
```

This makes the class immutable and forces MapStruct and Jackson to use the builder. The class members will be automatically `private final` so it even reduces cognitive complexity.

## Classes with dependency injection

Constructors for classes that use dependency injection should be omitted, instead you should make the members `private final` and use `@RequiredArgsConstructor`. Typically these are **services**, **repositories** and **controllers**:

```java
@Component
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = PRIVATE)
public class FooComponent {

  OtherComponent other;
}
```

Here we also introduce the experimental annotation `@FieldDefaults` and make the fields private and final which would be included otherwise in `@Value`.

## Classes with inheritance

When it comes to inheritance and immutability we need to be very specific with our annotations and cannot really use a composite annotation.

The parent needs to look like this:

```java
@Getter
@SuperBuilder
@FieldDefaults(makeFinal = true, level = PRIVATE)
public class Parent {

  String parent;
}
```

While the child looks like this:

```java
@Getter
@ToString
@SuperBuilder
@EqualsAndHashCode(callSuper = false)
@FieldDefaults(makeFinal = true, level = PRIVATE)
public class Child extends Parent {

  String child;
}
```

You have to actually need to decide individually if you want to include the super class into the equals and hash methods, so it either code be `callSuper = true` if you decide it is necessary.

## Misc

The final annotaion that is commonly used is `@Slf4j` which sets up a `log` variable for you to use.

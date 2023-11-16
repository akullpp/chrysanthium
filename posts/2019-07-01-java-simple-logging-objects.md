---
title: "Java: Simple Logging Objects"
date: 2019-07-01
tags: post
permalink: /java-simple-logging-objects
---

My favorite way to do traditional logging in Java is to utilize the simple class name which is often suitable for most reasonably complex cases, i.e. `class#getName` would additionally return the entire package path (e.g. `com.example.foo.Bar`) where as `class#getSimpleName` returns only the name of the class (e.g. `Bar`):

```java
private final Logger logger = LoggerFactory.getLogger(getClass().getSimpleName());
```

However if stuff becomes complex or you use different configuration depending on package identifiers you won't be able to do this but I think it is a good practice to start simple.

To log an object I like to overwrite the `toString` method with the `org.apache.commons.lang3.builder.ReflectionToStringBuilder`:

```java
@Override
public String toString() {
    return ReflectionToStringBuilder.toString(this);
}
```

It provides a nice initial setup in reasonable cases to evolve from but if you have a security manager or non-thread-safe classes it will fail and you will see performance issues.

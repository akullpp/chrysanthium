---
title: "Spring: Mock Environment"
date: 2019-06-06
category: post
path: /spring-mock-environment
---

What are you going to do if you want to switch profiles between individual tests and not use one set of profiles for the whole test suite?

You cannot use `@ActiveProfiles` on a method because it only works on on the target `TYPE`.

You cannot annotate `Environment` with `@MockBean` and mock the methods.

However, there is Spring's `MockEnvironment` annotation but it is not a bean. So how to initialize it gracefully so you can use CDI?

The answer is a simple implementation of `ApplicationContextInitializer` which allows us to inject `MockEnvironment` like any other bean:

```java
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.mock.env.MockEnvironment;

/**
 * Create a initializer for MockEnvironment so it can be autowired.
 *
 * Usage: @ContextConfiguration(initializers = {MockEnvironmentApplicationContextInitializer.class })
 */
public class MockEnvironmentApplicationContextInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

  @Override
  public void initialize(ConfigurableApplicationContext context) {
    MockEnvironment mockEnvironment = new MockEnvironment();
    mockEnvironment.merge(context.getEnvironment());

    context.setEnvironment(mockEnvironment);
  }
}
```

Now you are free to annotate `MockEnvironment` with `@Autowired` in all of your test classes and programmatically set the environment in each method to your liking.

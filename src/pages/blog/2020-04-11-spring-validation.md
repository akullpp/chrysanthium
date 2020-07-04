---
title: "Spring Validation"
date: 2020-04-11
category: post
path: /spring-validation
---

## Backend

### Persistence Level

The most important part is the **database schema validation** which must alway be reflected in the hibernate annotations of the entity. You have to do this validation with [bean validation](https://www.baeldung.com/javax-validation) annotations. Please find the concrete implementation details in the [hibernate validator documentation](https://docs.jboss.org/hibernate/stable/validator/reference/en-US/html_single/#validator-gettingstarted). It is also possible to create [custom annotation validations](https://www.baeldung.com/spring-mvc-custom-validator) which enable reuseability and readability. Here’s an example:

```sql
CREATE TABLE foo {
  id  BIGINT PRIMARY_KEY,
  bar TEXT NOT_NULL,
  baz BIGINT UNIQUE NOT_NULL
}
```

```java
@Entity
public class Foo {

  @Id
  @GeneratedValue(strategy = SEQUENCE)
  @Column(name = "id", updatable = false, nullable = false)
  private Long id;

  @NotBlank
  @Column(columnDefinition = "TEXT")
  private String bar;

  @NotNull
  @Column(unique = true)
  private Integer baz;
}
```

This is ensured by using the `ddl-auto: validate` property. The annotations `@Column(unique = true)` or `@UniqueConstraint` annotations do not validate, this is because these annotations only work when you create the database schema with the JPA provider. Nevertheless, it functions as documentation, so feel free to add it.

Obviously, these kind of errors are very serious and should not occur at runtime. Anyhow if they occur at runtime the exception should be mapped to an `500 INTERNAL_SERVER_ERROR` without any implementation internals revealed.

### Service Level

Since services can communicate with different consumers, e.g. HTTP, protocol buffers, messaging queues or even just other services they also need to ensure the validity of the input in a sensible way. So do not assume just you have validated something in a REST controller, that it does not have to be validated on the service.

Also unboxing can play an additional implicit role in validation, e.g.

```java
public void foo(long id, @Valid DTO dto)
```

Important here is that the errors thrown are generally service-level errors which should be remapped to controller-level error responses, typically via the global controller advices. It’s generally fine for service-level errors to be runtime exceptions that use technical keys, e.g. `DUPLICATE_USER` with additional - but not implementation or platform details - context provided to the consumer, e.g. provided parameters.

The service-level exceptions should always have a common base class:

```java
public class FooException extends RuntimeException {

    private final String key;

    public FooException(String key, String message) {
        super(message);
        this.key = key;
    }

    public getKey() {
      return this.key;
    }
}
```

which then can be extended for specific exceptions:

```java
public class FooNotFoundException extends FooException {

    public FooNotFoundException() {
        super("FOO_NOT_FOUND", "Foo could not be retrieved from database");
    }
}
```

### Side Note: Optional & Either

This concept plays well with the `Optional` type in Java, e.g. if you have the case where an entity is not found with a well-formed identifier, this is almost always no exception for the service therefore the implementation should follow the guidelines of Spring and return an `Optional<?>` to the caller which then can decide if it’s an error or not.

An additional great concept to pass exceptions to the caller without causing too much overhead is to use the **functional pattern of Either** described [here](https://www.ibm.com/developerworks/library/j-ft13/index.html), e.g.:

```java
public Either<Exception, Foo> parseFoo(@Valid Foo foo)
```

### Side Note: Logging

This is also the layer where typically the most logging is done, a good approach is to have the following statement at the top of the class:

```java
private final Logger logger = LoggerFactory.getLogger(getClass().getSimpleName());
```

It is important to utilize multiple levels of logging which means also to log happy path information for tracing/debugging purposes. A great way to log entire beans is utilizing org.apache.commons.lang3.builder.ReflectionToStringBuilder:

```java
@Override
public String toString() {
    return ReflectionToStringBuilder.toString(this);
}
```

## Controller Level

Response objects don’t need to be validated.

Request objects should always validate the expected form. Even if we have only one consumer currently, it is highly possible that we will provide the APIs to other, even third-party consumers. You can do this with the same `javax.validation` annotations, e.g.:

```java
public class FooRequest {

  @Email
  @NotBlank
  private String email;

  @Future
  @NotNull
  private ZonedDateTime sendAt;
}
```

The specific controller’s endpoint should look like this:

```java
public ResponseEntity<FooResponse> foo(@Valid @RequestBody FooRequest request)
```

It is worthy to note that while something may not be an error on the service-level, on controller-level it definitely may be so, e.g. the service might return an empty `Optional` if an entity is not found which then gets remapped:

```java
configService.saveConfig(config)
  .map(ResponseEntity::ok)
  .orElseThrow(BadRequestException::new);
```

### Controller Advice

All uncaught exceptions get handled centrally with a exception-specific controller advice. The advices itself have precedence, e.g. to handle a specific `FooException` which should be the base class for all other specific exceptions, e.g. a `FooNotFoundException`:

```java
@ControllerAdvice
@Order(HIGHEST_PRECEDENCE)
public class FooExceptionHandler {

  @ResponseBody
  @ResponseStatus(BAD_REQUEST)
  @ExceptionHandler(FooNotFoundException.class)
  private ExceptionResponse handleFooNotFoundException(FooNotFoundException e) {
    return new ExceptionResponse(e);
  }

  @ResponseBody
  @ExceptionHandler(FooException.class)
  private ExceptionResponse handleFooException(FooException e) {
    return new ExceptionResponse(e);
  }
```

Where the exception response should like this:

```java
public class ExceptionResponse {

  private final Logger log = LoggerFactory.getLogger(getClass().getSimpleName());

  UUID id;
  String key;
  String message;

  public ExceptionResponse(FooException exception) {
    this.id = UUID.randomUUID();
    this.key = exception.getKey();
    this.message = exception.getMessage();
    log.error("{} - {} - {}\n", id, key, message, exception.getCause());
  }
}
```

The context which needs to be logged or provided back to the user depends on the exception thrown, e.g. if there is a validation exception it should be indicated which field of the request was actually invalid and - if applicable - what form is expected. Important part is to be able to find the log fast by providing a unique identfier and in case of distributed systems an identifier of the caller.

All other exceptions at runtime that do not have explicit exception handlers should be handled by a general controller advice which is the last in the chain as indicated by precedence:

```java
@ControllerAdvice
@Priority(LOWEST_PRECEDENCE)
public class RuntimeExceptionHandler extends ResponseEntityExceptionHandler {

  @ResponseBody
  @ExceptionHandler(RuntimeException.class)
  private ExceptionResponse handleRuntimeException(RuntimeException e) {
    return new ExceptionResponse(e);
  }
}
```

## Frontend

Our applications should utilize validation primarily to ensure a good user experience which means that the **patterns used in frontend and backend need to be equal**. Generally, you want to provide immediate visual feedback to the user at the earliest point possible and run at least the same validations as the backend controllers.

A good validation pattern is the so called Facebook validation, i.e.:

1. Initially no validation is triggered, all fields are valid, untouched and the submit button is enabled.
2. If the submit button is pressed, all validations are triggered and validation messages are shown.
3. Entering a untouched field makes it dirty, which means validation is triggered on blur.

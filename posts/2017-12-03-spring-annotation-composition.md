---
title: 'Spring: Annotation Composition'
date: 2017-12-03
tags: post
path: /spring-annotation-composition
---

This article aims to show you how to combine several common annotations in Spring to reduce visual complexity and making your life simpler by the example of combining `@RestController` and `@RequestMapping`.

First we want to start with a small refresher about Java annotations in general which you can skip if you feel comfortable and [read the example](#composition).

## Refresher

Annotations contain metadata about the source code and can be identified by the `@` symbol followed by an uppercase letter. There are four build-in annotations `@Deprecated`, `@Override`, `@SuppressWarnings` and `@SafeVarargs`.

A minimal declaration of an annotation looks like:

```java
@Retention(/* Retention */)
@Target(/* Target */)
@interface Foo {}
```

and can't be generic or extend other interfaces.

The `RetentionPolicy` of the retention meta-annotation signals **when** the annotation is accessible and has three possible values:

| Type      | Availability         | Notes                           |
| --------- | -------------------- | ------------------------------- |
| `SOURCE`  | Pre-compilation      | Useful for build tools          |
| `CLASS`   | Before class loading | Useful for post-processing      |
| `RUNTIME` | Runtime              | Can be retrieved via reflection |

The `ElementType` of the target meta-annotation signals **where** the annotation can be used and has the values:

| Type              | Works on                                    |
| ----------------- | ------------------------------------------- |
| `ANNOTATION_TYPE` | Annotations                                 |
| `CONSTRUCTOR`     | Constructors                                |
| `FIELD`           | Fields and enum constants                   |
| `LOCAL_VARIABLE`  | Local variables; not readable at runtime    |
| `METHOD`          | Methods                                     |
| `PACKAGE`         | Package declarations in `package-info.java` |
| `PARAMETER`       | Parameters                                  |
| `TYPE`            | Classes, interfaces, annotations and enums  |

With Java 8 two we got the two very powerful targets `TYPE_PARAMETER` and `TYPE_USE` which allows the annotation of types as explained by [Michael Scharhag](https://www.mscharhag.com/java/java-8-type-annotations).

Annotations can have parameterless and non-generic methods which can only return primitives, enums, annotations, arrays, strings or classes. Another restriction is that they can't throw exceptions or recurse.

A convention is to call the only method of an annotation `value` which then can be omitted when the parameter is passed; therefore `@Foo(true)` is equivalent to `@Foo(value = true)`.

Arrays are passed as literal, e.g. `@Foo({"foo", "bar", "baz"})` and if there are multiple methods each parameter have to be identified explicitly, e.g. `@Foo(value = true, bar = "bar")`. It is also possible to define default values:

```java
@interface Foo {
  boolean value() default true;
}
```

With the `RetentionPolicy.RUNTIME` it's then possible to retrieve values via `Bar.class.getAnnotation(Foo.class).value();`.

The other build-in meta-annotations are `@Documented` to include it in Javadoc and `@Inherited` which signals that every subclass gets the annotation via inheritance.

## Composition

Spring in version 4.2 and later provides annotations like `@RestController` or `@GetMapping` to simplify configuration and to group behavior by composition. It's a powerful tool to reduce visual complexity but may also lead difficulties regarding reasoning and debugging so be careful how to use it and be sure to communicate it with your team.

The key element in Spring for composing annotations is the attribute alias annotation `@AliasFor` which aliases one attribute to another either explicitly or implicitly within a single annotation or in another meta-annotation. We won't look at implicit and transitive aliases since they are rather side-effects and you can [read about it](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/core/annotation/AliasFor.html) in the Javadoc for Spring.

Let's look at a common pattern in Spring and decide if we can simplify things a bit more. Often you see controllers that repeat the same boilerplate over and over:

```java
@RestController
@RequestMapping(
  path = "api/v1/foo",
  consumes = APPLICATION_JSON_VALUE,
  produces = APPLICATION_JSON_VALUE
)
public class FooController {

  @GetMapping
  public ResponseEntity<List<Foo>> getFoos() {
    // ...
  }
}
```

We immediately recognize that we already use the composed annotations as described before but we can do better and combine `@RestController` with `@RequestMapping`:

```java
@Target(TYPE)
@Retention(RUNTIME)
@Documented
@Controller
@ResponseBody
@RequestMapping
@CrossOrigin
public @interface ApiController {

    @AliasFor(annotation = RequestMapping.class, attribute = "path")
    String[] value() default {};
}
```

What we did was to start by unfolding the composed annotation of `@RestController` and annotating the new interface with the media types to avoid the repetition in each controller. Furthermore we alias the `path` parameter of `@RequestMapping`. In this case we created an explicit alias to shadow the `path` method by setting the target annotation and attribute.

If you inspect `@RequestMapping` you'll see that it uses an explicit alias within the annotation to alias `path` and `value` in order to clarify the semantics of the parameters:

```java
public @interface RequestMapping {
  @AliasFor("path")
  String[] value() default {};

  @AliasFor("value")
  String[] path() default {};
```

Here we can see that both methods must have the same shape, i.e return type and default value.

Unfortunately it's not possible to have multiple `@AliasFor` annotations so we can't express the semantics of `value` clearly in our custom annotation as far as I know. Another small but inconvenient restriction which you need to work around is that you can't have aliases for value attributes in `@Qualifier` and in stereotype annotations.

Our controller with the new annotation looks like:

```java
@ApiController("api/v1/foo")
public class FooController {
  // ...
}
```

We actually have three benefits now:

1. Reduced visual complexity
2. A custom annotation for hooks
3. The possibility to further reduce complexity by adding more meta-information

Often you use annotations to signal custom behavior, e.g. you don't want to expose every controller to the public via Swagger:

```java
@Configuration
@EnableSwagger2
public class SwaggerConfiguration {

  @Bean
  public Docket api() {
    return new Docket(DocumentationType.SWAGGER_2)
      .select()
      .apis(RequestHandlerSelectors.withClassAnnotation(
        ApiController.class
      ))
      .paths(PathSelectors.any())
      .build();
  }
}
```

This restriction tells Swagger only to document APIs annotated with `@ApiController`.

You can now write much simpler logic to reduce the complexity further, e.g. sometimes you see people subclassing an abstract controller class to prefix the path. This is actually not a good idea since you can't compose multiple path segments any further and will lose a lot of flexibility. Let's solve this issue and also version our API by adding another meta-information in our custom annotation:

```java
String version() default "v1";
```

We now can now read the value with a simple configuration bean:

```java
@Configuration
public class ApiConfiguration {

  @Bean
  public WebMvcRegistrationsAdapter webMvcRegistrationsHandlerMapping() {
    return new WebMvcRegistrationsAdapter() {
      @Override
      public RequestMappingHandlerMapping getRequestMappingHandlerMapping() {
        return new RequestMappingHandlerMapping() {
          private static final String API_BASE_PATH = "api";

          @Override
          protected void registerHandlerMethod(
            Object handler,
            Method method,
            RequestMappingInfo mapping
          ) {
            Class<?> beanType = method.getDeclaringClass();

            ApiController annotation = AnnotationUtils
              .findAnnotation(beanType, ApiController.class);
            if (annotation != null) {
              PatternsRequestCondition apiPattern = new PatternsRequestCondition(
                API_BASE_PATH + "/" + annotation.version()
              ).combine(mapping.getPatternsCondition());

              mapping = new RequestMappingInfo(
                mapping.getName(),
                apiPattern,
                mapping.getMethodsCondition(),
                mapping.getParamsCondition(),
                mapping.getHeadersCondition(),
                mapping.getConsumesCondition(),
                mapping.getProducesCondition(),
                mapping.getCustomCondition()
              );
            }
            super.registerHandlerMethod(handler, method, mapping);
          }
        };
      }
    };
  }
}
```

This automatically prefixes every path with `api` and the version which allows us to simplify the path parameter:

```java
@ApiController("foo")
public class FooController {
  // ...
}
```

In the future we can version our API with the explicit parameter:

```java
@ApiController(value = "foo", version = "v2")
public class FooController {
  // ...
}
```

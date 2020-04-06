---
title: "Spring: MapStruct & Lombok"
date: 2019-09-01
category: post
path: /spring-mapstruct-lombok
---

Every time I setup a new Spring project which requires object mapping MapStruct is the library of choice since it is de facto [the fastest and most versatile around](https://www.baeldung.com/java-performance-mapping-frameworks). But no matter what, I always have a hard time to configure MapStruct to work with Lombok and Spring's dependency injection. There are many outdated resources, so here is the current way to do it right:

## Dependencies

```xml
<dependency>
  <groupId>org.mapstruct</groupId>
  <artifactId>mapstruct</artifactId>
  <version>${mapstruct.version}</version>
</dependency>
```

Many tutorials include `mapstruct-jdk8` which is wrong because you do not need it anymore.

```xml
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
  <version>${lombok.version}</version>
  <optional>true</optional>
</dependency>
```

This should come with Spring Initializr and is self-explanatory.

## Build

The most important part is to make the annotation processors work together by using the `maven-compiler-plugin`:

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-compiler-plugin</artifactId>
  <version>${maven-compiler-plugin.version}</version>
  <configuration>
    <source>${java.version}</source>
    <target>${java.version}</target>
    <annotationProcessorPaths>
      <path>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>${lombok.version}</version>
      </path>
      <path>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-processor</artifactId>
        <version>${mapstruct.version}</version>
      </path>
    </annotationProcessorPaths>
    <compilerArgs>
      <arg>-Amapstruct.suppressGeneratorTimestamp=true</arg>
      <arg>-Amapstruct.defaultComponentModel=spring</arg>
    </compilerArgs>
  </configuration>
</plugin>
```

Or if you use Gradle:

```groovy
compileJava {
  options.compilerArgs << "-Amapstruct.defaultComponentModel=spring"
}
```

This enables Lombok's processing before MapStruct's and instructs it to use the Spring component model for dependency injection.

## Code

Now we can annotate our classes with `@RequiredArgsConstructor` and/or `@Data` and implement the mapper like this:

```java
@Mapper
public interface FooMapper {

    Foo toFoo(Bar bar);

    List<Foo> toFoos(List<Bar> bars);
}

```

The dependency injection works out of the box, no need to construct an instance manually like so many tutorials say:

```java
@Service
@RequiredArgsConstructor
public class FooService {

    private final FooMapper fooMapper;
}
```

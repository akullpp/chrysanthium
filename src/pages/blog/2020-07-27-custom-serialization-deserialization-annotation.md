---
title: "Custom Serialization and Deserialization by Annotation"
date: 2020-07-27
category: post
path: /custom-serialization-deserialization-annotation
---

The typical use case where you want to (de-)serialize some field in a request/response is when you map to a graphical user id.

Things are rather easy if you just want to map from A to B but become more complicated if you need to pass an argument, e.g. for a SALT:

```java
@Guid(FOO_SALT)
Long id;
```

Fortunately, there is a way of writing a clean meta-annotation for this:

```java
@Target({FIELD, PARAMETER})
@Retention(RUNTIME)
@JacksonAnnotationsInside
@JsonSerialize(using = ResponseSerializer.class)
@JsonDeserialize(using = RequestDeserializer.class)
public @interface Guid {

    String value();
}
```

In my case I use the [hashids library](https://github.com/10cella/hashids-java) with a certain SALT for de-/encoding GUIDs:

```java
public class HashId {

    public static String encode(Long id, String salt) {
        // ...
    }

    public static Long decode(String guid, String salt) {
        // ...
    }
}
```

With the `@Guid` annotation I can trigger the deserialization on fields processed by Jackson like this:

```java
public class RequestDeserializer extends StdDeserializer<Long> implements ContextualDeserializer {

    private String value;

    public RequestDeserializer() {
        super(Long.class);
    }

    public RequestDeserializer(String value) {
        super(Long.class);
        this.value = value;
    }

    @Override
    public Long deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        return HashId.decode(p.getText(), this.value);
    }

    @Override
    public JsonDeserializer<?> createContextual(DeserializationContext ctxt, BeanProperty property) {
        String value = null;
        Salt annotation = null;

        if (property != null) {
            annotation = property.getAnnotation(Guid.class);
        }
        if (annotation != null) {
            value = annotation.value();
        }
        return new RequestDeserializer(value);
    }
}
```

And the serialization on fields processed by Jackson like this:

```java
public class ResponseSerializer extends StdSerializer<Long> implements ContextualSerializer {

    private String value;

    public ResponseSerializer() {
        super(Long.class);
    }

    public ResponseSerializer(String value) {
        super(Long.class);
        this.value = value;
    }

    @Override
    public void serialize(Long value, JsonGenerator generator, SerializerProvider provider) throws IOException {
        generator.writeString(HashId.encode(value, this.value));
    }

    @Override
    public JsonSerializer<?> createContextual(SerializerProvider provider, BeanProperty property) {
        String value = null;
        Salt annotation = null;

        if (property != null) {
            annotation = property.getAnnotation(Guid.class);
        }
        if (annotation != null) {
            value = annotation.value();
        }
        return new ResponseSerializer(value);
    }
}
```

Plus I can use it on path variables to automatically decode them with Spring's argument resolver:

```java
@EnableWebMvc
@Configuration
public class WebMvc implements WebMvcConfigurer {

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new DecodeArgument());
    }
}
```

```java
public class DecodeArgument extends PathVariableMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(Guid.class);
    }

    @Override
    protected NamedValueInfo createNamedValueInfo(MethodParameter parameter) {
        return new NamedValueInfo("", false, null);
    }

    @Override
    protected Object resolveName(String name, MethodParameter parameter, NativeWebRequest request) throws Exception {
        var value = super.resolveName(name, parameter, request);
        var annotation = parameter.getParameterAnnotation(Guid.class);

        if (value != null && annotation != null) {
            return HashId.decode((String) value, annotation.value());
        }
        throw new HashIdException("Annotation doesn't specify SALT");
    }
}
```

Which makes the following code work automatically:

```java
@GetMapping("{fooId}")
public ResponseEntity<FooResponse> getFoo(@Guid(FOO_SALT) Long fooId) {
    // ...
}
```

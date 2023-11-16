---
title: "Raw JSON Serialization and Deserialization"
date: 2020-08-22
tags: post
permalink: /raw-json-serialization-deserialization
---

The following allows to serialize JSON to a string:

```java
public class RawJsonDeserializer extends JsonDeserializer<String> {

    @Override
    public String deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        JsonNode node = p.getCodec().readTree(p);
        return node.toString();
    }
}
```

And deserialize back from string to JSON:

```java
public class RawJsonSerializer extends JsonSerializer<String> {

    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeRawValue(value);
    }
}
```

The usage looks like this:

```java
@JsonSerialize(using = RawJsonSerializer.class)
```

or respectively:

```java
@JsonDeserialize(using = RawJsonDeserializer.class)
```

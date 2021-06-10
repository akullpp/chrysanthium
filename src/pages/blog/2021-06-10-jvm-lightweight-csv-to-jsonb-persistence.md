---
title: "JVM: Lightweight CSV to JSONB persistence"
date: 2021-06-10
category: post
path: /jvm-lightweight-csv-to-jsonb-persistence
---

Python has become the de facto language for data processing since it has easy to use and provides popular libraries like pandas. However, Excel or CSV processing can also be done by JVM languages in a concise and efficient manner.

We will look at a minimal use case that consists of uploading a CSV file, converting it to JSONB and persisting it in just a few lines of code. This approach is perfect for fast-moving targets, i.e. when you can't estimate future changes and have to be flexible.

For such a lightweight task, we recommend the following tools:

- [FastCSV](https://github.com/osiegmar/FastCSV)
- [JDBI](https://jdbi.org/)

Although you can use any JVM language and this particular example utilizes Kotlin.

## DB

With the declarative approach of JDBI you will write your own SQL statements which allows for a maximum of flexibility and control. It requires some time to get used to if you relied too heavily on JPA in the past, but being comfortable with SQL is one of the essential skills you will need in your career.

```kotlin
interface Repository {

    @Transaction
    @SqlUpdate("CREATE TABLE IF NOT EXISTS foo(data JSONB)")
    fun init()

    @Transaction
    @SqlUpdate(
        """
        DELETE FROM foo WHERE data -> 'id' = to_jsonb(:id);
        INSERT INTO foo(data) VALUES(:data);
        """
    )
    fun save(@Json data: Foo)
}
```

We need two methods:

- `init` to create the table if it doesn't exist, because we want maximum flexibility and don't want to maintain migrations in this phase
- `save` which conveniently overwrites an existing record based on an identifier

The statements are self-explanatory and follow the [PostgreSQL JSONB syntax](https://www.postgresql.org/docs/9.4/functions-json.html).

## API

So we want to keep this lightweight which means no model, service or additional layers. Especially no mappings to and from DTOs. Therefore, we should only have one additional class on top of the repository to save and retrieve data. Let us take a typical Spring REST controller and add a POST method to upload the CSV:

```kotlin
typealias Foo = MutableMap<String, String>

@RestController
class Api(private val jdbi: Jdbi) {
    @EventListener(ApplicationReadyEvent::class)
    fun init() = jdbi.useExtensionUnchecked(
      Repository::class,
      Repository::init
    )

    @PostMapping
    fun upload(@@RequestParam file: MultipartFile) {
        val rows = NamedCsvReader.builder()
          .build(file.inputStream.bufferedReader())
          .map { it.fields }

        return jdbi.useExtensionUnchecked(Repository::class) {
          it.save(rows)
        }
    }
```

Since we don't rely on migrations we are going to create the table on application start, if you do not use Spring you can also go with Kotlin's `init` object.

If you have a row with header's you should use the `NamedCsvReader` otherwise the `CsvReader` is fine. FastCSV automatically parses the CSV into a `Map<String, String>` and JDBI will serialize it via Jackson. For convenience we use a typealias for this datastructure. Although you can also use Jackson to parse the CSV, we recommend FastCSV since you will have a better time extending the code with validation logic and common CSV options.

## Addendum

If you tried the example you might need some additional configuration to make JDBI work with Kotlin, the following dependencies are recommended:

```kotlin
object Versions {
    const val jdbi = "3.20.0"
    const val fastcsv = "2.0.0"
    const val jacksonJsr310 = "2.12.3"
}

// Kotlin
implementation("org.jetbrains.kotlin:kotlin-reflect")
implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")

// Jackson
implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:${Versions.jacksonJsr310}")

// DB
implementation("org.jdbi:jdbi3-kotlin:${Versions.jdbi")
implementation("org.jdbi:jdbi3-kotlin-sqlobject:${Versions.jdbi}")
implementation("org.jdbi:jdbi3-jackson2:${Versions.jdbi}")
implementation("org.jdbi:jdbi3-postgres:${Versions.jdbi}")

// Misc
implementation("de.siegmar:fastcsv:${Versions.fastcsv}")
```

To make this all work in harmony, you'll need following configuration:

```kotlin
@Configuration
class Configuration {

    @Bean
    fun jdbi(dataSource: DataSource): Jdbi {
        val jdbi = Jdbi.create(dataSource).installPlugins()
        // Take Jackson's Kotlin version
        val mapper = jacksonObjectMapper()
        // Add Java 8 time
        mapper.registerModule(JavaTimeModule())
        // Register custom Jackson mapper
        jdbi.getConfig(Jackson2Config::class.java).mapper = mapper
        return jdbi
    }
}
```

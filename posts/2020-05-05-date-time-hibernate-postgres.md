---
title: "Date & Time with Hibernate and Postgres"
date: 2020-05-05
tags: post
permalink: /date-time-hibernate-postgres
---

The Java 8 Date & Time API provides the following new classes which in contrast to `Date` and `Calendar` are immutable and thread-safe:

- Instant – represents a point in time (timestamp)
- **LocalDate** – represents a date (year, month, day)
- **LocalDateTime** – same as LocalDate, but includes time with nanosecond precision
- OffsetDateTime – same as LocalDateTime, but with time zone offset
- **LocalTime** – time with nanosecond precision and without date information
- OffsetLocalTime – same as LocalTime, but with time zone offset
- ZonedDateTime – same as OffsetDateTime, but includes a time zone ID
- MonthDay – month and day, without year or time
- YearMonth – month and year, without day or time
- Duration – amount of time represented in seconds, minutes and hours. Has nanosecond precision
- Period – amount of time represented in days, months and years

The ones in bold are pretty safe and easy to use with Hibernate and PostgreSQL. You should primary use them if you don't know where to start. Otherwise you might need to create your own convertors or rely on Hibernate’s conversion features which are proprietary since PostgreSQL doesn’t store `Instant`, `ZonedDateTime` and `OffsetTime`.

In regard to timezone it’s safer if you use the just use the `Offset*` versions of the bold classes.

Here's the conversion table for Java/SQL:

| Java           | SQL                     |
| -------------- | ----------------------- |
| LocalDate      | DATE                    |
| LocalTime      | TIME                    |
| LocalDateTime  | TIMESTAMP               |
| OffsetTime     | TIME_WITH_TIMEZONE      |
| OffsetDateTime | TIMESTAMP_WITH_TIMEZONE |
| Duration       | BIGINT                  |
| Instant        | TIMESTAMP               |
| ZonedDateTime  | TIMESTAMP               |

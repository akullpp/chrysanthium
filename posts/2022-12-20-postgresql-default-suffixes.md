---
title: "PostgreSQL default suffixes"
date: 2022-12-20
tags: post
permalink: /postgresql-default-suffixes
---

The standard names for indexes in PostgreSQL are

```text
{tablename}_{columnnames}_{suffix}
```

where the suffix is one of the following:

- `pkey` for a Primary Key constraint
- `key` for a Unique constraint
- `excl` for an Exclusion constraint
- `idx` for any other kind of index
- `fkey` for a Foreign key
- `check` for a Check constraint
- `seq` for all sequences

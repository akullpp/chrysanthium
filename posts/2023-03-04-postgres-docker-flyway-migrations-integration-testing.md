---
title: 'Postgres Docker image with Flyway migrations for integration testing'
date: 2023-03-04
lastModified: 2023-11-15
permalink: /postgres-docker-flyway-migrations-integration-testing
---

Here's how you set up a Docker image of a PostgreSQL database with migrations (and possibly test data) applied by Flyway - often for integration testing.

---

[Source on GitHub](https://github.com/akullpp/postgres-docker-flyway-migrations-integration-testing)

---

Assume following folder structure:

```txt
sql/
  V1__foo.sql
  V2__bar.sql
  V3__baz.sql
20_flyway.sh
Dockerfile
flyway.conf
```

Ensure to do a `sudo chmod a+x 20_flyway.sh`. The content of the shell script:

```bash
#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

flyway -jdbcProperties.socketFactory='org.newsclub.net.unix.AFUNIXSocketFactory$FactoryArg' -jdbcProperties.socketFactoryArg=/var/run/postgresql/.s.PGSQL.5432 -jdbcProperties.sslMode=disable migrate
```

Order of things are important, don't try to change anything.

We must switch out the class responsible for connecting to Postgres because during startup of the temporary database **only unix sockets** and no TCP is available. For this purpose we will later download a specific driver.

The `flyway.conf` I'm going to use is unspectacular:

```ini
flyway.locations=filesystem:sql
flyway.url=jdbc:postgresql://:5432/platform
flyway.password=admin
flyway.user=admin
flyway.connectRetries=60
```

And finally the `Dockerfile`:

```docker
# I'll use PostGIS as base image but you can also do this with the official one.
FROM postgis/postgis:13-master

# We download Flyway and install it, nothing special.
ADD https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/9.15.0/flyway-commandline-9.15.0-linux-x64.tar.gz /flyway.tar.gz
RUN tar xvf /flyway.tar.gz
RUN mv flyway-9.15.0 flyway
RUN chmod +x /flyway/flyway
RUN ln -s /flyway/flyway /usr/local/bin/flyway

# We download the driver for unix sockets and place it in Flyway's driver folder.
ADD https://github.com/kohlschutter/junixsocket/releases/download/junixsocket-2.6.2/junixsocket-dist-2.6.2-bin.tar.gz /junixsocket.tar.gz
RUN tar xvf /junixsocket.tar.gz
RUN mv /junixsocket-dist-2.6.2/lib/junixsocket-common-2.6.2.jar /flyway/drivers/junixsocket-common-2.6.2.jar
RUN mv /junixsocket-dist-2.6.2/lib/junixsocket-native-common-2.6.2.jar /flyway/drivers/junixsocket-native-common-2.6.2.jar

# We copy the script to the `docker-entrypoint-initdb.d`.
# Shell scripts in this folder will get executed on startup.
# Do mind the integer prefix of the file if order is important.
# I prefixed it with `20` because PostGIS uses `10` and my SQL relies on it.
COPY 20_flyway.sh /docker-entrypoint-initdb.d/20_flyway.sh
RUN chmod +x /docker-entrypoint-initdb.d/20_flyway.sh

# Copy Flyway configuration
COPY flyway.conf /flyway.conf

# Copy SQL files
COPY sql /sql
```

For building and running nothing special is required:

```shell
docker build . -t foobar
docker run -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=platform -p 5432:5432 foobar
```

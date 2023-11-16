---
title: "Multiple SQL Load Scripts"
date: 2014-06-12
tags: post
permalink: /multiple-sql-load-scripts
---

SQL files can get extremely large and therefore are very difficult to maintain. In the projects I work, we tend to do database-driven localization for example, so you can imagine the amount of SQL statements.

Normally, you specify the load script for the drop-and-create goal in the persistence.xml with:

```xml
<property name="javax.persistence.sql-load-script-source" value="${sql.directory}"/>
```

Where `${sql.directory}` is substituted by Maven for a specific profile:

```xml
<profile>
  <id>local.rebuildDB</id>
  <properties>
    <sql.directory>META-INF/sql/masterdata.sql</sql.directory>
  </properties>
</profile>
```

Unfortunately, you cannot specify just a folder which contains multiple SQL files but have to point to a single SQL.

So how can we split the `masterdata.sql` into several mutliple SQL files?

We concatenate multiple smaller sql files to one large sql files, which will get executed if the specific profile is selected.

How do we do this?

With a specific maven plugin, namely [org.zcore.maven - merge-maven-plugin](https://github.com/rob19780114/merge-maven-plugin)

I suggest that you add add the plugin to your specific build profile and not globally since the downside to this approach is the increased build time due to the merge:

```xml
<profile>
  <id>local.rebuildDB</id>
  <properties>
    <sql.directory>META-INF/sql/masterdata.sql</sql.directory>
  </properties>
  <build>
    <plugins>
      <plugin>
        <groupId>org.zcore.maven</groupId>
        <artifactId>merge-maven-plugin</artifactId>
        <version>0.0.3</version>
        <executions>
          <execution>
            <goals>
              <goal>merge</goal>
            </goals>
          <phase>compile</phase>
          </execution>
        </executions>
        <configuration>
          <mergers>
            <merger>
              <target>src/main/resources/sql/masterdata.sql</target>
              <sources>
                <source>src/main/resources/sql/initialize/a.sql</source>
                <source>src/main/resources/sql/initialize/b.sql</source>
                <source>src/main/resources/sql/initialize/c.sql</source>
              </sources>
            </merger>
          </mergers>
        </configuration>
      </plugin>
    </plugins>
  </build>
</profile>
```

The important part is the location of the single combined file which is indicated with `<target></target>` and must reflect the file as specified with `${sql.directory}`. This example shows a web application which will move all the resources to `META-INF`.

Finally, you specify the source files which will be merged by `<source></source>`. In this example we specify each SQL file explicitly since order sometimes matter.

---
title: 'Extract WordPress Posts from SQL'
date: 2014-12-18
tags: post
path: /extract-wordpress-posts-from-sql
---

I decided that I didn't need a WordPress blog with SQL database and switched to GitHub pages and Jekyll. Unfortunately, my blog was already down and I only had the SQL backup file left. So here's how you extract WordPress posts from a SQL backup.

Step 1: Import SQL backup:

```
mysql -u root wp_dump < backup.sql
```

Step 2: Login:

```
mysql -u root
```

Step 3: Use database:

```
use wp_dump;
```

Step 4 (optional): Show tables:

```
show tables;
```

Step 5 (optional): Show columns in post table:

```
show columns from wp_posts;
```

Step 6: Extract title, date and content of all published posts into an external file:

```
select post_title, post_date, post_content from wp_posts
where post_status like "publish"
into outfile "~/export.txt"
fields terminated by "\n+++++++++++++++++++++++++++++\n"
escaped by "";
```

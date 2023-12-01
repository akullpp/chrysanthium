---
title: 'Conditional Git Configs'
date: 2023-11-21
path: /conditional-git-configs
---

Often you need a different a `user.email` for work and personal projects. You can use a conditional include to set attributes based on the current working directory.

Example:

`~/.gitconfig`

```ini
[user]
  name = John Doe
  email = john.doe@personal.com
[includeIf "gitdir/i:~/work/"]
  path = ~/work/.gitconfig
```

`~/work/.gitconfig`

```ini
[user]
  email = john.doe@work.com
```

Navigate to a Git repository inside `~/work` and run:

```sh
git config -l
```

You will see the following if you did it correctly:

```ini
user.name=John Doe
user.email=john.doe@work.com
includeif.gitdir/i:~/work/.path=~/work/.gitconfig
user.email=john.doe@work.com
```

Last one wins.

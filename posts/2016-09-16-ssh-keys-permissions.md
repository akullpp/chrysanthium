---
title: 'SSH Keys and their permissions'
date: 2016-09-16
tags: post
path: /ssh-keys-permissions
---

TL;DR

```sh
chmod 600 ~/.ssh/private_key
```

Somehow the default permissions of new public and private SSH keys on OS X are `0644` which is not only bad idea but won't allow you to push stuff. So, how do you fix it?

You probably generated your key with `ssh-keygen` and now you want to push some stuff which results in this beautiful error message:

```sh
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for '/Users/akull/.ssh/id_rsa_bar.pub' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "/Users/akull/.ssh/id_rsa_bar.pub": bad permissions
Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

The quick fix is to set the permissions to `600` for the private key:

```sh
chmod 600 ~/.ssh/id_rsa_bar
```

Sometimes you even need to add if it's not yet known:

```sh
ssh-add -K ~/.ssh/id_rsa_bar
```

If this won't help, you should try to generate a new key first and then repeat the steps:

```sh
ssh-keygen -y -f ~/.ssh/id_rsa_bar > ~/.ssh/id_rsa_bar.pub
```

## Bonus

If you need to set the key only for a specific host, create a `~/.ssh/config` file with the following content:

```sh
Host foo.bar.baz
RSAAuthentication yes
IdentityFile ~/.ssh/id_rsa_bar.pub
```

---
title: "Java: Generate Secure Random String"
date: 2019-08-04
category: post
path: /java-generate-secure-random-string
---

One neat little exercise is to generate a relatively random strings with a specific amount of certain characters. Of course you could use an Apache library for this but I think it is simple enough to do it yourself.

First of all you need to define the token set:

```java
private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
private static final String NUMBERS = "0123456789";
// https://www.owasp.org/index.php/Password_special_characters
private static final String SPECIAL = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
private static final String ALL = UPPERCASE + LOWERCASE + NUMBERS + SPECIAL;
```

To select random tokens from the sets we will use the `SecureRandom` implementation as it is a cryptographically strong random number generator:

```java
private static final SecureRandom random = new SecureRandom();
```

Then we actually select the specified amount of random tokens from a single set:

```java
private static String selectRandomTokens(int n, String tokens) {
    StringBuilder randomTokens = new StringBuilder();

    for (int i = 0; i < n; i++) {
        randomTokens.append(tokens.charAt(random.nextInt(tokens.length())));
    }
    return randomTokens.toString();
}
```

The API method could look like the following, providing parameters to define a minimum of tokens for each set and a maximum length:

```java
public static String generate(int nUppercase, int nLowercase, int nNumbers, int nSpecial, int maxlength) {
    int fill = maxlength - (nUppercase + nLowercase + nNumbers + nSpecial);
    if (fill < 0) {
        throw new IllegalArgumentException();
    }
    return shuffle(
        selectRandomTokens(nUppercase, UPPERCASE)
            + selectRandomTokens(nLowercase, LOWERCASE)
            + selectRandomTokens(nNumbers, NUMBERS)
            + selectRandomTokens(nSpecial, SPECIAL)
            + selectRandomTokens(fill, ALL)
    );
}
```

Finally we provide the method to shuffle the entire string:

```java
private static String shuffle(String s) {
    List<String> tokens = Arrays.asList(s.split(""));
    Collections.shuffle(tokens);
    return String.join("", tokens);
}
```

The entire code can be found on [GitHub](https://github.com/akullpp/random/blob/master/src/de/akull/random/RandomString.java).

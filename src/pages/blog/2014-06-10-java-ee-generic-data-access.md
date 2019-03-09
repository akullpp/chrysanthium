---
title: 'Java EE: Generic Data Access'
date: 2014-06-10
category: post
path: /java-ee-generic-data-access
---

Here's a simple yet practical generic approach for accessing and storing data in your enterprise model.

First we define the conceptual abstraction of a specific service which access the data in our persistence layer:

```java
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

public class DataAccessService<T extends AbstractEntity> {
    @PersistenceContext
    protected EntityManager em;
    private final Class<T> type;

    protected DataAccessService(Class<T> type) {
        this.type = type;
    }
}
```

We keep the type generic since we do want to implement the specifics in separate services, for example:

```java
import javax.ejb.Stateless;

@Stateless
public class SpecificService extends DataAccessService<SpecificEntity> {

    public SpecificService() {
        super(SpecificEntity.class);
    }
}
```

To have generics in our abstract service, we need each specific entity to be a concrete implementation of an abstract entity that bundles common attributes and methods of all entities, for example:

```java
import java.io.Serializable;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class AbstractEntity implements Serializable, Comparable<AbstractEntity> {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    // hashCode
    // equals
    // toString
    // getId
    // setId
}
```

With the a specific entity implementation example:

```java
import javax.persistence.Entity;

@Entity
public class SpecificEntity extends AbstractEntity {
    // Fields and methods
}
```

Now that we are set up, we can implement a more abstract approach to [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) in our `DataAccessService`.

## Create/Update

```java
public T save(T t) {
    if (t.getId() == null || t.getId() == 0) {
        em.persist(t);
    }
    else {
        em.merge(t);
    }
    return t;
}
```

## Read

```java
public T find(Object id) {
    return this.em.find(this.type, id);
}

public List<T> findWithNamedQuery(String namedQuery) {
    return this.em.createNamedQuery(namedQuery, this.type).getResultList();
}

public List<T> findWithNamedQuery(String namedQuery, HashMap<String, Object> params) {
    TypedQuery query = em.createNamedQuery(namedQuery, this.type);

    for (Map.Entry e : params.entrySet()) {
        query.setParameter((String) e.getKey(), e.getValue());
    }
    return query.getResultList();
}
```

## Delete

```java
public void remove(T t) {
    if (em.contains(t)) {
        em.remove(t);
    }
    else {
        em.remove(em.merge(t));
    }
}
```

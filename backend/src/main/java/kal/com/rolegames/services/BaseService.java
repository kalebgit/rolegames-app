package kal.com.rolegames.services;

import java.util.List;
import java.util.Optional;

public interface BaseService<E, ID> {

    List<E> findAll();

    Optional<E> findById(ID id);

    E save(E entity);

    E update(E entity);

    void deleteById(ID id);

    boolean existsById(ID id);
}
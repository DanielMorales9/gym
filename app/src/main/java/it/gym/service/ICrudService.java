package it.gym.service;

import java.util.List;

public interface ICrudService<T, ID> {

//    List<T> findAll();

//    <S extends T> List<S> saveAll(Iterable<S> var1);

    T save(T var1);

    T findById(ID var1);

    void delete(T var1);

    List<T> findAll();

//    boolean existsById(ID var1);


//    Iterable<T> findAllById(Iterable<ID> var1);

//    long count();

//    void deleteById(ID var1);

//    void deleteAll(Iterable<? extends T> var1);

//    void deleteAll();


}

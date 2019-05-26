package it.gym.service;

import java.util.List;

public interface ICrudService<T, I> {

//    List<T> findAll();

//    <S extends T> List<S> saveAll(Iterable<S> var1);

    T save(T var1);

    T findById(I var1);

    void delete(T var1);

    List<T> findAll();

//    boolean existsById(I var1);


//    Iterable<T> findAllById(Iterable<I> var1);

//    long count();

//    void deleteSaleById(I var1);

//    void deleteAll(Iterable<? extends T> var1);

//    void deleteAll();


}

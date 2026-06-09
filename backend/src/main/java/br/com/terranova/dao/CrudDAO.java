package br.com.terranova.dao;

import java.util.List;
import java.util.Optional;

public interface CrudDAO<T> {

    List<T> listar();

    Optional<T> buscarPorId(Long id);

    T inserir(T entidade);

    T atualizar(T entidade);

    boolean deletar(Long id);
}

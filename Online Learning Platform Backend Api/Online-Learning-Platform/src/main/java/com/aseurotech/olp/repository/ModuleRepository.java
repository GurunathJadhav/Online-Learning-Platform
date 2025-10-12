package com.aseurotech.olp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aseurotech.olp.entity.Module;

public interface ModuleRepository extends JpaRepository<Module, Long> {

	Optional<Module> findByIdAndCourseId(long moduleId, long id);

}

package pl.herring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.herring.model.TaskGroup;

public interface TaskGroupRepository extends JpaRepository<TaskGroup, Long> {
}

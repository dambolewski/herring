package pl.herring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.herring.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
}

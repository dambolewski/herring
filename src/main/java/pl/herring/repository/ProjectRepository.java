package pl.herring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.herring.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Project findByTitle(String title);
    Project findByUuid(String uuid);
}

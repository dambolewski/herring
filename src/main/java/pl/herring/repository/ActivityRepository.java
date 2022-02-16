package pl.herring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.herring.model.Activity;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
}

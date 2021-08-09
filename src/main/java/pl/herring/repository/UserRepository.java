package pl.herring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.herring.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
}

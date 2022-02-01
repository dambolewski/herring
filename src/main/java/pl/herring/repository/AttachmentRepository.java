package pl.herring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.herring.model.Attachment;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    Attachment findByUrl (String url);
}

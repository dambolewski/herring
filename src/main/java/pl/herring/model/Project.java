package pl.herring.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import java.util.ArrayList;
import java.util.Collection;

import static javax.persistence.GenerationType.AUTO;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = AUTO)
    private Long id;
    private String title;
    @ManyToMany(fetch = FetchType.EAGER)
    private Collection<User> users = new ArrayList<>();
}

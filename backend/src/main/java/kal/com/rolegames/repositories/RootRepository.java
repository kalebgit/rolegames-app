package kal.com.rolegames.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface RootRepository<T, ID> extends JpaRepository<T, ID> {

}

package pl.herring.enumeration;

import static pl.herring.constant.Authority.*;

public enum Role {
    ROLE_USER(USER_AUTHORITIES),
    HR_USER(HR_AUTHORITIES),
    MANAGER_USER(MANAGER_AUTHORITIES),
    ADMIN_USER(ADMIN_AUTHORITIES),
    SUPER_ADMIN_USER(SUPER_ADMIN_AUTHORITIES);

    private final String[] authorities;

    Role(String... authorities) {
        this.authorities = authorities;
    }

    public String[] getAuthorities() {
        return authorities;
    }
}

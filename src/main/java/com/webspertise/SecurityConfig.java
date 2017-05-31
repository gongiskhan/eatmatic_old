package com.webspertise;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import static com.stormpath.spring.config.StormpathWebSecurityConfigurer.stormpath;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable().authorizeRequests().antMatchers("/*").permitAll();
        //http.authorizeRequests().antMatchers("/admin.html").hasAuthority("https://api.stormpath.com/v1/groups/52cd0TkZDptZNLOsjJV3LQ").and().apply(stormpath());
        /*
        http.headers().frameOptions().disable();
        http.csrf().disable().authorizeRequests()
            .antMatchers("/user", "/role", "/permissions")
            .authenticated()
            .and()
            .authorizeRequests()
            .antMatchers("/*").permitAll();
            */
    }
}
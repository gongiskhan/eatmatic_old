package com.webspertise;

import com.webspertise.filter.CorsFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import java.util.Locale;

/**
 * Created by ggomes on 13-09-2016.
 */
@Configuration
@Import(value = {SecurityConfig.class})
public class SpringConfig {

    @Bean
    public LocaleResolver localeResolver() {

        CookieLocaleResolver slr = new CookieLocaleResolver();
        slr.setDefaultLocale(Locale.forLanguageTag("pt"));
        return slr;
    }

    @Bean
    public ResourceBundleMessageSource messageSource() {
        ResourceBundleMessageSource source = new ResourceBundleMessageSource();
        source.setBasenames("messages");  // name of the resource bundle
        source.setUseCodeAsDefaultMessage(true);
        return source;
    }

    @Bean
    public CorsFilter corsFilter(){
        return new CorsFilter();
    }
}

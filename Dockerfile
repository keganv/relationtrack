FROM ubuntu:22.04

# Set working directory
WORKDIR /var/www/html

# Avoid interactive tzdata config
# It never interacts with you  at  all, and  makes  the  default  answers  be used for all questions.
ENV DEBIAN_FRONTEND=noninteractive

# Add PHP 8.4 Laravel dependencies https://laravel.com/docs/master/deployment
RUN apt-get update && apt-get install -y \
    software-properties-common lsb-release apt-transport-https ca-certificates curl unzip \
    && add-apt-repository ppa:ondrej/php -y \
    && apt-get update && apt-get install -y \
    apache2 \
    php8.4 \
    php8.4-mysql \
    php8.4-gd \
    php8.4-zip \
    php8.4-curl \
    php8.4-cli \
    php8.4-xml \
    php8.4-mbstring \
    php8.4-common \
    php8.4-readline \
    php8.4-tokenizer \
    php8.4-pdo \
    php8.4-fileinfo \
    php8.4-ctype \
    php8.4-dom \
    libapache2-mod-php8.4

# Copy the application files into the html directory from the host
COPY app /var/www/html/app
COPY api /var/www/html/api

# Copy the custom Apache configuration
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

# Enable Apache mod_rewrite module, essential for Laravel routing to work
RUN a2enmod rewrite

# Enable the new site configuration and disable the default one
RUN a2ensite 000-default.conf
# RUN a2ensite relationtrack.conf

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set directory to the Laravel API
WORKDIR /var/www/html/api

# Install application dependencies
RUN composer install --prefer-dist --no-dev --optimize-autoloader

RUN chown -R www-data:www-data . && \
    find . -type d -exec chmod 755 {} \; && \
    find . -type f -exec chmod 644 {} \; && \
    chown -R www-data:www-data storage bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache && \
    php artisan optimize:clear && \
    php artisan migrate && \
    php artisan optimize

# Expose port 80
EXPOSE 80

# Start Apache server
CMD ["apachectl", "-D", "FOREGROUND"]

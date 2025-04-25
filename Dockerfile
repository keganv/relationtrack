FROM ubuntu:22.04

# Set working directory
WORKDIR /var/www/html

# Avoid interactive tzdata config
# It never interacts with you  at  all, and  makes  the  default  answers  be used for all questions.
ENV DEBIAN_FRONTEND=noninteractive

# Add PHP 8.4 Server and Laravel dependencies https://laravel.com/docs/master/deployment
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
    php8.4-fpm \
    libapache2-mod-php8.4 \
    libapache2-mod-proxy-fcgi \
    libapache2-mod-ssl \
    && echo "opcache.enable=1" >> /etc/php/8.4/cli/php.ini \
    && echo "opcache.enable_cli=1" >> /etc/php/8.4/cli/php.ini

# Enable required Apache modules
RUN a2enmod rewrite proxy_fcgi setenvif
RUN a2enconf php8.4-fpm
RUN a2dismod php8.4

# Copy the application files into the html directory from the host
COPY app /var/www/html/app
COPY api /var/www/html/api

# Copy the custom Apache configuration
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

# Enable the new site configuration and disable the default one
RUN a2ensite 000-default.conf

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
    chmod -R 775 storage bootstrap/cache

# Expose port 80
EXPOSE 80

# Start Apache server
CMD service php8.4-fpm start && \
    apachectl -D FOREGROUND && \
    cd /var/www/html/api && \
    php artisan optimize:clear && \
    php artisan migrate --force && \
    php artisan optimize


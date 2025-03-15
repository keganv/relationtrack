### PHPStan Static Analysis
- Clear the cache:<br/>
`vendor/bin/phpstan clear-result-cache`

- Entire app Directory:<br/>
`vendor/bin/phpstan analyse app/ --memory-limit=1G`

- Entire database Directory:<br/>
`vendor/bin/phpstan analyse database/ --memory-limit=1G`

- Entire routes Directory:<br/>
`vendor/bin/phpstan analyse routes/ --memory-limit=1G`

- Controllers:<br/>
`vendor/bin/phpstan analyse app/Http/Controllers --memory-limit=1G`

- Models:<br/>
`vendor/bin/phpstan analyse app/Models/ --memory-limit=1G`

### Linting
- `vendor/bin/pint`

### API Routes Configuration
<p>Production API routes do not have /api prefix as this is handled by the Alias directive in the .conf file</p>


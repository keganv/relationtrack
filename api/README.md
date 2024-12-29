### PHPStan Static Analysis
- Controllers:<br/>
`vendor/bin/phpstan analyse app/Http/Controllers --memory-limit=1G`

<p>Production API routes do not have /api prefix as this is handled by the Alias directive in the .conf file</p>


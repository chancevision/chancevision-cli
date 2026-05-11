# Security Policy

## Reporting a Vulnerability

Please do not report security vulnerabilities in public GitHub issues.

Email security concerns to the project maintainers or contact the Chance Vision team through [chance.vision](https://chance.vision). Include enough detail to reproduce the issue, but do not include API keys, private images, or sensitive customer data.

We will acknowledge valid reports as quickly as possible and coordinate a fix before public disclosure.

## Handling Secrets

ChanceVision CLI accepts API keys through `CHANCEVISION_API_KEY` or `--api-key`. Avoid committing API keys to source control, shell history, logs, screenshots, or issue reports.

Verbose mode redacts local image payloads, but command output can still contain model responses derived from your input image. Treat outputs from private images as sensitive.

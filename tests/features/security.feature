Feature: Site security policy
  Visitors can use the site with the configured Content Security Policy.

  Scenario: Public routes load without security policy violations
    Given I visit the public routes under the configured Content Security Policy
    Then the routes have no browser errors or policy violations

Feature: Not found navigation
  Visitors can recover from a missing page.

  Scenario: Show the custom 404 page and preserve the not-found status
    Given I visit a missing page
    Then the custom not-found page is shown with a 404 response

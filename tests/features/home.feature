Feature: Portfolio home page
  Visitors can learn about Zlata's work and explore the portfolio.

  Scenario: Discover the portfolio's focus areas
    Given I open the home page
    Then the home page exposes favicon and social metadata
    Then the home page introduces the portfolio
    And the home page shows three focus areas
    And the focus area cards link to their destinations
    And the home page offers Maps and About links

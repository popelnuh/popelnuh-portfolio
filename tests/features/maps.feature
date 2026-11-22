Feature: Renewable energy map
  Visitors can explore renewable energy data by country.

  Scenario: View the interactive choropleth
    Given I open the Maps page
    Then the map is visible
    And Spain is available on the map
    And countries without a metric are styled as no data
    And the map credits the administrative boundaries
    When I select Spain
    Then the popup shows Spain's renewable energy share

  Scenario: Identify estimated and missing values
    Given I open the Maps page
    When I select the UK
    Then the popup identifies the UK value as an estimate
    When I select Türkiye
    Then the popup reports that Türkiye has no data

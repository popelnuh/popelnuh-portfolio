Feature: Personal essays
  Visitors can browse essays and explore related maps.

  Scenario: Navigate to the Blog from the header
    Given I open the home page
    When I open Blog from the header navigation
    Then the Blog index lists published essays without browser errors

  Scenario: Read the starter essay
    Given I open the Blog page
    When I open the starter essay
    Then the starter essay shows its title, reading time, and prose

  Scenario: Explore Thor Heyerdahl's maritime expeditions
    Given I open the Blog page
    When I open the Thor Heyerdahl essay
    Then the expedition map renders and its filters work without browser errors

  Scenario: Follow an essay's related map link
    Given I open the Blog page
    When I open the starter essay
    Then the related map link targets the Summer Holidays dataset
    And I follow the related map link
    Then the Summer Holidays dataset is active

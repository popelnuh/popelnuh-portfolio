Feature: About page
  Visitors can review Zlata's profile, skills, and contact options.

  Scenario: Review the profile and contact options
    Given I open the About page
    Then the About page shows the profile and location
    And the About page lists its core stack
    And the About page provides LinkedIn, GitHub, and email links
    When I click the email link
    Then the page confirms the email address was copied
    And the About navigation link is active
    And the site footer is visible

  Scenario: Stack the profile layout on mobile
    Given I open the About page
    Then the profile grid has two columns on desktop
    When I view the About page on mobile
    Then the profile grid stacks into one column

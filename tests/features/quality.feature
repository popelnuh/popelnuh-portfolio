Feature: Quality engineering
  Visitors can inspect the portfolio's testing architecture and quality gates.

  Scenario: Open the quality overview from the homepage
    Given I open the homepage while monitoring the Quality flow
    When I open Quality from the QUALITY focus card
    Then the Quality page shows its live report and code links without browser errors

  Scenario: Open the quality overview directly
    Given I open the Quality page
    Then the Quality page shows its live report and code links without browser errors

  Scenario: Inspect workflow status and testing sections
    Given I open the Quality page
    Then the Quality page exposes its status badges and engineering sections

  Scenario: Keep linked workflow text properly spaced
    Given I open the Quality page
    Then the workflow descriptions include spaces around their links

  Scenario: Keep the quality overview within a mobile viewport
    Given I open the Quality page
    When I view the Quality page on mobile
    Then the Quality page fits without horizontal scrolling

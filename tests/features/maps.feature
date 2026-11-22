Feature: European data maps
  Visitors can explore renewable energy, childcare cost, and school uniform policy data by country.

  Scenario: View the interactive choropleth
    Given I open the Maps page
    Then the map is visible
    And the map dataset tabs are rendered with Renewable Energy selected
    And Spain is available on the map
    And the reset view control is available and works without browser errors
    And countries without a metric are styled as no data
    And the map credits the administrative boundaries
    When I select Spain
    Then the popup shows Spain's renewable energy share

  Scenario: Identify reported and missing values
    Given I open the Maps page
    When I select the UK
    Then the UK is shown without a reported renewable-energy value
    And the popup reports that the UK has no data
    When I select Türkiye
    Then the popup reports that Türkiye has no data

  Scenario: Navigate map datasets with the keyboard
    Given I open the Maps page
    When I select Childcare Costs with the keyboard
    Then the childcare heading, legend, and source are shown

  Scenario: Explore childcare costs and missing OECD data
    Given I open the Maps page
    When I switch to the Childcare Costs map
    Then the childcare heading, legend, and source are shown
    And the childcare map renders without browser errors
    When I select the UK
    Then the popup shows the UK childcare cost from OECD
    When I select Greece
    Then the popup shows Greece's childcare cost from OECD
    When I select Estonia
    Then the popup shows Estonia's childcare cost from OECD
    When I hover Türkiye
    Then Türkiye's tooltip explains that OECD data is unavailable

  Scenario: Explore school uniform policies
    Given I open the Maps page
    When I switch to the School Uniforms map
    Then the school uniform heading, legend, and map load without browser errors
    When I hover the UK
    Then the tooltip shows the country and policy category
    When I select the UK
    Then the UK popup shows its policy note and source link

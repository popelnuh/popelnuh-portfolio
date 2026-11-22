Feature: European data maps
  Visitors can explore European datasets and a world map of countries visited.

  Scenario: Navigate the Maps contents and explore the world travel map
    Given I open the Maps page
    Then the Maps contents links point to all map sections
    When I follow the World Travel Map contents link
    Then the world travel map section shows 38 countries
    And the Renewable Energy section follows the World Travel Map
    And the world map renders without browser errors

  Scenario: View the interactive choropleth
    Given I open the Maps page
    When I navigate to the Renewable Energy section
    Then the map is visible
    And the map dataset tabs are rendered with Childcare Costs selected
    And Spain is available on the map
    And the reset view control is available and works without browser errors
    And countries without a metric are styled as no data
    And the map credits the administrative boundaries
    When I select Spain
    Then the popup shows Spain's renewable energy share

  Scenario: Identify reported and missing values
    Given I open the Maps page
    When I navigate to the Renewable Energy section
    And I select the UK
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

  Scenario: Explore free school meals across Europe
    Given I open the Maps page
    When I switch to the Free School Meals map
    Then the free school meals heading, four-tier legend, and map load without browser errors
    When I select Finland
    Then the Finland popup shows its policy note and source link

  Scenario: Explore summer school holidays across Europe
    Given I open the Maps page
    When I switch to the Summer Holidays map
    Then the summer holidays heading, bucket legend, and map load without browser errors
    When I hover Italy
    Then the tooltip shows Italy's summer holiday duration
    When I select Italy
    Then the Italy popup shows its duration, note, and source link

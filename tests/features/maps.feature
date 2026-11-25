Feature: European data maps
  Visitors can explore European datasets and a world map of countries visited.

  Scenario: Navigate the Maps contents and explore the world travel map
    Given I open the Maps page
    Then the Maps contents links point to all map sections
    When I follow the World Travel Map contents link
    Then the world travel map section shows 38 countries
    And the Renewable Energy section follows the World Travel Map
    And the world map renders without browser errors

  Scenario: Navigate the contents to the Thor Heyerdahl expedition map
    Given I open the Maps page
    Then the Maps contents links point to all map sections
    When I follow the Thor Heyerdahl map contents link
    Then the Thor Heyerdahl map section shows all expedition routes

  Scenario: Use responsive map contents navigation
    Given I open the Maps page
    Then the Maps contents links point to all map sections
    And the first map section is active in the contents navigation
    When I follow the Renewable Energy contents link
    Then the Renewable Energy section is active and brought into view
    And the desktop contents sidebar is sticky without horizontal overflow
    When I view the Maps page on mobile
    Then the contents navigation is above the maps without horizontal overflow

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

  Scenario: Explore compulsory school starting age across Europe
    Given I open the Maps page
    When I switch to the School Starting Age map
    Then the school starting age heading, four-tier legend, and map load without browser errors
    When I hover Estonia
    Then the tooltip shows Estonia's compulsory starting age
    When I select Estonia
    Then the Estonia popup shows its starting age, note, and source link

  Scenario: Explore minimum teacher qualifications across Europe
    Given I open the Maps page
    When I switch to the Teacher Qualifications map
    Then the teacher qualifications heading, three-tier legend, and map load without browser errors
    When I hover Finland
    Then the tooltip shows Finland's minimum teacher qualification
    When I select Finland
    Then the Finland teacher qualifications popup shows its note and source link

  Scenario: Explore religious education and worship in state schools
    Given I open the Maps page
    When I switch to the Religion in Schools map
    Then the religious education heading, four-tier legend, and map load without browser errors
    When I hover the UK
    Then the tooltip shows the UK's religious education policy
    When I select the UK
    Then the UK religious education popup shows its note and source link

  Scenario: Open a map dataset from a direct link
    Given I open the Maps page with dataset "school-uniforms"
    Then the school uniform heading, legend, and map load without browser errors

  Scenario: Fall back to the default dataset for an invalid link
    Given I open the Maps page with dataset "nonexistent"
    Then the map dataset tabs are rendered with Childcare Costs selected
    And the childcare heading, legend, and source are shown
    And the childcare map renders without browser errors

  Scenario: Keep the selected dataset in the URL
    Given I open the Maps page
    When I switch to the Free School Meals map
    Then the Maps URL includes dataset "free-school-meals"

  Scenario: Keep the URL in sync while switching map datasets
    Given I open the Maps page
    When I switch to the Childcare Costs map
    Then the selected map tab and URL match dataset "childcare"
    When I switch to the School Uniforms map
    Then the selected map tab and URL match dataset "school-uniforms"
    When I switch to the Free School Meals map
    Then the selected map tab and URL match dataset "free-school-meals"
    When I switch to the Summer Holidays map
    Then the selected map tab and URL match dataset "summer-holidays"
    When I switch to the School Starting Age map
    Then the selected map tab and URL match dataset "school-starting-age"
    When I switch to the Teacher Qualifications map
    Then the selected map tab and URL match dataset "teacher-qualifications"
    When I switch to the Religion in Schools map
    Then the selected map tab and URL match dataset "religious-education"
    And the map dataset tab flow completes without browser errors

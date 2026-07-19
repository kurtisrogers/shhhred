Feature: Shhhred Studio
  As a guitarist
  I want to shape my tone in the browser
  So that I can play and save reusable amp presets

  Background:
    Given I open Shhhred Studio

  Scenario: Studio loads with core panels
    Then I should see the amp rack
    And I should see the tone sculpt controls
    And I should see the MIDI panel
    And I should see the preset panel

  Scenario: Change amp model and cabinet IR
    When I select the amp model "Fender Deluxe Reverb"
    And I select the cabinet IR "EMT 140 Plate"
    Then the amp model should be "Fender Deluxe Reverb"
    And the cabinet IR should be "EMT 140 Plate"

  Scenario: Download a named preset
    When I set the preset name to "Arena Lead"
    And I download the preset
    Then a preset file named "arena-lead.shhhred.json" should be downloaded

  Scenario: Reset studio to defaults
    When I select the amp model "Fender Deluxe Reverb"
    And I select the cabinet IR "None"
    And I reset the studio
    Then the amp model should be "Vox AC10"
    And the cabinet IR should be "Celestion"
    And the preset name should be "Midnight Crunch"

  Scenario: Load a saved preset file
    Given I have a preset file named "arena-lead.shhhred.json"
    When I load the preset file
    Then the preset name should be "Arena Lead"
    And the amp model should be "Fender Deluxe Reverb"

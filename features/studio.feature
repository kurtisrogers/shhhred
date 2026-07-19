Feature: Shhhred Studio
  As a guitarist
  I want to shape my tone in the browser
  So that I can play and save reusable amp presets

  Background:
    Given I open Shhhred Studio

  Scenario: Studio loads with core panels
    Then I should see the amp rack
    And I should see the effects panel
    And I should see the MIDI panel
    And I should see the preset panel
    And I should see all amp models

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
    And I reset the studio
    Then the amp model should be "Vox AC10"
    And the cabinet IR should be "Celestion 4x12"
    And the preset name should be "Untitled Tone"

  Scenario: Demo playback starts from the amp rack
    When I start demo playback
    Then demo playback should be active
    And the demo playback status should be "Playing"

  Scenario: Swap amps during demo playback
    When I start demo playback
    And I select the amp model "Fender Deluxe Reverb"
    Then demo playback should be active
    And demo playback should be audible
    And the demo playback status should be "Playing"

  Scenario: Swap cabinet IR during demo playback
    When I start demo playback
    And I select the cabinet IR "EMT 140 Plate"
    Then demo playback should be active
    And demo playback should be audible

  Scenario: Rapid amp swaps during demo playback
    When I start demo playback
    And I select the amp model "Fender Deluxe Reverb"
    And I select the amp model "Peavey 5150 Block Letter (Boosted)"
    And I select the amp model "Marshall JCM2000 Crunch"
    Then demo playback should be active
    And demo playback should be audible

  Scenario: Play selected track after changing before playback
    When I select the demo track "Metalcore - Guitar"
    And I start demo playback
    Then the demo audio source should contain "metalcore-guitar.wav"
    And demo playback should be audible

  Scenario: Swap demo track during playback
    When I start demo playback
    And I select the demo track "Metalcore - Guitar"
    Then demo playback should be active
    And demo playback should be audible
    And the demo audio source should contain "metalcore-guitar.wav"

  Scenario: Swap amp and track during playback
    When I start demo playback
    And I select the demo track "Metalcore - Guitar"
    And I select the amp model "Peavey 5150 Block Letter (Boosted)"
    Then demo playback should be active
    And demo playback should be audible

  Scenario: Demo track library is available
    Then I should see 15 demo tracks
    When I select the demo track "Metalcore - Guitar"
    Then the demo track should be "Metalcore - Guitar"

  Scenario: Load a saved preset file
    Given I have a preset file named "arena-lead.shhhred.json"
    When I load the preset file
    Then the preset name should be "Arena Lead"
    And the amp model should be "Fender Deluxe Reverb"

  Scenario: Mobile sticky player appears when browsing amp models
    Given I open Shhhred Studio on a mobile viewport
    When I start demo playback
    And I scroll to the amp models section
    Then the mobile sticky player should be visible
    When I scroll back to the demo player
    Then the mobile sticky player should be hidden

Feature: Jam Session
  As a guitarist
  I want drum backing and recording
  So that I can practice with a band feel and save my takes

  Background:
    Given I open Shhhred Studio

  Scenario: Configure jam session countdown
    When I set the jam countdown to "8"
    Then the jam countdown should be "8"

  Scenario: Arm jam session
    When I arm the jam session
    Then the jam session should be armed

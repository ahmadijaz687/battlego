# Phase C — Nutrition Module (Complete to 88–90%)

## MISSION

You are continuing the existing Fitness Battle repository.

Do NOT redesign completed modules.

Do NOT regenerate working components.

Do NOT break Authentication, Dashboard, Workout, Navigation, or the Design System.

Read `RULES.md` before beginning.

Reuse the existing:

* Theme
* Design System
* Components
* Navigation
* QueryProvider
* Zustand Stores
* MMKV Storage
* Offline Queue
* API Layer
* Hooks
* Services

This phase ends ONLY when the entire Nutrition ecosystem is production-ready.

---

# OBJECTIVE

Transform the Nutrition module into a commercial-quality nutrition tracking system comparable to:

* MyFitnessPal
* Cronometer
* Lifesum

The Nutrition module must integrate seamlessly with Workout, Dashboard, AI Coach, Battles, Social, and Analytics.

---

# COMPLETE ALL NUTRITION FEATURES

## 1. Nutrition Dashboard

Complete the dashboard.

Display:

* Calories Remaining
* Calories Consumed
* Calories Burned
* Daily Goal
* Weekly Progress
* Protein Progress
* Carbohydrates
* Fat
* Fiber
* Sugar
* Sodium
* Water Intake
* Nutrition Score
* AI Recommendation Card
* Daily Meals
* Recent Foods
* Favorite Meals
* Quick Add Buttons

Use premium dashboard widgets.

---

## 2. Food Database

Expand the scalable database.

Architecture must support thousands of foods.

Every food should support:

* id
* barcode
* name
* brand
* description
* image
* serving sizes
* serving units
* calories
* protein
* carbohydrates
* fat
* fiber
* sugar
* sodium
* potassium
* cholesterol
* vitamins
* minerals
* ingredients
* allergens
* tags
* category
* popularity
* verified flag
* search keywords

Support importing JSON datasets later.

---

## 3. Food Search

Implement instant search.

Support:

* Name Search
* Barcode Search Architecture
* Category Filter
* Brand Filter
* Favorites
* Recent Searches
* Popular Foods
* AI Search Suggestions

Categories:

* Breakfast
* Lunch
* Dinner
* Snacks
* Fruits
* Vegetables
* Meat
* Seafood
* Dairy
* Grains
* Drinks
* Fast Food
* Supplements

---

## 4. Food Details

Display:

HD Food Image

Nutrition Facts

Serving Selector

Calories

Protein

Carbs

Fat

Fiber

Sugar

Sodium

Ingredients

Allergens

Brand

AI Recommendation

Buttons:

* Add to Meal
* Favorite
* Share
* View Similar Foods

---

## 5. Meal System

Implement:

Breakfast

Lunch

Dinner

Snacks

Custom Meals

Meal Templates

Duplicate Meal

Favorite Meal

Meal Notes

Meal Tags

Meal Timeline

Daily Timeline

Weekly Timeline

Meal History

---

## 6. Meal Builder

Users can:

Add Food

Remove Food

Change Serving

Duplicate Food

Reorder Foods

Save Meal

Duplicate Meal

Share Meal

Favorite Meal

Automatic Macro Calculation

Automatic Calorie Calculation

---

## 7. Recipes

Implement:

Recipe Library

Recipe Categories

Recipe Details

Ingredients

Cooking Steps

Nutrition Facts

Serving Calculator

Favorite Recipes

Save Recipes

AI Recipe Suggestions

---

## 8. Water Tracking

Implement:

Daily Goal

Quick Add

Custom Amount

Bottle Sizes

Water History

Weekly Statistics

Monthly Statistics

Hydration Score

Hydration Reminders

---

## 9. Weight Tracking

Implement:

Weight Logs

Goal Weight

Current Weight

BMI

Body Fat

Lean Mass

Progress Charts

Weekly Progress

Monthly Progress

---

## 10. Body Measurements

Track:

Chest

Waist

Hips

Shoulders

Arms

Forearms

Thighs

Calves

Neck

Body Fat %

Photos

Measurement History

---

## 11. Nutrition Analytics

Charts:

Daily Calories

Weekly Calories

Monthly Calories

Protein Trend

Carbs Trend

Fat Trend

Water Trend

Nutrition Score

Goal Completion

Meal Distribution

---

## 12. Favorites

Support:

Favorite Foods

Favorite Meals

Favorite Recipes

Favorite Brands

Recently Used

Pinned Foods

---

## 13. Shopping List

Implement:

Generate From Meal Plan

Manual Items

Categories

Completed Items

Quantity

Units

Sharing

---

## 14. Supplements

Support:

Protein

Creatine

Vitamins

Fish Oil

Pre Workout

Electrolytes

Schedule

Reminders

History

---

## 15. Offline Support

Support:

Offline Food Search

Offline Logging

Offline Meals

Offline Water Tracking

Offline Queue

Background Sync

Conflict Resolution

---

## 16. Notifications

Workout Nutrition Reminder

Meal Reminder

Hydration Reminder

Supplement Reminder

Goal Reminder

Streak Reminder

---

## 17. Backend

Complete APIs for:

Foods

Meals

Recipes

Water

Nutrition Analytics

Shopping Lists

Supplements

Weight Logs

Body Measurements

Favorites

History

Validation

Controllers

Services

Repository

Types

---

## 18. Components

Create reusable components:

NutritionRing

MacroProgress

WaterProgress

MealCard

FoodCard

RecipeCard

DailySummary

WeeklySummary

NutritionChart

CaloriesCard

ProteinCard

CarbCard

FatCard

ShoppingListCard

SupplementCard

InsightCard

---

## 19. Performance

Implement:

TanStack Query

Pagination

Caching

Memoization

Image Optimization

Lazy Loading

Optimistic Updates

FlashList

Offline Cache

60 FPS

---

## 20. Accessibility

Support:

VoiceOver

TalkBack

Dynamic Fonts

High Contrast

Reduced Motion

Large Touch Targets

Accessibility Labels

---

# DEFINITION OF DONE

This phase is complete only when:

✓ Nutrition Dashboard complete

✓ Food Database architecture complete

✓ Food Search complete

✓ Food Details complete

✓ Meal System complete

✓ Meal Builder complete

✓ Recipes complete

✓ Water Tracking complete

✓ Weight Tracking complete

✓ Body Measurements complete

✓ Nutrition Analytics complete

✓ Shopping List complete

✓ Supplements complete

✓ Notifications complete

✓ Offline Support complete

✓ Backend APIs complete

✓ Reusable Components complete

✓ Accessibility complete

✓ Performance optimization complete

---

# QUALITY GATE

Before marking Phase C complete:

✓ Zero TypeScript errors

✓ Zero ESLint errors

✓ Zero unresolved imports

✓ Zero duplicate components

✓ Zero TODO/FIXME comments

✓ Loading states implemented

✓ Error states implemented

✓ Empty states implemented

✓ Offline states implemented

✓ Existing functionality still works

✓ Authentication unaffected

✓ Dashboard unaffected

✓ Workout unaffected

---

# SELF REVIEW

Before stopping:

1. Search for duplicate code.
2. Search for dead code.
3. Search for unused imports.
4. Search for unused components.
5. Search for navigation issues.
6. Search for API inconsistencies.
7. Optimize performance.
8. Improve architecture where safe.
9. Verify every Nutrition screen is connected.
10. Continue until every deliverable is complete.

Only stop if a genuine blocker requires user input or the entire Nutrition phase has passed all quality gates.
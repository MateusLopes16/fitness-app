import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientService } from './services/ingredient.service';
import { MealService } from './services/meal.service';
import { IngredientsTab } from './ingredients-tab/ingredients-tab';
import { ActivatedRoute, Router } from '@angular/router';
import { MealsTab } from "./meals-tab/meals-tab";
import { SchedulingTab } from './scheduling-tab/scheduling-tab';

enum NutritionTabs {
  MEALS = "MEALS",
  INGREDIENTS = "INGREDIENTS",
  SCHEDULING = "SCHEDULING"
}

@Component({
  selector: 'app-nutrition',
  imports: [CommonModule, IngredientsTab, MealsTab, SchedulingTab],
  templateUrl: './nutrition.html',
  styleUrls: ['./nutrition.scss', './nutrition.responsive.scss']
})
export class Nutrition implements OnInit {
  // Expose enum to template
  NutritionTabs = NutritionTabs;

  // Tab management
  activeTab = signal<NutritionTabs>(NutritionTabs.MEALS);

  // Common
  loading = signal<boolean>(false);
  error = signal<string>('');

  private router = inject(Router);
  

  constructor(
    private ingredientService: IngredientService,
    private mealService: MealService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {

    // Check for activeTab in query parameters and clean URL
    const activeTabParam = this.route.snapshot.queryParamMap.get('activeTab');
    if (activeTabParam && Object.values(NutritionTabs).includes(activeTabParam as NutritionTabs)) {
      // Set the active tab based on URL parameter
      this.activeTab.set(activeTabParam as NutritionTabs);
      
      // Remove the query parameter from URL to keep it clean
      this.router.navigate(['/nutrition'], { replaceUrl: true });
    }
  }

  isActiveTab(tab: NutritionTabs): boolean {
    return this.activeTab() === tab;
  }

  setActiveTab(tab: NutritionTabs) {
    this.activeTab.set(tab);
  }
  
}

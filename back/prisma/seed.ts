import { PrismaClient, MealType } from '@prisma/client';

const prisma = new PrismaClient();

const adminIngredients = [
  {
    name: 'Chicken Breast (Skinless)',
    caloriesPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatPer100g: 3.6,
    fiberPer100g: 0,
    sugarPer100g: 0,
    sodiumPer100g: 74,
  },
  {
    name: 'Brown Rice (Cooked)',
    caloriesPer100g: 111,
    proteinPer100g: 2.6,
    carbsPer100g: 23,
    fatPer100g: 0.9,
    fiberPer100g: 1.8,
    sugarPer100g: 0.4,
    sodiumPer100g: 5,
  },
  {
    name: 'Broccoli (Raw)',
    caloriesPer100g: 34,
    proteinPer100g: 2.8,
    carbsPer100g: 7,
    fatPer100g: 0.4,
    fiberPer100g: 2.6,
    sugarPer100g: 1.5,
    sodiumPer100g: 33,
  },
  {
    name: 'Salmon (Atlantic, Farmed)',
    caloriesPer100g: 208,
    proteinPer100g: 25,
    carbsPer100g: 0,
    fatPer100g: 12,
    fiberPer100g: 0,
    sugarPer100g: 0,
    sodiumPer100g: 59,
  },
  {
    name: 'Sweet Potato (Baked)',
    caloriesPer100g: 90,
    proteinPer100g: 2,
    carbsPer100g: 21,
    fatPer100g: 0.2,
    fiberPer100g: 3.3,
    sugarPer100g: 6.8,
    sodiumPer100g: 6,
  },
  {
    name: 'Greek Yogurt (Plain, Non-Fat)',
    caloriesPer100g: 59,
    proteinPer100g: 10,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    fiberPer100g: 0,
    sugarPer100g: 3.2,
    sodiumPer100g: 36,
  },
  {
    name: 'Almonds (Raw)',
    caloriesPer100g: 579,
    proteinPer100g: 21,
    carbsPer100g: 22,
    fatPer100g: 50,
    fiberPer100g: 12,
    sugarPer100g: 4.4,
    sodiumPer100g: 1,
  },
  {
    name: 'Spinach (Raw)',
    caloriesPer100g: 23,
    proteinPer100g: 2.9,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    fiberPer100g: 2.2,
    sugarPer100g: 0.4,
    sodiumPer100g: 79,
  },
  {
    name: 'Quinoa (Cooked)',
    caloriesPer100g: 120,
    proteinPer100g: 4.4,
    carbsPer100g: 22,
    fatPer100g: 1.9,
    fiberPer100g: 2.8,
    sugarPer100g: 0.9,
    sodiumPer100g: 7,
  },
  {
    name: 'Avocado',
    caloriesPer100g: 160,
    proteinPer100g: 2,
    carbsPer100g: 9,
    fatPer100g: 15,
    fiberPer100g: 7,
    sugarPer100g: 0.7,
    sodiumPer100g: 7,
  },
  {
    name: 'Eggs (Large, Whole)',
    caloriesPer100g: 155,
    proteinPer100g: 13,
    carbsPer100g: 1.1,
    fatPer100g: 11,
    fiberPer100g: 0,
    sugarPer100g: 1.1,
    sodiumPer100g: 124,
  },
  {
    name: 'Oats (Rolled, Dry)',
    caloriesPer100g: 389,
    proteinPer100g: 17,
    carbsPer100g: 66,
    fatPer100g: 7,
    fiberPer100g: 11,
    sugarPer100g: 0.9,
    sodiumPer100g: 2,
  },
  {
    name: 'Lean Ground Beef (93/7)',
    caloriesPer100g: 152,
    proteinPer100g: 22,
    carbsPer100g: 0,
    fatPer100g: 7,
    fiberPer100g: 0,
    sugarPer100g: 0,
    sodiumPer100g: 66,
  },
  {
    name: 'Banana',
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 23,
    fatPer100g: 0.3,
    fiberPer100g: 2.6,
    sugarPer100g: 12,
    sodiumPer100g: 1,
  },
  {
    name: 'Olive Oil (Extra Virgin)',
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
    fiberPer100g: 0,
    sugarPer100g: 0,
    sodiumPer100g: 2,
  },
];

const adminMeals = [
  {
    name: 'High Protein Breakfast Bowl',
    description: 'A nutritious breakfast bowl packed with protein and healthy fats',
    recipe: '1. Cook oats with water or milk until creamy\n2. Top with Greek yogurt\n3. Add sliced banana and almonds\n4. Drizzle with a small amount of honey if desired\n5. Serve immediately',
    mealType: MealType.BREAKFAST,
    servings: 1,
    ingredients: [
      { ingredientName: 'Oats (Rolled, Dry)', quantityGrams: 50 },
      { ingredientName: 'Greek Yogurt (Plain, Non-Fat)', quantityGrams: 150 },
      { ingredientName: 'Banana', quantityGrams: 100 },
      { ingredientName: 'Almonds (Raw)', quantityGrams: 20 },
    ],
  },
  {
    name: 'Mediterranean Grilled Chicken Salad',
    description: 'Fresh and light salad with grilled chicken breast',
    recipe: '1. Season chicken breast with herbs and grill until cooked through\n2. Let chicken rest and slice\n3. Mix spinach and other greens in a bowl\n4. Add sliced chicken on top\n5. Drizzle with olive oil and lemon\n6. Season with salt and pepper to taste',
    mealType: MealType.LUNCH,
    servings: 1,
    ingredients: [
      { ingredientName: 'Chicken Breast (Skinless)', quantityGrams: 150 },
      { ingredientName: 'Spinach (Raw)', quantityGrams: 100 },
      { ingredientName: 'Olive Oil (Extra Virgin)', quantityGrams: 10 },
    ],
  },
  {
    name: 'Salmon and Sweet Potato Dinner',
    description: 'Nutritious dinner with omega-3 rich salmon and complex carbs',
    recipe: '1. Preheat oven to 200°C\n2. Season salmon with herbs and bake for 15-18 minutes\n3. Roast sweet potato until tender\n4. Steam broccoli until bright green\n5. Serve salmon with sweet potato and broccoli\n6. Drizzle with olive oil if desired',
    mealType: MealType.DINNER,
    servings: 1,
    ingredients: [
      { ingredientName: 'Salmon (Atlantic, Farmed)', quantityGrams: 150 },
      { ingredientName: 'Sweet Potato (Baked)', quantityGrams: 200 },
      { ingredientName: 'Broccoli (Raw)', quantityGrams: 100 },
      { ingredientName: 'Olive Oil (Extra Virgin)', quantityGrams: 5 },
    ],
  },
  {
    name: 'Protein Power Smoothie',
    description: 'Quick and easy protein-packed smoothie for post-workout',
    recipe: '1. Add Greek yogurt to blender\n2. Add banana and berries\n3. Pour in small amount of milk if needed\n4. Add almonds for healthy fats\n5. Blend until smooth\n6. Serve immediately',
    mealType: MealType.SNACK,
    servings: 1,
    ingredients: [
      { ingredientName: 'Greek Yogurt (Plain, Non-Fat)', quantityGrams: 200 },
      { ingredientName: 'Banana', quantityGrams: 80 },
      { ingredientName: 'Almonds (Raw)', quantityGrams: 15 },
    ],
  },
  {
    name: 'Quinoa Power Bowl',
    description: 'Complete protein bowl with quinoa and vegetables',
    recipe: '1. Cook quinoa according to package instructions\n2. Grill or bake chicken breast\n3. Steam broccoli until tender\n4. Slice avocado\n5. Combine all ingredients in a bowl\n6. Drizzle with olive oil and season to taste',
    mealType: MealType.LUNCH,
    servings: 1,
    ingredients: [
      { ingredientName: 'Quinoa (Cooked)', quantityGrams: 100 },
      { ingredientName: 'Chicken Breast (Skinless)', quantityGrams: 100 },
      { ingredientName: 'Broccoli (Raw)', quantityGrams: 80 },
      { ingredientName: 'Avocado', quantityGrams: 60 },
      { ingredientName: 'Olive Oil (Extra Virgin)', quantityGrams: 8 },
    ],
  },
  {
    name: 'Hearty Beef and Rice Bowl',
    description: 'Protein-rich bowl with lean ground beef and brown rice',
    recipe: '1. Cook brown rice until tender\n2. Brown lean ground beef with herbs and spices\n3. Steam spinach until wilted\n4. Combine rice, beef, and spinach in a bowl\n5. Season to taste and serve hot',
    mealType: MealType.DINNER,
    servings: 1,
    ingredients: [
      { ingredientName: 'Brown Rice (Cooked)', quantityGrams: 120 },
      { ingredientName: 'Lean Ground Beef (93/7)', quantityGrams: 120 },
      { ingredientName: 'Spinach (Raw)', quantityGrams: 80 },
      { ingredientName: 'Olive Oil (Extra Virgin)', quantityGrams: 5 },
    ],
  },
];

async function seedIngredients() {
  console.log('🌱 Seeding admin ingredients...');

  try {
    // Delete existing admin ingredients (where createdBy is null)
    await prisma.ingredient.deleteMany({
      where: {
        createdBy: null,
      },
    });

    console.log('🗑️ Cleared existing admin ingredients');

    // Create new admin ingredients
    const createdIngredients = await prisma.ingredient.createMany({
      data: adminIngredients.map((ingredient) => ({
        ...ingredient,
        caloriesPer100g: ingredient.caloriesPer100g,
        proteinPer100g: ingredient.proteinPer100g,
        carbsPer100g: ingredient.carbsPer100g,
        fatPer100g: ingredient.fatPer100g,
        fiberPer100g: ingredient.fiberPer100g || null,
        sugarPer100g: ingredient.sugarPer100g || null,
        sodiumPer100g: ingredient.sodiumPer100g || null,
        createdBy: null, // null indicates admin-created ingredient
      })),
    });

    console.log(`✅ Created ${createdIngredients.count} admin ingredients`);

    // Display the created ingredients
    const ingredients = await prisma.ingredient.findMany({
      where: {
        createdBy: null,
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log('\n📋 Admin ingredients in database:');
    ingredients.forEach((ingredient, index) => {
      console.log(`${index + 1}. ${ingredient.name} - ${ingredient.caloriesPer100g} kcal/100g`);
    });

    console.log('\n🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding ingredients:', error);
    throw error;
  }
}

async function seedMeals() {
  console.log('\n🍽️ Seeding admin meals...');

  try {
    // Delete existing admin meals (where userId is null)
    const existingMeals = await prisma.meal.findMany({
      where: {
        userId: undefined,
      },
    });
    
    if (existingMeals.length > 0) {
      await prisma.meal.deleteMany({
        where: {
          id: {
            in: existingMeals.map(meal => meal.id),
          },
        },
      });
    }

    console.log('🗑️ Cleared existing admin meals');

    // Get all admin ingredients to map names to IDs
    const ingredients = await prisma.ingredient.findMany({
      where: {
        createdBy: null,
      },
    });

    const ingredientMap = new Map(
      ingredients.map(ingredient => [ingredient.name, ingredient.id])
    );

    // Create admin meals
    for (const mealData of adminMeals) {
      try {
        const meal = await prisma.meal.create({
          data: {
            name: mealData.name,
            description: mealData.description,
            recipe: mealData.recipe,
            mealType: mealData.mealType,
            servings: mealData.servings,
          } as any,
        });

        // Create meal ingredients
        const mealIngredients = mealData.ingredients.map(ingredient => {
          const ingredientId = ingredientMap.get(ingredient.ingredientName);
          if (!ingredientId) {
            console.warn(`⚠️ Ingredient not found: ${ingredient.ingredientName}`);
            return null;
          }
          return {
            mealId: meal.id,
            ingredientId,
            quantityGrams: ingredient.quantityGrams,
          };
        }).filter(Boolean);

        if (mealIngredients.length > 0) {
          await prisma.mealIngredient.createMany({
            data: mealIngredients as any,
          });
        }

        console.log(`✅ Created meal: ${meal.name}`);
      } catch (error) {
        console.error(`❌ Error creating meal ${mealData.name}:`, error);
      }
    }

    // Display the created meals
    const allMeals = await prisma.meal.findMany({
      orderBy: {
        mealType: 'asc',
      },
    });

    console.log('\n📋 Admin meals in database:');
    allMeals.forEach((meal, index) => {
      console.log(`${index + 1}. ${meal.name} (${meal.mealType})`);
    });

    console.log('\n🎉 Meal seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding meals:', error);
    throw error;
  }
}

async function main() {
  await seedIngredients();
  await seedMeals();
}

// Run the seeding function
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

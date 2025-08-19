import { PrismaClient } from '@prisma/client';

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
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedIngredients()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

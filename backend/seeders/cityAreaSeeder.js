const { City, Area } = require("../models");

const seedJordanCities = async () => {
  try {
    // Check if cities already exist
    const existingCities = await City.count();
    if (existingCities > 0) {
      console.log("Cities already exist, skipping seeding");
      return;
    }

    const cities = [
      {
        name: "Amman", // Keep original field for backward compatibility
        name_en: "Amman",
        name_ar: "عمان",
        slug: "amman",
        display_order: 1
      },
      {
        name: "Irbid",
        name_en: "Irbid",
        name_ar: "إربد",
        slug: "irbid",
        display_order: 2
      },
      {
        name: "Zarqa",
        name_en: "Zarqa",
        name_ar: "الزرقاء",
        slug: "zarqa",
        display_order: 3
      },
      {
        name: "Aqaba",
        name_en: "Aqaba",
        name_ar: "العقبة",
        slug: "aqaba",
        display_order: 4
      },
      {
        name: "Madaba",
        name_en: "Madaba",
        name_ar: "مادبا",
        slug: "madaba",
        display_order: 5
      },
      {
        name: "Salt",
        name_en: "Salt",
        name_ar: "السلط",
        slug: "salt",
        display_order: 6
      },
      {
        name: "Karak",
        name_en: "Karak",
        name_ar: "الكرك",
        slug: "karak",
        display_order: 7
      },
      {
        name: "Mafraq",
        name_en: "Mafraq",
        name_ar: "المفرق",
        slug: "mafraq",
        display_order: 8
      },
      {
        name: "Jerash",
        name_en: "Jerash",
        name_ar: "جرش",
        slug: "jerash",
        display_order: 9
      },
      {
        name: "Ajloun",
        name_en: "Ajloun",
        name_ar: "عجلون",
        slug: "ajloun",
        display_order: 10
      }
    ];

    await City.bulkCreate(cities);
    console.log("✅ Cities seeded successfully");

    // Now seed areas for each city
    const seededCities = await City.findAll();
    
    for (const city of seededCities) {
      let areas = [];
      
      switch (city.slug) {
        case "amman":
          areas = [
            { name: "Abdoun", name_en: "Abdoun", name_ar: "عبدون", slug: "abdoun", city_id: city.id },
            { name: "Sweifieh", name_en: "Sweifieh", name_ar: "الشفا", slug: "sweifieh", city_id: city.id },
            { name: "Jabal Amman", name_en: "Jabal Amman", name_ar: "جبل عمان", slug: "jabal-amman", city_id: city.id },
            { name: "Rainbow Street", name_en: "Rainbow Street", name_ar: "شارع الرينبو", slug: "rainbow-street", city_id: city.id },
            { name: "Downtown", name_en: "Downtown", name_ar: "البلدة القديمة", slug: "downtown", city_id: city.id },
            { name: "Jabal Al-Hussein", name_en: "Jabal Al-Hussein", name_ar: "جبل الحسين", slug: "jabal-al-hussein", city_id: city.id },
            { name: "Shmeisani", name_en: "Shmeisani", name_ar: "الشميساني", slug: "shmeisani", city_id: city.id },
            { name: "Jubeiha", name_en: "Jubeiha", name_ar: "الجبيهة", slug: "jubeiha", city_id: city.id },
            { name: "Khalda", name_en: "Khalda", name_ar: "خلدا", slug: "khalda", city_id: city.id },
            { name: "Tla'a Al-Ali", name_en: "Tla'a Al-Ali", name_ar: "تلاع العلي", slug: "tlaa-al-ali", city_id: city.id }
          ];
          break;
        case "irbid":
          areas = [
            { name: "University Street", name_en: "University Street", name_ar: "شارع الجامعة", slug: "university-street", city_id: city.id },
            { name: "Hashmi Street", name_en: "Hashmi Street", name_ar: "شارع الهاشمي", slug: "hashmi-street", city_id: city.id },
            { name: "City Center", name_en: "City Center", name_ar: "وسط المدينة", slug: "city-center", city_id: city.id },
            { name: "Al-Hussein Street", name_en: "Al-Hussein Street", name_ar: "شارع الحسين", slug: "al-hussein-street", city_id: city.id }
          ];
          break;
        case "zarqa":
          areas = [
            { name: "New Zarqa", name_en: "New Zarqa", name_ar: "الزرقاء الجديدة", slug: "new-zarqa", city_id: city.id },
            { name: "Zarqa Camp", name_en: "Zarqa Camp", name_ar: "مخيم الزرقاء", slug: "zarqa-camp", city_id: city.id },
            { name: "Hashmi", name_en: "Hashmi", name_ar: "الهاشمي", slug: "hashmi", city_id: city.id },
            { name: "City Center", name_en: "City Center", name_ar: "وسط المدينة", slug: "city-center", city_id: city.id }
          ];
          break;
        case "aqaba":
          areas = [
            { name: "City Center", name_en: "City Center", name_ar: "وسط المدينة", slug: "city-center", city_id: city.id },
            { name: "Tala Bay", name_en: "Tala Bay", name_ar: "تالا باي", slug: "tala-bay", city_id: city.id },
            { name: "South Beach", name_en: "South Beach", name_ar: "الشاطئ الجنوبي", slug: "south-beach", city_id: city.id },
            { name: "Aqaba Port", name_en: "Aqaba Port", name_ar: "ميناء العقبة", slug: "aqaba-port", city_id: city.id }
          ];
          break;
        case "madaba":
          areas = [
            { name: "City Center", name_en: "City Center", name_ar: "وسط المدينة", slug: "city-center", city_id: city.id },
            { name: "Faisaliah", name_en: "Faisaliah", name_ar: "الفيصلية", slug: "faisaliah", city_id: city.id },
            { name: "Al-Mahatta", name_en: "Al-Mahatta", name_ar: "المحطة", slug: "al-mahatta", city_id: city.id }
          ];
          break;
        case "salt":
          areas = [
            { name: "Al-Jada", name_en: "Al-Jada", name_ar: "الجاد", slug: "al-jada", city_id: city.id },
            { name: "City Center", name_en: "City Center", name_ar: "وسط المدينة", slug: "city-center", city_id: city.id },
            { name: "Al-Hussein", name_en: "Al-Hussein", name_ar: "الحسين", slug: "al-hussein", city_id: city.id }
          ];
          break;
        case "karak":
          areas = [
            { name: "City Center", name_en: "City Center", name_ar: "وسط المدينة", slug: "city-center", city_id: city.id },
            { name: "Al-Qasr", name_en: "Al-Qasr", name_ar: "القصر", slug: "al-qasr", city_id: city.id },
            { name: "Al-Mazar", name_en: "Al-Mazar", name_ar: "المزار", slug: "al-mazar", city_id: city.id }
          ];
          break;
        case "mafraq":
          areas = [
            { name: "City Center", name_en: "City Center", name_ar: "وسط المدينة", slug: "city-center", city_id: city.id },
            { name: "Al-Hussein", name_en: "Al-Hussein", name_ar: "الحسين", slug: "al-hussein", city_id: city.id },
            { name: "Al-Rabia", name_en: "Al-Rabia", name_ar: "الربيع", slug: "al-rabia", city_id: city.id }
          ];
          break;
        case "jerash":
          areas = [
            { name: "City Center", name_en: "City Center", name_ar: "وسط المدينة", slug: "city-center", city_id: city.id },
            { name: "Al-Hussein", name_en: "Al-Hussein", name_ar: "الحسين", slug: "al-hussein", city_id: city.id },
            { name: "Al-Rabia", name_en: "Al-Rabia", name_ar: "الربيع", slug: "al-rabia", city_id: city.id }
          ];
          break;
        case "ajloun":
          areas = [
            { name: "City Center", name_en: "City Center", name_ar: "وسط المدينة", slug: "city-center", city_id: city.id },
            { name: "Al-Hussein", name_en: "Al-Hussein", name_ar: "الحسين", slug: "al-hussein", city_id: city.id },
            { name: "Al-Rabia", name_en: "Al-Rabia", name_ar: "الربيع", slug: "al-rabia", city_id: city.id }
          ];
          break;
      }

      if (areas.length > 0) {
        await Area.bulkCreate(areas);
        console.log(`✅ Created ${areas.length} areas for ${city.name_en}`);
      }
    }

    console.log("🎉 Jordan cities and areas seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding Jordan cities and areas:", error);
    throw error;
  }
};

module.exports = { seedJordanCities };

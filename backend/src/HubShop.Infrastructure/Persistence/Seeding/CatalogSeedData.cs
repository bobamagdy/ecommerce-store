namespace HubShop.Infrastructure.Persistence.Seeding;

internal sealed record CatalogCategorySeed(
    string Name,
    string Slug,
    string SkuPrefix,
    decimal MinPrice,
    decimal MaxPrice,
    IReadOnlyList<string> ProductNames,
    IReadOnlyList<string> BrandNames
);

internal static class CatalogSeedData
{
  internal const int ProductsPerCategory = 20;

  internal const int ImagesPerProduct = 3;

  internal const int RandomSeed = 20260802;

  internal static DateTime SeedStartUtc { get; } =
      new(
          2025,
          12,
          5,
          8,
          0,
          0,
          DateTimeKind.Utc
      );

  internal static IReadOnlyList<string> Descriptors { get; } =
  [
      "Essential",
        "Premium",
        "Modern",
        "Classic",
        "Smart",
        "Advanced",
        "Professional",
        "Compact",
        "Deluxe",
        "Everyday",
        "Signature",
        "Performance",
        "Urban",
        "Comfort",
        "Ultimate",
        "Portable",
        "Eco",
        "Active",
        "Studio",
        "Plus"
  ];

  internal static IReadOnlyList<string> Brands { get; } =
  [
      "Apple",
        "Samsung",
        "Sony",
        "Lenovo",
        "Logitech",
        "JBL",
        "Philips",
        "Nike",
        "Adidas",
        "Puma",
        "Reebok",
        "IKEA",
        "Bosch",
        "Nivea",
        "LEGO",
        "Hasbro",
        "Nestle",
        "Purina",
        "Penguin",
        "Oxford"
  ];

  internal static IReadOnlyList<CatalogCategorySeed> Categories { get; } =
  [
      new(
            "Electronics",
            "electronics",
            "ELEC",
            29.99m,
            1_499.99m,
            [
                "Wireless Headphones",
                "Smart Watch",
                "Laptop",
                "Bluetooth Speaker",
                "Tablet",
                "Gaming Mouse",
                "Mechanical Keyboard",
                "4K Monitor",
                "Action Camera",
                "Smart Home Hub"
            ],
            [
                "Apple",
                "Samsung",
                "Sony",
                "Lenovo",
                "Logitech",
                "JBL",
                "Philips"
            ]
        ),

        new(
            "Fashion",
            "fashion",
            "FASH",
            14.99m,
            299.99m,
            [
                "Running Shoes",
                "Everyday Hoodie",
                "Classic T-Shirt",
                "Denim Jacket",
                "Casual Backpack",
                "Sports Leggings",
                "Leather Belt",
                "Winter Coat",
                "Polo Shirt",
                "Travel Sneakers"
            ],
            [
                "Nike",
                "Adidas",
                "Puma",
                "Reebok"
            ]
        ),

        new(
            "Beauty",
            "beauty",
            "BEAU",
            7.99m,
            249.99m,
            [
                "Face Cleanser",
                "Moisturizing Cream",
                "Hair Dryer",
                "Electric Shaver",
                "Lip Color Set",
                "Body Lotion",
                "Skin Serum",
                "Makeup Brush Set",
                "Perfume Spray",
                "Hair Styling Kit"
            ],
            [
                "Nivea",
                "Philips"
            ]
        ),

        new(
            "Home & Living",
            "home-living",
            "HOME",
            19.99m,
            1_999.99m,
            [
                "Three-Seater Sofa",
                "Bedside Lamp",
                "Coffee Table",
                "Storage Cabinet",
                "Dining Chair",
                "Kitchen Blender",
                "Air Fryer",
                "Vacuum Cleaner",
                "Cotton Bedding Set",
                "Wall Clock"
            ],
            [
                "IKEA",
                "Bosch",
                "Philips"
            ]
        ),

        new(
            "Sports",
            "sports",
            "SPRT",
            9.99m,
            899.99m,
            [
                "Yoga Mat",
                "Football",
                "Training Gloves",
                "Resistance Bands",
                "Sports Bottle",
                "Treadmill Mat",
                "Dumbbell Set",
                "Tennis Racket",
                "Cycling Helmet",
                "Fitness Tracker"
            ],
            [
                "Nike",
                "Adidas",
                "Puma",
                "Reebok"
            ]
        ),

        new(
            "Books",
            "books",
            "BOOK",
            5.99m,
            89.99m,
            [
                "Software Architecture Guide",
                "Modern Web Development",
                "Clean Code Handbook",
                "Business Strategy Essentials",
                "English Learning Workbook",
                "Data Structures Guide",
                "Product Management Playbook",
                "Cloud Computing Basics",
                "UX Design Principles",
                "Personal Finance Manual"
            ],
            [
                "Penguin",
                "Oxford"
            ]
        ),

        new(
            "Toys & Games",
            "toys-games",
            "TOYS",
            8.99m,
            399.99m,
            [
                "Building Blocks Set",
                "Strategy Board Game",
                "Remote Control Car",
                "Creative Art Kit",
                "Puzzle Collection",
                "Science Experiment Kit",
                "Doll House Set",
                "Action Figure Pack",
                "Educational Cards",
                "Kids Music Keyboard"
            ],
            [
                "LEGO",
                "Hasbro"
            ]
        ),

        new(
            "Automotive",
            "automotive",
            "AUTO",
            12.99m,
            699.99m,
            [
                "Car Vacuum",
                "Tire Inflator",
                "Phone Mount",
                "Emergency Tool Kit",
                "Seat Organizer",
                "Dash Camera",
                "Car Charger",
                "Cleaning Brush Set",
                "Jump Starter",
                "LED Headlight Kit"
            ],
            [
                "Bosch",
                "Philips"
            ]
        ),

        new(
            "Grocery",
            "grocery",
            "GROC",
            2.99m,
            79.99m,
            [
                "Breakfast Cereal",
                "Dark Chocolate Box",
                "Coffee Capsules",
                "Herbal Tea Pack",
                "Protein Snack Bars",
                "Pasta Selection",
                "Olive Oil Bottle",
                "Mixed Nuts Pack",
                "Instant Coffee Jar",
                "Cooking Sauce Set"
            ],
            [
                "Nestle"
            ]
        ),

        new(
            "Health & Wellness",
            "health-wellness",
            "HLTH",
            6.99m,
            499.99m,
            [
                "Digital Thermometer",
                "Blood Pressure Monitor",
                "Massage Gun",
                "Vitamin Organizer",
                "First Aid Kit",
                "Heating Pad",
                "Posture Support",
                "Sleep Mask Set",
                "Smart Scale",
                "Humidifier"
            ],
            [
                "Nivea",
                "Philips"
            ]
        ),

        new(
            "Pet Supplies",
            "pet-supplies",
            "PETS",
            4.99m,
            249.99m,
            [
                "Dry Cat Food",
                "Dog Treat Pack",
                "Pet Water Fountain",
                "Cat Litter Box",
                "Dog Leash",
                "Pet Grooming Brush",
                "Bird Feeder",
                "Pet Bed",
                "Puppy Training Pads",
                "Interactive Pet Toy"
            ],
            [
                "Purina"
            ]
        ),

        new(
            "Office & Stationery",
            "office-stationery",
            "OFFC",
            3.99m,
            399.99m,
            [
                "Notebook Set",
                "Gel Pen Pack",
                "Wireless Presenter",
                "Desk Organizer",
                "Ergonomic Mouse Pad",
                "Document Folder Pack",
                "Label Maker",
                "Office Calculator",
                "USB Desk Lamp",
                "Whiteboard Kit"
            ],
            [
                "Lenovo",
                "Logitech",
                "Oxford",
                "Philips"
            ]
        )
  ];
}

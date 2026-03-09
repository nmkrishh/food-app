export const ALL_CATEGORIES = [
  { id: 'favourites', name: 'Mini Roastery Favourites', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
  { id: 'dessert', name: 'Dessert', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop' },
  { id: 'cascara', name: 'Cascara', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop' },
  { id: 'coldbrew', name: 'Cold Brew', image: 'https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=400&h=300&fit=crop' },
  { id: 'hotmilk', name: 'Hot Milk Coffee', image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400&h=300&fit=crop' },
  { id: 'icecream', name: 'Ice-cream Blend Cold Coffee', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop' },
  { id: 'icedcold', name: 'Iced Cold Coffee', image: 'https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=400&h=300&fit=crop' },
  { id: 'others', name: 'Others Beverage', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop' },
  { id: 'breakfast', name: 'Breakfast', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop' },
  { id: 'smoothie', name: 'Smoothie Bowl', image: 'https://images.unsplash.com/photo-1490914327627-9fe8d52f4d90?w=400&h=300&fit=crop' },
  { id: 'salads', name: 'Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
  { id: 'appetizer', name: 'Appetizer', image: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&h=300&fit=crop' },
  { id: 'breads', name: 'Breads And Bruschetta', image: 'https://images.unsplash.com/photo-1568600891665-95d5e69a2468?w=400&h=300&fit=crop' },
  { id: 'burgers', name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
  { id: 'sandwiches', name: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop' },
  { id: 'pasta', name: 'Pasta', image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop' },
  { id: 'handmade', name: 'Hand-Made Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop' },
  { id: 'lasagne', name: 'Lasagne', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop' },
  { id: 'equipment', name: 'Coffee Equipment', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop' },
  { id: 'topups', name: 'Food Enhancer Top Ups', image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop' },
];

export const MENU_ITEMS = {
  favourites: [
    { id: 'f1', name: 'Mini Zucchini Fries', price: 212, veg: true, desc: 'Half Portion - crispy zucchini fries served with dip', img: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=200&h=200&fit=crop', customizable: false, tag: 'Vegetarian' },
    { id: 'f2', name: 'Mini Cheese Garlic Bread', price: 201, veg: true, desc: '2 pcs - toasted bread with cheese and garlic butter', img: 'https://images.unsplash.com/photo-1568600891665-95d5e69a2468?w=200&h=200&fit=crop', customizable: false, tag: 'Vegetarian' },
    { id: 'f3', name: 'Mini Veg Club Sandwich', price: 245, veg: true, desc: 'Classic club sandwich with fresh veggies and mayo', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&h=200&fit=crop', customizable: false, tag: 'Vegetarian' },
    { id: 'f4', name: 'Chicken Wings', price: 320, veg: false, desc: 'Crispy chicken wings tossed in tangy sauce, served with dip', img: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=200&h=200&fit=crop', customizable: false, tag: 'Non Vegetarian' },
    { id: 'f5', name: 'Chicken Bruschetta', price: 280, veg: false, desc: 'Toasted bread topped with seasoned chicken and fresh herbs', img: 'https://images.unsplash.com/photo-1568600891665-95d5e69a2468?w=200&h=200&fit=crop', customizable: false, tag: 'Non Vegetarian' },
  ],
  dessert: [
    { id: 'd1', name: 'Burnt Cheese Cake', price: 330, veg: false, desc: '[Contains Lactose, Contains Gluten] Rich and creamy burnt basque cheesecake', img: 'https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=200&h=200&fit=crop', customizable: false },
    { id: 'd2', name: 'Twiced Baked Chocolate Cake Slice', price: 340, veg: false, desc: '[Contains Lactose, Contains Gluten] Rich double-baked chocolate cake with ganache', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop', customizable: false },
    { id: 'd3', name: 'Pancakes (3 Pieces)', price: 287, veg: false, desc: '[Contains Lactose, Contain egg, Contains Gluten] Fluffy pancakes with maple syrup', img: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=200&h=200&fit=crop', customizable: false },
    { id: 'd4', name: 'Brownie with Ice Cream & Chocolate', price: 355, veg: false, desc: '[Contains Lactose, Contains Gluten] Warm brownie with vanilla ice cream', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&h=200&fit=crop', customizable: false },
  ],
  cascara: [
    { id: 'c1', name: 'Roastery Cascara Mojito', price: 233, veg: true, desc: 'Sun-dried husk from coffee cherry steeped in hot water with mint and lime', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop', customizable: false },
    { id: 'c2', name: 'Hot Cascara', price: 212, veg: true, desc: '[Lactose Free] Sun dried coffee cherry husks steeped in hot water', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop', customizable: false, dietTag: 'Lactose Free' },
    { id: 'c3', name: 'Honey And Lemon Hot Cascara', price: 225, veg: true, desc: 'Warm cascara sweetened with honey and brightened with fresh lemon', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop', customizable: false },
    { id: 'c4', name: 'Iced Cascara', price: 240, veg: true, desc: 'Chilled cascara over ice - refreshing fruity coffee alternative', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop', customizable: false },
  ],
  coldbrew: [
    { id: 'cb1', name: 'Classic Cold Brew', price: 270, veg: true, desc: 'Slow steeped 18 hours for a smooth, rich and low-acid flavour', img: 'https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=200&h=200&fit=crop', customizable: false },
    { id: 'cb2', name: 'Cold Brew Tonic', price: 295, veg: true, desc: 'Cold brew poured over sparkling tonic water with a citrus twist', img: 'https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=200&h=200&fit=crop', customizable: false },
    { id: 'cb3', name: 'Nitro Cold Brew', price: 320, veg: true, desc: 'Nitrogen-infused cold brew for an ultra-smooth, creamy texture', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop', customizable: false },
  ],
  hotmilk: [
    { id: 'hm1', name: 'Milk Mocha', price: 259, veg: true, desc: 'A bold blend of double-shot espresso, steamed milk and chocolate', img: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=200&h=200&fit=crop', customizable: true },
    { id: 'hm2', name: 'Cafe Latte', price: 240, veg: true, desc: 'A mild brew of double-shot espresso with a more milky, silky texture', img: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=200&h=200&fit=crop', customizable: true },
    { id: 'hm3', name: 'Pourover Coffee', price: 233, veg: true, desc: '[Lactose Free] The Pour Over method entails pouring hot water over coffee grounds in a filter', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop', customizable: true },
    { id: 'hm4', name: 'Cappuccino', price: 220, veg: true, desc: 'Equal parts espresso, steamed milk and velvety milk foam', img: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=200&h=200&fit=crop', customizable: true },
  ],
  icecream: [
    { id: 'ic1', name: 'Dairy Free Iced Latte', price: 291, veg: true, desc: 'Ristretto + Dairy Free Milk + Ice - light and refreshing', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop', customizable: false },
    { id: 'ic2', name: 'Ice Cream Cold Coffee', price: 310, veg: true, desc: 'Cold coffee blended with vanilla ice cream', img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&h=200&fit=crop', customizable: false },
    { id: 'ic3', name: 'Mocha Frappe', price: 330, veg: true, desc: 'Blended espresso, chocolate and ice cream with whipped cream', img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&h=200&fit=crop', customizable: false },
  ],
  icedcold: [
    { id: 'icd1', name: 'Iced Americano', price: 199, veg: true, desc: 'Double espresso poured over ice', img: 'https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=200&h=200&fit=crop', customizable: true },
    { id: 'icd2', name: 'Iced Latte', price: 240, veg: true, desc: 'Espresso with cold milk over ice', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop', customizable: true },
    { id: 'icd3', name: 'Iced Cappuccino', price: 250, veg: true, desc: 'Chilled espresso with cold foam and ice', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop', customizable: true },
  ],
  others: [
    { id: 'ob1', name: 'Fresh Lime Soda', price: 150, veg: true, desc: 'Fresh lime with sparkling water, sweet or salted', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop', customizable: false },
    { id: 'ob2', name: 'Iced Tea', price: 160, veg: true, desc: 'Chilled brewed tea with lemon and mint', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop', customizable: false },
    { id: 'ob3', name: 'Virgin Mojito', price: 175, veg: true, desc: 'Fresh mint, lime and soda water over crushed ice', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop', customizable: false },
  ],
  breakfast: [
    { id: 'br1', name: 'Avocado Toast', price: 350, veg: true, desc: 'Sourdough toast with smashed avocado and chilli flakes', img: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=200&h=200&fit=crop', customizable: false },
    { id: 'br2', name: 'English Breakfast', price: 450, veg: false, desc: '[Contains Egg] Eggs, sausage, baked beans, mushroom and toast', img: 'https://images.unsplash.com/photo-1533089860892-a7c6f10a081a?w=200&h=200&fit=crop', customizable: false },
    { id: 'br3', name: 'Granola Bowl', price: 290, veg: true, desc: 'Homemade granola with yogurt, honey and seasonal fruit', img: 'https://images.unsplash.com/photo-1490914327627-9fe8d52f4d90?w=200&h=200&fit=crop', customizable: false },
  ],
  smoothie: [
    { id: 'sm1', name: 'Acai Smoothie Bowl', price: 380, veg: true, desc: 'Acai blend topped with granola, banana, berries and coconut', img: 'https://images.unsplash.com/photo-1490914327627-9fe8d52f4d90?w=200&h=200&fit=crop', customizable: false },
    { id: 'sm2', name: 'Mango Smoothie Bowl', price: 350, veg: true, desc: 'Fresh mango with coconut flakes, chia seeds and granola', img: 'https://images.unsplash.com/photo-1490914327627-9fe8d52f4d90?w=200&h=200&fit=crop', customizable: false },
  ],
  salads: [
    { id: 'sl1', name: 'Caesar Salad', price: 320, veg: false, desc: '[Contains Egg] Romaine lettuce, croutons, parmesan and caesar dressing', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop', customizable: false },
    { id: 'sl2', name: 'Greek Salad', price: 295, veg: true, desc: 'Feta, kalamata olives, cucumber, tomatoes and oregano', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop', customizable: false },
  ],
  appetizer: [
    { id: 'ap1', name: 'Garlic Bread', price: 180, veg: true, desc: 'Toasted bread with garlic butter and fresh herbs', img: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=200&h=200&fit=crop', customizable: false },
    { id: 'ap2', name: 'Chicken Strips', price: 280, veg: false, desc: 'Golden crispy chicken strips with honey mustard sauce', img: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=200&h=200&fit=crop', customizable: false },
    { id: 'ap3', name: 'Loaded Nachos', price: 320, veg: true, desc: 'Tortilla chips with cheese sauce, jalapenos and salsa', img: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=200&h=200&fit=crop', customizable: false },
  ],
  breads: [
    { id: 'bb1', name: 'Bruschetta Classica', price: 260, veg: true, desc: 'Toasted sourdough with fresh tomatoes, garlic and basil', img: 'https://images.unsplash.com/photo-1568600891665-95d5e69a2468?w=200&h=200&fit=crop', customizable: false },
    { id: 'bb2', name: 'Avocado Bruschetta', price: 295, veg: true, desc: 'Sourdough with smashed avocado, microgreens and lemon zest', img: 'https://images.unsplash.com/photo-1568600891665-95d5e69a2468?w=200&h=200&fit=crop', customizable: false },
    { id: 'bb3', name: 'Mushroom Bruschetta', price: 275, veg: true, desc: 'Sauteed wild mushrooms on toasted sourdough with thyme', img: 'https://images.unsplash.com/photo-1568600891665-95d5e69a2468?w=200&h=200&fit=crop', customizable: false },
  ],
  burgers: [
    { id: 'bu1', name: 'Classic Beef Burger', price: 420, veg: false, desc: '[Contains Gluten] Juicy beef patty with lettuce, tomato, cheese and sauce', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop', customizable: true },
    { id: 'bu2', name: 'Veggie Burger', price: 350, veg: true, desc: '[Contains Gluten] Grilled veggie patty with fresh toppings and aioli', img: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=200&h=200&fit=crop', customizable: true },
    { id: 'bu3', name: 'Chicken Burger', price: 390, veg: false, desc: '[Contains Gluten] Crispy chicken fillet with slaw and sriracha mayo', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop', customizable: true },
  ],
  sandwiches: [
    { id: 'sw1', name: 'Club Sandwich', price: 310, veg: false, desc: 'Triple-decker with grilled chicken, egg and fresh vegetables', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&h=200&fit=crop', customizable: false },
    { id: 'sw2', name: 'Caprese Sandwich', price: 280, veg: true, desc: 'Fresh mozzarella, ripe tomato and basil pesto on ciabatta', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&h=200&fit=crop', customizable: false },
    { id: 'sw3', name: 'Grilled Cheese', price: 220, veg: true, desc: 'Three-cheese blend melted in toasted sourdough bread', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&h=200&fit=crop', customizable: false },
  ],
  pasta: [
    { id: 'pa1', name: 'Mini Spaghetti Spinach Alfredo Pasta', price: 303, veg: true, desc: '[Contains Lactose, Contains Gluten] Creamy spinach alfredo sauce with spaghetti', img: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=200&h=200&fit=crop', customizable: false },
    { id: 'pa2', name: 'Penne Arrabbiata', price: 320, veg: true, desc: '[Contains Gluten] Penne in spicy tomato sauce with garlic and chilli', img: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=200&h=200&fit=crop', customizable: false },
    { id: 'pa3', name: 'Chicken Pasta', price: 380, veg: false, desc: '[Contains Lactose, Contains Gluten] Grilled chicken in creamy white sauce', img: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=200&h=200&fit=crop', customizable: false },
  ],
  handmade: [
    { id: 'hp1', name: 'Handmade Gnocchi', price: 420, veg: true, desc: '[Contains Lactose] Soft potato gnocchi in brown butter and sage sauce', img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop', customizable: false },
    { id: 'hp2', name: 'Fresh Tagliatelle al Ragu', price: 450, veg: false, desc: '[Contains Egg, Contains Gluten] Fresh egg pasta with slow-cooked meat ragu', img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop', customizable: false },
    { id: 'hp3', name: 'Spinach Ravioli', price: 430, veg: true, desc: '[Contains Lactose, Contains Egg] Handmade ravioli stuffed with ricotta and spinach', img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop', customizable: false },
  ],
  lasagne: [
    { id: 'la1', name: 'Classic Beef Lasagne', price: 480, veg: false, desc: '[Contains Lactose, Contains Gluten] Layers of pasta, slow-cooked beef ragu and bechamel', img: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=200&h=200&fit=crop', customizable: false },
    { id: 'la2', name: 'Vegetarian Lasagne', price: 430, veg: true, desc: '[Contains Lactose, Contains Gluten] Roasted vegetable, ricotta and spinach lasagne', img: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=200&h=200&fit=crop', customizable: false },
  ],
  equipment: [
    { id: 'eq1', name: 'Chemex Pour Over (6 Cup)', price: 2800, veg: true, desc: 'Classic all-glass Chemex pour over coffee maker', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop', customizable: false },
    { id: 'eq2', name: 'Hario V60 Ceramic Dripper', price: 1200, veg: true, desc: 'Japanese ceramic pour-over dripper for precise extraction', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop', customizable: false },
    { id: 'eq3', name: 'Fellow Stagg Kettle', price: 4500, veg: true, desc: 'Variable temperature gooseneck kettle for perfect pour over', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop', customizable: false },
  ],
  topups: [
    { id: 'tu1', name: 'Extra Shot Espresso', price: 60, veg: true, desc: 'Add an extra shot of espresso to any drink', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop', customizable: false },
    { id: 'tu2', name: 'Oat Milk Upgrade', price: 80, veg: true, desc: 'Swap dairy milk for creamy oat milk', img: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=200&h=200&fit=crop', customizable: false },
    { id: 'tu3', name: 'Flavoured Syrup', price: 40, veg: true, desc: 'Choice of vanilla, caramel or hazelnut', img: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=200&h=200&fit=crop', customizable: false },
    { id: 'tu4', name: 'Whipped Cream', price: 50, veg: true, desc: 'Add a dollop of fresh whipped cream', img: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=200&h=200&fit=crop', customizable: false },
  ],
};

export const POPULAR_ITEMS = [
  { id: 'ic1', name: 'Dairy Free Iced Latte', price: 291, veg: true, desc: 'Ristretto + Dairy Free Milk + Ice', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop', customizable: false },
  { id: 'pa1', name: 'Mini Spaghetti Spinach Alfredo Pasta', price: 303, veg: true, desc: '[Contains Lactose, Contains Gluten] Creamy spinach alfredo sauce', img: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=200&h=200&fit=crop', customizable: false },
  { id: 'pop3', name: 'Margherita Pizza', price: 533, veg: true, desc: '[Contains Lactose, Contains Gluten] Flatbread pizza with fresh tomato and mozzarella', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop', customizable: false },
  { id: 'hm1', name: 'Milk Mocha', price: 259, veg: true, desc: 'A bold blend of double-shot espresso, milk and chocolate', img: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=200&h=200&fit=crop', customizable: true },
  { id: 'hm2', name: 'Cafe Latte', price: 240, veg: true, desc: 'A mild brew of double-shot espresso with milky texture', img: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=200&h=200&fit=crop', customizable: true },
  { id: 'hm3', name: 'Pourover Coffee', price: 233, veg: true, desc: '[Lactose Free] The Pour Over method entails pouring hot water over coffee grounds', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop', customizable: true },
];

export const ALL_ITEMS = [
  ...POPULAR_ITEMS,
  ...Object.values(MENU_ITEMS).flat(),
].filter((item, idx, self) => self.findIndex(i => i.id === item.id) === idx);

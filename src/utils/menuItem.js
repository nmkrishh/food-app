const SIZE_OPTIONS = {
  groupLabel: 'Choose size',
  options: [
    { id: 'small', label: 'Small', priceDelta: -20, note: 'Lighter serving' },
    { id: 'medium', label: 'Medium', priceDelta: 0, note: 'Most ordered' },
    { id: 'large', label: 'Large', priceDelta: 40, note: 'Extra serving' },
  ],
};

const BURGER_OPTIONS = {
  groupLabel: 'Choose build',
  options: [
    { id: 'classic', label: 'Classic build', priceDelta: 0, note: 'Original recipe' },
    { id: 'cheese', label: 'Cheese loaded', priceDelta: 35, note: 'Extra cheese and sauce' },
    { id: 'double', label: 'Double patty', priceDelta: 90, note: 'Heavier meal' },
  ],
};

export function getCustomizationConfig(item, categoryId) {
  if (item?.customization?.options?.length) {
    return {
      groupLabel: item.customization.groupLabel || 'Choose an option',
      options: item.customization.options.map(option => ({
        id: option.id,
        label: option.label,
        priceDelta: Number(option.priceDelta || 0),
        note: option.note || '',
      })),
    };
  }

  if (!item?.customizable) return null;

  if (categoryId === 'burgers') {
    return BURGER_OPTIONS;
  }

  if (categoryId === 'hotmilk' || categoryId === 'icedcold') {
    return SIZE_OPTIONS;
  }

  return {
    groupLabel: 'Choose your preference',
    options: [
      { id: 'regular', label: 'Regular', priceDelta: 0, note: 'Chef recommended' },
      { id: 'premium', label: 'Premium', priceDelta: 30, note: 'Extra finishing' },
    ],
  };
}

export function normalizeMenuItem(item, categoryId) {
  const customization = getCustomizationConfig(item, categoryId);
  const parsedOldPrice = Number(item.oldPrice ?? item.old_price);

  return {
    id: item.id,
    categoryId,
    name: item.name,
    isVeg: item.veg,
    price: Number(item.price),
    oldPrice: Number.isFinite(parsedOldPrice) ? parsedOldPrice : null,
    desc: item.desc || item.description || '',
    tag: item.tag || 'Highly reordered',
    img: item.img || item.image || '/latte.avif',
    customizable: Boolean(customization?.options?.length),
    customization,
  };
}

export function getItemPrice(item, selection) {
  return item.price + (selection?.priceDelta || 0);
}
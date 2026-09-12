from typing import List
from schema.schemas import MenuItemOut, MenuCategoryOut


class MenuService:
    """Service that provides menu data.

    All methods are instance methods so they live inside this class as requested.
    """

    def __init__(self):
        self._categories = self._load_sample()

    def _load_sample(self) -> List[MenuCategoryOut]:
        return [
            MenuCategoryOut(
                id="coffee",
                name="Signature Coffee",
                description="Ethically sourced, locally roasted beans.",
                items=[
                    MenuItemOut(id="c1", name="Oasis Cappuccino", description="Rich espresso balanced with micro-foam", price=4.5),
                    MenuItemOut(id="c2", name="Iced Vanilla Latte", description="Chilled espresso over ice", price=5.25),
                    MenuItemOut(id="c3", name="Single Origin Espresso", description="A vibrant concentrated shot", price=3.5),
                ],
            ),
            MenuCategoryOut(
                id="pastries",
                name="Pastries",
                description="Freshly baked daily",
                items=[
                    MenuItemOut(id="p1", name="Almond Croissant", description="Warmed", price=6.0),
                    MenuItemOut(id="p2", name="Blueberry Muffin", description="Sweet and soft", price=3.5),
                ],
            ),
        ]

    def list_categories(self) -> List[MenuCategoryOut]:
        return self._categories

    def list_items(self) -> List[MenuItemOut]:
        items: List[MenuItemOut] = []
        for c in self._categories:
            items.extend(c.items)
        return items

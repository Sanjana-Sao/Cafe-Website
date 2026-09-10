from fastapi import APIRouter, Depends
from typing import List
from ..schema.schemas import MenuItemOut
from ..services.menu_service import MenuService

router = APIRouter()


@router.get("/menu", response_model=List[MenuItemOut])
def get_menu(service: MenuService = Depends(MenuService)):
    """Return flat list of menu items."""
    return service.list_items()

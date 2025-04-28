import MenuItemsTable from "./menu.items.table";

interface IProps {
    menuItems: any[];
    meta: any;
    menus: any[];
}

const MenuItemsWrapper = ({ menuItems, meta, menus }: IProps) => {
    return <MenuItemsTable menuItems={menuItems} meta={meta} menus={menus} />;
};

export default MenuItemsWrapper;

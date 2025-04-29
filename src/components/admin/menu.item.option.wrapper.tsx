import MenuItemOptionTable from "./menu.item.option.table";

interface IProps {
    menuItemOptions: any[];
    meta: any;
    menuItems: any[];
}

const MenuItemOptionWrapper = ({ menuItemOptions, meta, menuItems }: IProps) => {
    return <MenuItemOptionTable menuItemOptions={menuItemOptions} meta={meta} menuItems={menuItems} />;
};

export default MenuItemOptionWrapper;
